import { HttpStatusCode } from 'axios';
import logger from '../logger';
import { HttpError } from '../types/HttpError';
import { GraphChangeNotificationV1, GraphOperationStatusV1 } from '../types/graph-service-webhook';

const referenceIdsPending = new Map<string, string>();

export function updateOperationByRefId(refId: string, status: 'pending' | 'expired' | 'failed' | 'succeeded') {
  logger.debug({ refId, status }, 'Setting graph operation status');
  referenceIdsPending.set(refId, status);
}

export function getOperationStatusByRefId(refId: string): string | undefined {
  return referenceIdsPending.get(refId);
}

export function processGraphUpdateNotification(update: GraphChangeNotificationV1) {
  logger.debug(update, 'Received graph update notification');
  return HttpStatusCode.Ok;
}

/**
 * Handles the webhook from the graph service.
 * @param _req - The request object, contains the on-chain data from the graph-service for the referenceId.
 * @param res - The response object.
 */
export function requestRefIdWebhook({ referenceId, status }: GraphOperationStatusV1) {
  if (referenceId && status) {
    updateOperationByRefId(referenceId, status);
    logger.debug(`GraphWebhookService:requestRefIdWebhook: received referenceId: ${referenceId}`);
  } else {
    throw new HttpError(HttpStatusCode.BadRequest, 'Missing required fields');
  }
  return HttpStatusCode.Ok;
}
