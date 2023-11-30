import { auth } from "@/configs/lucia-config";
import SessionResponse from "@/shared/types/session-response";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const sessionController: RequestHandler = async (req, res) => {
  try {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();

    const sessionResponse: SessionResponse = {
      user: { ...session.user },
    };

    return res.status(200).json(sessionResponse);
  } catch (error) {
    return res.sendStatus(401);
  }
};

export default asyncHandler(sessionController);
