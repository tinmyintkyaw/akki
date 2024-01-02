import { Request, RequestHandler } from "express";
import { z } from "zod";

interface RequestSchema {
  params?: z.ZodTypeAny;
  body?: z.ZodTypeAny;
}

/**
 * Express Request validated with validator middleware
 *
 * @template ParamsSchema - Zod schema for req.params.
 * @template BodySchema - Zod schema for req.body.
 */

interface TypedRequest<Params extends z.ZodTypeAny, Body extends z.ZodTypeAny>
  extends Request<z.infer<Params>, never, z.infer<Body>> {}

interface TypedRequestHandler<
  Params extends z.ZodTypeAny,
  Body extends z.ZodTypeAny,
> extends RequestHandler<
    z.infer<Params>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    z.infer<Body>
  > {}

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

export {
  RequestSchema,
  TypedRequest,
  TypedRequestHandler,
  createRequestValidator,
};
