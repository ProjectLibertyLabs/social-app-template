import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import * as AssetsHandler from '../handlers/AssetsHandler';
import { HttpStatusCode } from 'axios';
import multer from 'multer';
import { HttpError } from '../types/HttpError';

export class AssestsController extends BaseController {
  private upload: multer.Multer;

  constructor(app: Express) {
    super(app, '/assets');
  }

  protected initializeRoutes(): void {
    this.upload = multer({ storage: multer.memoryStorage() });
    this.router.post('/', this.upload.array('files'), this.postAssets.bind(this));
  }

  public async postAssets(req: Request, res: Response) {
    const { files } = req;
    if (!Array.isArray(files) || !files.length) {
      return res.status(HttpStatusCode.BadRequest).send('Empty asset upload request');
    }

    try {
      const response = await AssetsHandler.postAssetsHandler(files);
      res.status(HttpStatusCode.Created).send(response);
    } catch (err: any) {
      console.error(err.message);
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message);
      }

      return res.status(HttpStatusCode.InternalServerError).send(err.message);
    }
  }
}
