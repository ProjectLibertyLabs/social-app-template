# DSNP Gateway Prototype

This is a prototype for a DSNP Gateway to allow for simple provider setup.

## Setup

### Environment Variables

The application is configured by way of environment variables. A complete list of available environment variables is [here](./ENVIRONMENT.md). Environment variables are supplied to the application through _environment files_.

The default scripts and images for this app are configured in a slightly different way from the usual method. Because this Gateway app is a template meant to be used with other services and built upon,
the supplied scripts enable launching a full environment of all Frequency Gateway services needed by this Gateway application. To that end, each service has its own environment file, as well as a "common" environment file where shared config values can be specified for all services without the need to duplicate entries. The environment files are named as follows; use the _[.docker]_ variants for running the main Gateway app under docker (the other Gateway services are set up to run under Docker by default).

- .env.common[.docker]
- .env.service[.docker]
  - where <service> is one of: account-service, content-publishing-service, content-watcher-service, graph-service, social-app-backend

Sample configuration files can be found [here](./environment/)

### IPFS Endpoint

Note: There are other options, but these are the simplest to get started with.

#### Option 1: Infura IPFS Service

This is best for Testnet interactions.

1. Setup an [Infura Account](https://app.infura.io/register)
2. Generate an IPFS API Key
3. Setup the Environment Variables
   - `IPFS_ENDPOINT="https://ipfs.infura.io:5001"`
   - `IPFS_BASIC_AUTH_USER="Infura Project ID"`
   - `IPFS_BASIC_AUTH_SECRET="Infura Secret Here"`
   - `IPFS_GATEWAY_URL="https://ipfs.io/ipfs/[CID]"`

#### Option 2: IPFS Kubo Node

This is best for local only testing.

This uses a local IPFS node with the [Kubo API](https://docs.ipfs.tech/reference/kubo/rpc/).

1. Install [IPFS Kubo](https://docs.ipfs.tech/install/command-line/)
2. Run `ipfs daemon`
3. Setup the Environment Variables
   - `IPFS_ENDPOINT="http://127.0.0.1:5001"`
   - `IPFS_GATEWAY_URL="http://127.0.0.1:8080/ipfs/[CID]"`

_Warning_: Never expose the RPC API to the public internet.

### Frequency Node

Note: There are other options, but these are simplest to get started with.

#### Option 1: Use Public Frequency Rococo Testnet Nodes

This is best for Testnet interactions.

1. Setup the Environment Variables
   - `FREQUENCY_URL="wss://rpc.rococo.frequency.xyz"`
   - `FREQUENCY_HTTP_URL="https://rpc.rococo.frequency.xyz"`

#### Option 2: Local Network from Source

This is for simple local development work.

1. Follow the development setup for [Frequency](https://github.com/LibertyDSNP/frequency#build)
2. Run the Node in local "Instant Sealing" mode `make start` OR "Interval Sealing" mode for more realistic delay `make start-interval`
3. Setup the Environment Variables
   - `FREQUENCY_URL="ws://127.0.0.1:9944"`
   - `FREQUENCY_HTTP_URL="http://127.0.0.1:9944"`

### Provider Setup

Note: There are other options, but these are simplest to get started with.

#### Option 1: Frequency Rococo Testnet

1. Follow the instructions on the Frequency Provider Dashboard (coming soon)

#### Option 2: Local Network

1. Start the Frequency Node
2. `npm run local:init`
3. Setup the Environment Variables
   - `PROVIDER_ACCOUNT_SEED_PHRASE="//Alice"`
   - `PROVIDER_ID="1"`

## Run DSNP Gateway Prototype

1. `npm install`
2. `npm run start:dev`

### Development Commands

- `npm test`: Currently Failing
- `npm run build`: Builds the TypeScript for `./dist`
- `npm run format`: Format code
- `npm run lint`: Lint code and styles
- `npm run gen:types`: Generate types from `openapi.json`
- `npm run local:init`: Create Provider for `//Alice` on localhost Frequency node.

## References

- [Frequency](https://github.com/LibertyDSNP/frequency)
- [Social Web Example Client](https://github.com/AmplicaLabs/social-web-demo)
- [Schemas](https://github.com/LibertyDSNP/schemas/)
