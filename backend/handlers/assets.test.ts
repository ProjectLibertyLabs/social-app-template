import request from 'supertest';
import axios from 'axios';
import { it, describe, expect, MockedFunction, vi } from 'vitest';
import { app } from '../index.js';
import { AssetsService } from '../services/AssetsService.js';

vi.mock('../../services/AssetsService.js');
vi.mock('axios');

describe('POST /assets/', () => {
  it('returns 202 with matched operation', async () => {
    const responseData = ['asset1'];
    (AssetsService.create as MockedFunction<typeof AssetsService.create>).mockResolvedValueOnce(responseData);

    const res = await request(app).post('/assets').attach('files', Buffer.from('hello world', 'utf8'), 'file1.txt');

    expect(res.status).toBe(202);
    expect(res.body).toEqual(['asset1']);
  });

  it('returns 503 when getting an error from content-publisher', async () => {
    (AssetsService.create as MockedFunction<typeof AssetsService.create>).mockRejectedValueOnce(new Error('error'));
    const res = await request(app).post('/assets').attach('files', Buffer.from('hello world', 'utf8'), 'file1.txt');

    expect(res.status).toBe(503);
  });

  it('returns 400 when missing fields property', async () => {
    const res = await request(app).post('/assets').attach('file', Buffer.from('hello world', 'utf8'), 'file1.txt');

    expect(res.status).toBe(400);
    expect(JSON.parse(res.text).error).toEqual('Unexpected field');
  });

  it('returns 400 when invalid content-type', async () => {
    const files = {
      name: 'file1',
      file: Buffer.from('hello world', 'utf8'),
      filename: 'file1.txt',
      mimetype: 'text/plain',
    };

    const formData = new FormData();
    const fileBlob = new Blob([files.file]);
    formData.append('file1', fileBlob);

    const responseData = ['asset1'];
    (axios.put as MockedFunction<typeof axios.put>).mockResolvedValueOnce({
      data: responseData,
      status: 202,
    });
    const res = await request(app).post('/assets').set('Content-type', 'multipart/form-data');

    expect(res.status).toBe(400);
    expect(JSON.parse(res.text).error).toEqual('Invalid multipart/form-data header or boundary');
  });
});
