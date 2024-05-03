import * as Config from '../config/config';

// TODO: Fetch from account-service when the new endpoint is ready
export function getSiwfRequestConfig() {
    // TODO: This is what this should really look like, but currently the template frontend expects something slightly different
    // return {
    //     providerId: Config.instance().providerId,
    //     proxyUrl: Config.instance().siwfUrl,
    //     frequencyRpcUrl: Config.instance().frequencyHttpUrl,
    //     schemas: ['profile', 'public-follows'],
    //     siwsOptions: {
    //         statement: 'The Social App Gateway is requesting you to sign in',
    //         expiresInMsecs: 300_000,
    //     },
    // }
    return {
    siwfUrl: Config.instance().siwfUrl,
    nodeUrl: Config.instance().frequencyHttpUrl,
    ipfsGateway: "http://kubo_ipfs:8080",
    providerId: Config.instance().providerId,
    schemas: [
        1,
        2,
        3,
        4,
        5,
        6,
        8
    ],
    network: Config.instance().chainType
}
}
