export * from "./auth.error";
export * from "./internal.error";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class UnauthorizedError extends Error {
  constructor() {
    super("unauthorized");
  }
}
