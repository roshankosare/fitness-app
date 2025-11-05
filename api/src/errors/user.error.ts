export class ExistingCurrentPlanError extends Error {
  constructor() {
    super("User already subscribed to this plan");
    this.name = new.target.name;
  }
}

export class ExistingPlanError extends Error {
  constructor() {
    super(
      "You have already have subscribed plan please remove it to add this one"
    );
    this.name = new.target.name;
  }
}
