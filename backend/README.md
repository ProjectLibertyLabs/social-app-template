# DSNP Gateway Prototype

This is a prototype for a DSNP Gateway to allow for simple provider setup.

## Quick Start
To quickly start up a set of preconfigured services, including this sample backend Gateway, simply run the following:
```sh
npm run env:init
docker up -d
npm run local:init
```

For more detailed instructions on configuring individual services, and running the Gateway backend locally, read on.

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

This is best for local only testing, and is the default provided in the included Docker Compose script.

This uses a local IPFS node with the [Kubo API](https://docs.ipfs.tech/reference/kubo/rpc/).

1. Launch the Kubo IPFS container
```sh
docker compose up -d kubo_ipfs
```
2. Setup the Environment Variables
   - `IPFS_ENDPOINT="http://kubo_ipfs:5001"`
   - `IPFS_GATEWAY_URL="http://kubo_ipfs:8080/ipfs/[CID]"`

   Note, the `env.*.template` files are pre-configured for this setup.

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

1. Run the provided Docker Compose script to launch a local Frequency node
```
docker compose up -d frequency
```
2. For more realistic scenario testing, run the node in Interval Sealing mode (see comments in [docker-compose.yaml](./docker-compose.yaml)
3. Setup the Environment Variables
   - `FREQUENCY_URL="ws://frequency:9944"`
   - `FREQUENCY_HTTP_URL="http://127.0.0.1:9944"`

   Note, the pre-configured `env.*.template` files are pre-configured for this scenario

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

### Bare Metal (best for local backend development)
1. `npm install`
2. `npm run start:dev`

### Dockerized (best for running only to support frontend development)
`docker compose up -d social-app-template-backend`

### Development Commands

- `npm test`: Currently Failing
- `npm run build`: Builds the TypeScript for `./dist`
- `npm run format`: Format code
- `npm run lint`: Lint code and styles
- `npm run gen:types`: Generate types from `openapi.json`
- `npm run local:init`: Create Provider for `//Alice` on localhost Frequency node.
- `npm run env:init`: Initialize a set of local environment files from the included environment templates

## References

- [Frequency](https://github.com/LibertyDSNP/frequency)
- [Social Web Example Client](https://github.com/AmplicaLabs/social-web-demo)
- [Schemas](https://github.com/LibertyDSNP/schemas/)
