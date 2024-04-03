import axios from "axios";
import FormData from "form-data";
import { FileUploader } from "./FileUploader";
import { describe, vi, expect, test, afterEach, MockedFunction } from "vitest";

vi.mock("axios");
describe("FileUploader", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test("uploads files successfully", async () => {
    const files: Express.Multer.File[] = [
      {
        fieldname: "fields",
        buffer: Buffer.from("hello world", "utf8"),
        filename: "file1.txt",
        mimetype: "text/plain",
      } as Express.Multer.File,
      {
        fieldname: "file2",
        buffer: Buffer.from("hello world", "utf8"),
        filename: "file2.txt",
        mimetype: "text/plain",
      } as Express.Multer.File,
    ];

    const uploadUrl = "http://localhost:3000/api/asset/upload";

    const formData = new FormData();
    formData.append("file1", files[0].fieldname, {
      filename: files[0].filename,
      contentType: files[0].mimetype,
    });
    formData.append("file2", files[1].fieldname, {
      filename: files[1].filename,
      contentType: files[1].mimetype,
    });

    const responseData = ["asset1", "asset2"];
    (axios.put as MockedFunction<typeof axios.put>).mockResolvedValueOnce({
      data: responseData,
      status: 202,
    });

    const result = await FileUploader.call(files, uploadUrl);

    expect(result).toEqual(responseData);
  });

  test("throws an error if the request fails", async () => {
    const files: Express.Multer.File[] = [
      {
        fieldname: "fields",
        buffer: Buffer.from("hello world", "utf8"),
        filename: "file1.txt",
        mimetype: "text/plain",
      } as Express.Multer.File,
    ];

    const uploadUrl = "http://localhost:3000/api/asset/upload";

    const formData = new FormData();
    formData.append("file1", files[0].fieldname, {
      filename: files[0].filename,
      contentType: files[0].mimetype,
    });

    (axios.put as MockedFunction<typeof axios.put>).mockResolvedValueOnce({
      status: 500,
    });

    await expect(FileUploader.call(files, uploadUrl)).rejects.toThrowError(
      "Request failed with status code 500",
    );
  });
});
