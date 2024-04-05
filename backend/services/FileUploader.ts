import FormData from "form-data";
import { ContentPublisherRepository } from "../repositories/ContentPublisherRepository.js";

type File = Express.Multer.File;
export class FileUploader {
  static async call(files: File[]): Promise<string[]> {
    const formData = files.reduce((acc, file) => {
      acc.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      return acc;
    }, new FormData());

    try {
      const repository = await ContentPublisherRepository.getInstance();
      const assetIds = (await repository.uploadAsset(formData)).assetIds;
      return assetIds;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
