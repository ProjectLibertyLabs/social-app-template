import { Request } from "express";
import { AssetsService } from "../services/AssetsService.js";
import { HttpError } from "../types/HttpError.js";
import { HttpStatusCode } from "axios";

export async function postAssetsHandler(req: Request) {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    const response = await AssetsService.create(files);

    return response;
  } catch (e: any) {
    throw new HttpError(HttpStatusCode.ServiceUnavailable, `Unable to upload asset(s): ${e.message}`, { cause: e });
  }
};
