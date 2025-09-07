// const enum is good when we compile to JS it injects the values in our code
const enum VerifyCodeType {
	EmailVerification = "email_verification",
	PasswordReset = "password_reset",
}

export default VerifyCodeType;
