import { Handle } from '../types';

export const makeDisplayHandle = (handle?: Handle) => {
  return handle ? `${handle.base_handle}.${handle.suffix}` : 'Anonymous';
};
