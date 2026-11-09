import { deleteFileRoute } from "#/files/routes/delete-file.js";
import { downloadFileRoute } from "#/files/routes/download-file.js";
import { getFilesRoute } from "#/files/routes/get-files.js";
import { uploadFileRoute } from "#/files/routes/upload-file.js";
import multipart from "@fastify/multipart";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const files: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(multipart, {
    limits: {
      files: 1,
      fileSize: fastify.config.UPLOAD_SIZE_LIMIT,
    },
  });

  fastify.register(getFilesRoute);
  fastify.register(uploadFileRoute);
  fastify.register(downloadFileRoute);
  fastify.register(deleteFileRoute);
};
