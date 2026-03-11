import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import z from "zod";

export const fileReqParams = spacesReqParams.extend({ fileId: z.uuid() });
