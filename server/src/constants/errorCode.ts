const enum AppErrorCode {
	// Tokens
	InvalidAccessToken = "InvalidAccessToken",
	InvalidRefreshToken = "InvalidRefreshToken",
	// Signin Signup
	EmailAlreadyInUse = "EmailAlreadyInUse",
	InvalidCredentials = "InvalidCredentials",
	UserNotFound = "UserNotFound",
	EmailNotVerified = "EmailNotVerified",
	// VerifyCodes
	InvalidVerificationCode = "InvalidVerificationCode",
	ExpiredVerificationCode = "ExpiredVerificationCode",
	PasswordResetTokenExpired = "PasswordResetTokenExpired",
	InvalidPasswordResetToken = "InvalidPasswordResetToken",
	// Authorization
	UnauthorizedAccess = "UnauthorizedAccess",
	ForbiddenAccess = "ForbiddenAccess",
	ValidationError = "ValidationError",
	DatabaseError = "DatabaseError",
	EmailSendFailed = "EmailSendFailed",
}

export default AppErrorCode;
