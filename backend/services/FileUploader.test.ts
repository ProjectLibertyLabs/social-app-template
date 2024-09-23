import 'multer';
import FormData from 'form-data';
import { AssetsService } from './AssetsService.js';
import { describe, vi, expect, test, afterEach, MockedFunction } from 'vitest';
import { ContentPublisherService } from './ContentPublisherService.js';

vi.mock('./ContentPublisherService.js');

describe('FileUploader', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('uploads files successfully', async () => {
    const files: Express.Multer.File[] = [
      {
        fieldname: 'fields',
        buffer: Buffer.from('hello world', 'utf8'),
        filename: 'file1.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File,
      {
        fieldname: 'file2',
        buffer: Buffer.from('hello world', 'utf8'),
        filename: 'file2.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File,
    ];

    const formData = new FormData();
    formData.append('file1', files[0].fieldname, {
      filename: files[0].filename,
      contentType: files[0].mimetype,
    });
    formData.append('file2', files[1].fieldname, {
      filename: files[1].filename,
      contentType: files[1].mimetype,
    });

    const responseData = {
      assetIds: ['asset1', 'asset2'],
    };

    (
      ContentPublisherService.getInstance as MockedFunction<typeof ContentPublisherService.getInstance>
    ).mockResolvedValueOnce({
      uploadAsset: vi.fn().mockResolvedValueOnce(responseData),
    } as any);

    const result = await AssetsService.create(files);

    expect(result).toEqual(responseData);
  });

  test('throws an error if the request fails', async () => {
    const files: Express.Multer.File[] = [
      {
        fieldname: 'fields',
        buffer: Buffer.from('hello world', 'utf8'),
        filename: 'file1.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File,
    ];

    const formData = new FormData();
    formData.append('file1', files[0].fieldname, {
      filename: files[0].filename,
      contentType: files[0].mimetype,
    });

    (
      ContentPublisherService.getInstance as MockedFunction<typeof ContentPublisherService.getInstance>
    ).mockResolvedValueOnce({
      uploadAsset: vi.fn().mockRejectedValueOnce(new Error('Request failed with status code 500')),
    } as any);

    await expect(AssetsService.create(files)).rejects.toThrowError('Request failed with status code 500');
  });
});
