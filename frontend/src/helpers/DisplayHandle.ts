import {Handle} from "../dsnpLink";

export const makeDisplayHandle = (handle?: Handle) => {
    return handle ? `${handle.base_handle}.${handle.suffix}` : 'Anonymous';
}