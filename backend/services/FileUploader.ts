import axios from "axios";
import FormData from "form-data";
export class FileUploader {
  static async call(
    files: Express.Multer.File[],
    uploadUrl: string = process.env.UPLOAD_ENDPOINT ||
      "http://localhost:3000/api/asset/upload",
  ): Promise<string[]> {
    const formData = files.reduce((acc, file) => {
      acc.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      return acc;
    }, new FormData());

    try {
      const response = await axios.put(uploadUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error(`Request failed with status code ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
