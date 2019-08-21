import express from 'express';

export default class JSONResponse {
  public static success(
    req: express.Request,
    res: express.Response,
    data?: object[],
    message?: string,
  ): void {
    res.status(200).json({
      code: 200,
      message: message || 'success',
      data: data || [],
    });
  }

  public static serverError(
    req: express.Request,
    res: express.Response,
    data: object[],
    message?: string,
  ): void {
    res.status(500).json({
      code: 500,
      message: message || 'internal server error',
      data,
    });
  }
}
