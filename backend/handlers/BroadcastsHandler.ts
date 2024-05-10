import { BroadcastService } from '../services/BroadcastService.js';
import { HttpError } from '../types/HttpError.js';
import { HttpStatusCode } from 'axios';

export async function postBroadcastHandler(msaId: string, body: any) {
  try {
    const broadcast = await BroadcastService.create(msaId, body);

    return broadcast;
  } catch (e) {
    console.error(e);
    throw new HttpError(HttpStatusCode.ServiceUnavailable, 'Error creating broadcast', { cause: e });
  }
}
