import { Request, RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { z } from "zod";

interface RequestSchema {
  params?: z.AnyZodObject;
  body?: z.AnyZodObject;
}

/**
 * Express Request validated with validator middleware
 *
 * @template ParamsSchema - Zod schema for req.params.
 * @template BodySchema - Zod schema for req.body.
 */
interface TypedRequest<T extends RequestSchema> extends Request {
  body: T["body"] extends z.AnyZodObject
    ? z.infer<T["body"]>
    : Record<string, unknown>;
  params: T["params"] extends z.AnyZodObject
    ? z.infer<T["params"]>
    : ParamsDictionary;
}

/**
 * Creates a request validator middleware, uses Zod under the hood.
 * @param schemas @type {ValidatorSchemas}
 * @returns @type {RequestHandler}
 */
const createRequestValidator = (schema: RequestSchema) => {
  const middleware: RequestHandler = (req, res, next) => {
    const { params: paramsSchema, body: bodySchema } = schema;
    try {
      if (paramsSchema) {
        req.params = paramsSchema.parse(req.params);
      } else if (bodySchema) {
        req.body = bodySchema.parse(req.body);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
  return middleware;
};

export { RequestSchema, TypedRequest, createRequestValidator };
