import request from 'supertest';
import { describe, expect, it, vi, MockedFunction, beforeEach } from 'vitest';
import { app } from '../index.js';
import * as auth from '../services/TokenAuth.js';
import { BroadcastService } from '../services/BroadcastService.js';

vi.mock('../../services/BroadcastService.js');
vi.mock('../services/TokenAuth.js', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('../services/TokenAuth.js')>()),
    // this will only affect "foo" outside of the original module
    getAccountFromAuth: () => {
      return { publicKey: 'publicKey', msaId: '1' };
    },

    getAuthToken: () => {
      return 'token';
    },

    validateAuthToken: (req, res, next) => {
      Object.assign(req.headers, { publicKey: 'publicKey', msaId: '1' });
      next();
    },
  };
});

describe('POST /broadcasts', () => {
  it('returns 201 with matched operation', async () => {
    BroadcastService.create = vi.fn().mockResolvedValueOnce({
      content: 'hello world',
      published: '2021-09-01T00:00:00Z',
    });

    const content = {
      content: 'hello world',
      assets: ['asset1'],
    };

    const res = await request(app)
      .post('/broadcasts')
      .auth('username', 'password')
      .send(content)
      .set('Accept', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      content: 'hello world',
      published: '2021-09-01T00:00:00Z',
    });
  });

  it('returns 503 when getting an error from content-publisher', async () => {
    BroadcastService.create = vi.fn().mockRejectedValueOnce('err');
    const content = {
      content: 'hello world',
      assets: ['asset1'],
    };

    const res = await request(app)
      .post('/broadcasts')
      .auth('username', 'password')
      .send(content)
      .set('Accept', 'application/json');

    expect(res.status).toBe(503);
  });

  it('fails when missing fields property', async () => {
    BroadcastService.create = vi.fn().mockRejectedValueOnce('err');

    const res = await request(app)
      .post('/broadcasts')
      .auth('username', 'password')
      .send({})
      .set('Accept', 'application/json');

    expect(res.status).toBe(503);
  });

  it('returns 503 when invalid content-type', async () => {
    BroadcastService.create = vi.fn().mockRejectedValueOnce('err');

    const res = await request(app).post('/broadcasts').auth('username', 'password').send({}).set('Accept', 'text/html');

    expect(res.status).toBe(503);
  });
});
