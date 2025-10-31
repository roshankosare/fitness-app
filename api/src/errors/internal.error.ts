export class InternalServerError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = new.target.name;
  }
}