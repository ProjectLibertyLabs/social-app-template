import FormData from "form-data";
import { ContentPublisherRepository } from "../repositories/ContentPublisherRepository.js";

type File = Express.Multer.File;
export class AssetsService {
  static async create(files: File[]): Promise<string[]> {
    const formData = files.reduce((acc, file) => {
      acc.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      return acc;
    }, new FormData());

    try {
      const repository = await ContentPublisherRepository.getInstance();
      const response = await repository.uploadAsset(formData);
      return response.assetIds;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
