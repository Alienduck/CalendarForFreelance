import argon2 from "argon2";
import postgres from "postgres";
import type { AuthAccount } from "../models/auth_account.js";
import type { User, UserInput } from "../models/user.js";

const sql = postgres();

export class Repository {
  sql: ReturnType<typeof postgres>;

  constructor() {
    this.sql = sql;
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const result = await this.sql<AuthAccount[]>`
      SELECT email, password_hash
      FROM auth_accounts
      WHERE email = ${email}
    `;

    const account = result[0];
    if (!account) return false;

    try {
      const isValid = await argon2.verify(account.password_hash, password);
      return isValid;
    } catch {
      return false;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash;
  }

  async getUsers() {
    return await this.sql<User[]>`
        SELECT * FROM users
        `;
  }

  async getUser(id: string) {
    const res = await this.sql<User[]>`
	SELECT * FROM users
	WHERE id = ${id}
	`;
    return res[0];
  }

  async postUser(user: UserInput): Promise<User[]> {
    const res = await this.sql<User[]>`
        INSERT INTO users (username, full_name, bio, job_title, avatar_url)
        VALUES (${user.username}, ${user.full_name}, ${user.bio ?? null}, ${user.job_title ?? null}, ${user.avatar_url ?? null})
        RETURNING *
        `;
    return res;
  }

  async getUserProfile(username: string): Promise<User | null> {
    const res = await this.sql`
            SELECT 
                u.id, u.username, u.full_name, u.bio, u.job_title, u.avatar_url,
                COALESCE(
                    json_agg(
                        json_build_object('title', l.title, 'url', l.url, 'icon', l.icon_key)
                    ) FILTER (WHERE l.id IS NOT NULL), 
                    '[]'
                ) as links
            FROM users u
            LEFT JOIN links l ON u.id = l.user_id
            WHERE u.username = ${username}
            GROUP BY u.id
        `;
    return res.length ? (res[0] as User) : null;
  }

  async updateUser(id: string, user: UserInput) {
    const fields = Object.entries(user).map(
      ([key, value]) => this.sql`${this.sql.unsafe(key)} = ${value}`,
    );
    if (fields.length === 0) return null;

    const res = await this.sql<User[]>`
	UPDATE users SET ${fields.reduce((acc, field, i) =>
    i === 0 ? field : this.sql`${acc} = ${field}`,
  )}
	WHERE id = ${id}
	RETURNING *
	`;
    return res[0];
  }

  async deleteUser(id: string) {
    const res = await this.sql<User[]>`
	DELETE FROM users WHERE id = ${id} RETURNING *
	`;
    return res[0];
  }

  async getAvailabilities(userId: string, dayOfWeek: number) {
    return await this.sql<{ start_time: string; end_time: string }[]>`
        SELECT start_time, end_time 
        FROM availabilities 
        WHERE user_id = ${userId} 
        AND (day_of_week = ${dayOfWeek})
        ORDER BY start_time ASC
    `;
  }

  async getAppointments(userId: string, dateStr: Date) {
    return await this.sql<{ start_date: Date; end_date: Date }[]>`
        SELECT start_date, end_date 
        FROM appointments 
        WHERE freelance_id = ${userId} 
        AND start_date::date = ${dateStr}::date
        AND status = 'confirmed'
    `;
  }

  async createAppointment(data: {
    freelance_id: string;
    client_name: string;
    client_email: string;
    start_date: Date;
    end_date: Date;
  }) {
    const res = await this.sql`
        INSERT INTO appointments ${this.sql(data)}
        RETURNING id
    `;
    return res[0];
  }
}
