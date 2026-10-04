import { Request, Response, NextFunction } from "express";

export default function handleErrors(
  err: any,
  _req: Request,
  resp: Response,
  _next: NextFunction
) {
  const status = err.status || err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  if (err.details && Array.isArray(err.details)) {
    message = err.details[0]?.message || message;
  }

  return resp.status(status).json({
    success: false,
    status,
    message,
    ...(err.details && { details: err.details }),
  });
}
