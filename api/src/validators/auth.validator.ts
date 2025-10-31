import { ValidationError } from "../errors";
import { AppError } from "../util/AppError";

type SignInValidationProps = {
  email: string;
  password: string;
};

type SignUpValidationProps = {
  password: string;
  fullName: string;
  email: string;
};
export const singInValidation = (props: SignInValidationProps) => {
  const { email, password } = props;

  if (!email || !password)
    throw new ValidationError("Invalid email or password");
};

// ✅ Sign-up validation with regex checks
export const signUpValidation = (props: SignUpValidationProps) => {
  const { fullName, email, password } = props;

  // Basic presence checks
  if (!fullName || !email || !password) {
    throw new ValidationError("All fields are required");
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("invalid email format");
  }

  // Password: 8+ chars, alphanumeric (at least one letter and one number)
  const passwordRegex = /^.{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new ValidationError("password is weak");
  }
};
