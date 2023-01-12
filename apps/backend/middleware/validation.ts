import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
export function validationMiddleware(dto: any) {
  return async function expressFuncs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log(new dto());
    const ddtoclass = plainToInstance(dto, req.body);
    const errors = await validate(ddtoclass, { skipMissingProperties: true });
    if (errors.length > 0) {
      let errorTexts = Array();
      for (const errorItem of errors) {
        errorTexts = errorTexts.concat(errorItem.constraints);
      }
      res.status(400).send(errorTexts);
      return;
    } else {
      next();
    }
  };
}
