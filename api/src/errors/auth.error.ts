export class UserAlreadyExistsError extends Error {
  constructor() {
    super("User not found");
    this.name = new.target.name;
  }
}

export class InvalidEmailNameOrPasswordError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = new.target.name;
  }
}
export class InvalidAdminSecrete extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = new.target.name;
  }
}

