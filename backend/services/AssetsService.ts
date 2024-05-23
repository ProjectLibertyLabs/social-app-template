import FormData from 'form-data';
import { ContentPublisherService } from './ContentPublisherService.js';
import { Components } from '../types/openapi-content-publishing-service.js';

type File = Express.Multer.File;
type UploadAssetResponse = Components.Schemas.UploadResponseDto;

export class AssetsService {
  static async create(files: File[]): Promise<UploadAssetResponse> {
    const formData = files.reduce((acc, file) => {
      acc.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      return acc;
    }, new FormData());

    try {
      const repository = await ContentPublisherService.getInstance();
      const response = await repository.uploadAsset(formData);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
