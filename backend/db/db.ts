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

	async postUser(user: UserInput) {
		const res = await this.sql<User[]>`
        INSERT INTO users (username, full_name, bio, job_title, avatar_url)
        VALUES (${user.username}, ${user.full_name}, ${user.bio}, ${user.job_title}, ${user.avatar_url})
        RETURNING *
        `;
		return res[0];
	}
}
