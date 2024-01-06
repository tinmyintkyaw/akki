import { auth } from "@/configs/lucia.js";
import { SessionResponse } from "@project/shared-types";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  try {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();

    if (!session) return res.sendStatus(401);

    const response: SessionResponse = {
      user: { ...session.user },
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.sendStatus(401);
  }
};

export const sessionController = asyncHandler(requestHandler);
