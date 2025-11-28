export class AppError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
		this.name = "AppError";
	}
}

export function mapErr(err: unknown): AppError {
	// Handle regular Error objects with message strings
	if (err instanceof Error) {
		const message = err.message;

		// Map known error messages to AppError
		switch (message) {
			case "favorite_not_found":
				return new AppError("favorite_not_found", 404);
			case "activity_not_found":
				return new AppError("activity_not_found", 404);
			case "event_not_found":
				return new AppError("event_not_found", 404);
			case "user_not_found":
				return new AppError("user_not_found", 404);
			case "room_not_found":
				return new AppError("room_not_found", 404);
			case "auth_account_not_found":
				return new AppError("auth_account_not_found", 404);
			case "invalid_email_or_password":
				return new AppError("invalid_email_or_password", 401);
			case "not_authenticated":
				return new AppError("not_authenticated", 401);
			case "can't interact with this resource":
				return new AppError("can't interact with this resource", 403);
			case "room_not_available":
				return new AppError("room_not_available", 409);
			default:
				break;
		}
	}

	// Handle database errors with code property
	if (
		err &&
		typeof err === "object" &&
		"code" in err &&
		typeof (err as { code: string }).code === "string"
	) {
		const code = (err as { code: string }).code;

		switch (code) {
			case "23505":
				return new AppError("duplicate_resource", 409);
			case "23502":
				return new AppError("missing_required_field", 400);
			case "22P02":
				return new AppError("invalid_format", 400);
			case "23514":
				return new AppError("constraint_violation", 400);
			default:
				return new AppError("internal_database_error", 500);
		}
	}

	// Fallback for unknown errors
	return new AppError("internal_server_error", 500);
}
