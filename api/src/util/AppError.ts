// src/utils/AppError.ts
type AppErrorProp = {
  message:string;
  statusCode:number;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(appErrorProps:AppErrorProp) {
    const {message,statusCode} = appErrorProps;
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // for known, handled errors
    Error.captureStackTrace(this, this.constructor);
  }
}
