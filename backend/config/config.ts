import Joi from 'joi';

const ENV_SCHEMA = Joi.object({
  API_PORT: Joi.number().min(1001).max(10_000).default(3000),
  WEBHOOK_BASE_URL: Joi.string().uri().required(),
  WEBHOOK_PORT: Joi.number().min(1001).max(10_000),
  WEBHOOK_HOST: Joi.string().hostname(),
  ACCOUNT_SERVICE_URL: Joi.string().uri().required(),
  CONTENT_PUBLISHER_URL: Joi.string().uri().required(),
  CONTENT_WATCHER_URL: Joi.string().uri().required(),
  GRAPH_SERVICE_URL: Joi.string().uri().required(),
  CHAIN_ENVIRONMENT: Joi.string()
    .valid(...['dev', 'rococo', 'testnet', 'mainnet'])
    .required(),
  DEBUG: Joi.string(),
  IPFS_GATEWAY_URL: Joi.string().uri(),
  IPFS_UA_GATEWAY_URL: Joi.string().uri(),
  FREQUENCY_API_WS_URL: Joi.string().uri().required(),
  SIWF_NODE_RPC_URL: Joi.string().uri().required(),
  PROVIDER_ID: Joi.number()
    .required()
    .positive()
    .unsafe(true)
    .custom((value) => BigInt(value)),
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

  public get webhookPort() {
    const port = parseInt(this.configValues['WEBHOOK_PORT']);
    return port || this.port + 1;
  }

  public get webhookHost() {
    return this.configValues['WEBHOOK_HOST'];
  }

  public get webhookBaseUrl() {
    return this.configValues['WEBHOOK_BASE_URL'];
  }

  public get accountServiceUrl() {
    return this.configValues['ACCOUNT_SERVICE_URL'];
  }

  public get contentPublisherUrl() {
    return this.configValues['CONTENT_PUBLISHER_URL'];
  }

  public get contentWatcherUrl() {
    return this.configValues['CONTENT_WATCHER_URL'];
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

  public get ipfsGatewayUrl() {
    return this.configValues['IPFS_GATEWAY_URL'];
  }

  public get ipfsUserAgentGatewayUrl() {
    return this.configValues['IPFS_UA_GATEWAY_URL'] || this.ipfsGatewayUrl;
  }

  public get frequencyApiWsUrl() {
    return this.configValues['FREQUENCY_API_WS_URL'];
  }

  public get providerId(): string {
    return this.configValues['PROVIDER_ID'].toString();
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
