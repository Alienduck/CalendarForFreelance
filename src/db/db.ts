import argon2 from "argon2";
import postgres from "postgres";
import type { AuthAccount, AuthAccountInput } from "../models/auth_account.js";
import type { User, UserInput, UserInputPartial } from "../models/user.js";

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
    const res = await this.sql`
      SELECT 
        u.*,
        COALESCE(
          json_agg(
            json_build_object('id', l.id, 'title', l.title, 'url', l.url, 'icon', l.icon_key)
          ) FILTER (WHERE l.id IS NOT NULL), 
          '[]'
        ) as links
      FROM users u
      LEFT JOIN links l ON u.id = l.user_id
      WHERE u.id = ${id}
      GROUP BY u.id
    `;
    return res[0] as User & { links: string[] };
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

  async updateUser(id: string, user: UserInputPartial) {
    const res = await this.sql<User[]>`
      UPDATE users 
      SET ${this.sql(user)}
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

  async getAuthAccounts() {
    return await this.sql<AuthAccount[]>`
    SELECT * FROM auth_accounts
    `;
  }

  async getAuthAccount(id: string) {
    const res = await this.sql<AuthAccount[]>`
    SELECT * FROM auth_accounts
    WHERE user_id = ${id}
    `;
    return res[0];
  }

  async postAuthAccount(user_id: string, auth_account: AuthAccountInput) {
    const res = await this.sql<AuthAccount[]>`
    INSERT INTO auth_accounts (user_id, email, password_hash)
    VALUES (${user_id}, ${auth_account.email}, ${auth_account.password_hash})
    RETURNING *
    `;
    return res[0];
  }

  async updateAuthAccount(user_id: string, update: AuthAccountInput) {
    const fields = Object.entries(update).map(
      ([key, value]) => this.sql`${this.sql.unsafe(key)} = ${value}`,
    );
    if (fields.length === 0) return null;

    const res = await this.sql<AuthAccount[]>`
    UPDATE users SET ${fields.reduce((acc, field, i) =>
      i === 0 ? field : this.sql`${acc} = ${field}`,
    )}
    WHERE id = ${user_id}
    RETURNING *
    `;
    return res[0];
  }

  async deleteAuthAccount(user_id: string) {
    const res = await this.sql<AuthAccount[]>`
    DELETE FROM auth_accounts WHERE id = ${user_id} RETURNING *
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

  async addLink(
    userId: string,
    link: { title: string; url: string; icon?: string },
  ) {
    return await this.sql`
      INSERT INTO links (user_id, title, url, icon_key)
      VALUES (${userId}, ${link.title}, ${link.url}, ${link.icon || "link"})
      RETURNING *
    `;
  }

  async deleteLink(linkId: string, userId: string) {
    return await this.sql`
      DELETE FROM links
      WHERE id = ${linkId} AND user_id = ${userId}
      RETURNING *
    `;
  }
}
