import { Response } from 'express';
import logger from '../logger';

type Client = {
  id: string;
  res: Response;
};

class SSEManager {
  private clients: Map<string, Client> = new Map();

  addClient(clientId: string, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish the SSE connection

    this.clients.set(clientId, { id: clientId, res });
    logger.warn({ clientId }, 'Client connected');

    res.on('close', () => {
      this.removeClient(clientId);
    });
  }

  removeClient(clientId: string) {
    this.clients.delete(clientId);
  }

  broadcast(event: string, data: any) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    logger.warn({ payload }, 'Broadcasting to SSE clients');

    this.clients.forEach((client) => {
      client.res.write(payload, (error) => error && logger.error(error));
    });
  }
}

export const sseManager = new SSEManager();
