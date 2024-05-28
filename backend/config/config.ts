import Joi from 'joi';
import { mnemonicValidate } from '@polkadot/util-crypto';

// eslint-disable-next-line no-useless-escape
const devUriRegEx = /^\/\/(Alice|Bob|Charlie|Dave|Eve|Ferdie)(\/[\/]?\d+)?$/;

const ENV_SCHEMA = Joi.object({
  API_PORT: Joi.number().min(1001).max(10_000).default(3000),
  PRIVATE_PORT: Joi.number().min(1001).max(10_000),
  PRIVATE_HOST: Joi.string().hostname(),
  ACCOUNT_SERVICE_URL: Joi.string().uri().required(),
  CONTENT_PUBLISHER_URL: Joi.string().uri().required(),
  GRAPH_SERVICE_URL: Joi.string().uri().required(),
  CHAIN_ENVIRONMENT: Joi.string()
    .valid(...['dev', 'rococo', 'testnet', 'mainnet'])
    .required(),
  DEBUG: Joi.string(),
  IPFS_ENDPOINT: Joi.string().uri().required(),
  IPFS_BASIC_AUTH_USER: Joi.string(),
  IPFS_BASIC_AUTH_SECRET: Joi.string(),
  IPFS_GATEWAY_URL: Joi.string()
    .pattern(/\[CID\]/)
    .required()
    .custom((value, helpers) => {
      const ret = Joi.string().uri().validate(value.replace('[CID]', 'cid'));
      return ret?.error ? helpers.error(ret.error.details[0].type) : value;
    }),
  FREQUENCY_URL: Joi.string().uri().required(),
  FREQUENCY_HTTP_URL: Joi.string().uri().required(),
  PROVIDER_ID: Joi.number()
    .required()
    .positive()
    .unsafe(true)
    .custom((value) => BigInt(value)),
  PROVIDER_ACCOUNT_SEED_PHRASE: Joi.string()
    .required()
    .custom((value: string, helpers) => {
      if (process.env?.CHAIN_ENVIRONMENT === 'dev' && devUriRegEx.test(value)) {
        return value;
      }
      if (!mnemonicValidate(value)) {
        return helpers.error('any.custom', {
          error: new Error(`the provided value is not a valid BIP39 seed phrase`),
        });
      }
      return value;
    }),
  SIWF_URL: Joi.string().uri().required(),
  SIWF_DOMAIN: Joi.alternatives().required().match('any').try(Joi.string().domain(), Joi.string().hostname()), // allow hostname for local testing
});

export class Config {
  private readonly configValues: Record<string, any>;

  constructor(environment: Record<string, any>) {
    const { error, value } = ENV_SCHEMA.validate(environment, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });
    if (error) {
      throw new Error(error.message, { cause: error });
    }

    this.configValues = value;
  }

  public get port() {
    return parseInt(this.configValues['API_PORT']);
  }

  public get privatePort() {
    const port = parseInt(this.configValues['PRIVATE_PORT']);
    return port || this.port + 1;
  }

  public get privateHost() {
    return this.configValues['PRIVATE_HOST'];
  }

  public get accountServiceUrl() {
    return this.configValues['ACCOUNT_SERVICE_URL'];
  }

  public get contentPublisherUrl() {
    return this.configValues['CONTENT_PUBLISHER_URL'];
  }

  public get graphServiceUrl() {
    return this.configValues['GRAPH_SERVICE_URL'];
  }

  public get chainType() {
    return this.configValues['CHAIN_ENVIRONMENT'];
  }

  public get debug(): boolean {
    return this.configValues?.['DEBUG'] ?? false;
  }

  public get ipfsEndpoint() {
    return this.configValues['IPFS_ENDPOINT'];
  }

  public get ipfsBasicAuthUser() {
    return this.configValues?.['IPFS_BASIC_AUTH_USER'];
  }

  public get ipfsBasicAuthSecret() {
    return this.configValues?.['IPFS_BASIC_AUTH_SECRET'];
  }

  public get ipfsGatewayUrl() {
    return this.configValues['IPFS_GATEWAY_URL'];
  }

  public getIpfsContentUrl(cid: string) {
    return this.ipfsGatewayUrl.replace('[CID]', cid);
  }

  public get frequencyUrl() {
    return this.configValues['FREQUENCY_URL'];
  }

  public get frequencyHttpUrl() {
    return this.configValues['FREQUENCY_HTTP_URL'];
  }

  public get providerId(): string {
    return this.configValues['PROVIDER_ID'].toString();
  }

  public get providerSeedPhrase() {
    return this.configValues['PROVIDER_ACCOUNT_SEED_PHRASE'];
  }

  public get siwfUrl() {
    return this.configValues['SIWF_URL'];
  }

  public get siwfDomain() {
    return this.configValues['SIWF_DOMAIN'];
  }
}

let configInstance: Config;

export function init(environment: Record<string, any>) {
  if (!configInstance) {
    configInstance = new Config(environment);
  }
}

export function instance() {
  if (!configInstance) {
    init(process.env);
  }

  return configInstance;
}
