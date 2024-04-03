import { Context, Handler } from "openapi-backend";
import { Request, Response } from "express";
import type * as T from "../types/openapi.js";
import { FileUploader } from "../services/FileUploader.js";

export const postAssetsHandler: Handler<
  T.Paths.PostAssetsHandler.RequestBody
> = async (c: Context, req: Request, res: Response, next) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    const response = await FileUploader.call(files);

    return res.status(202).json(response);
  } catch (e) {
    console.error(e);
    return res.status(503).json({ err: c.validation.errors });
  }
};
