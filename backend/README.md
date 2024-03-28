# DSNP Gateway Prototype

This is a prototype for a DSNP Gateway to allow for simple provider setup.

## Setup

### Environment Variables

Environment variables can be setup by creating a `.env` file in the root folder.

    > `cp .env.example .env`

- `IPFS_ENDPOINT` (Required): The endpoint for the IPFS API.
- `IPFS_GATEWAY` (Required): IPFS Gateway. Use `[CID]` to position the CID correctly in the URL. e.g. `https://ipfs.io/ipfs/[CID]`
- `IPFS_BASIC_AUTH_USER`: The Basic Auth for the IPFS connection
- `IPFS_BASIC_AUTH_SECRET`: The Basic Auth for the IPFS connection
- `FREQUENCY_NODE` (Required): The WebSocket address for a Frequency Node e.g. `ws://127.0.0.1:9944` (Note: Use `172.0.0.1` over `localhost`)
- `FREQUENCY_PUBLIC_ENDPOINT`: The HTTP(S) endpoint so the website can interact with the bare minimum of node interactions. (Required for the Social Web Example Client)
- `PROVIDER_KEY_URI`: The URI or seed phrase for the provider key. e.g. `//Alice`
- `PROVIDER_ID`: The ID of the Provider that will be used.
- `PORT`: The port to launch the service on. Defaults to `5005`
- `SIWF_URL`: The current Sign-In With Frequency UI deployment. Current Deployed Version: `https://amplicalabs.github.io/siwf/ui`
- `SIWF_DOMAIN`: The raw domain that the user is logging in through. Example: `localhost`, `amplica.io`

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
   - `IPFS_GATEWAY="https://ipfs.io/ipfs/[CID]"`

#### Option 2: IPFS Kubo Node

This is best for local only testing.

This uses a local IPFS node with the [Kubo API](https://docs.ipfs.tech/reference/kubo/rpc/).

1. Install [IPFS Kubo](https://docs.ipfs.tech/install/command-line/)
2. Run `ipfs daemon`
3. Setup the Environment Variables
   - `IPFS_ENDPOINT="http://127.0.0.1:5001"`
   - `IPFS_GATEWAY="http://127.0.0.1:8080/ipfs/[CID]"`

_Warning_: Never expose the RPC API to the public internet.

### Frequency Node

Note: There are other options, but these are simplest to get started with.

#### Option 1: Use Public Frequency Rococo Testnet Nodes

This is best for Testnet interactions.

1. Setup the Environment Variables
   - `FREQUENCY_NODE="wss://rpc.rococo.frequency.xyz"`
   - `FREQUENCY_PUBLIC_ENDPOINT="https://rpc.rococo.frequency.xyz"`

#### Option 2: Local Network from Source

This is for simple local development work.

1. Follow the development setup for [Frequency](https://github.com/LibertyDSNP/frequency#build)
2. Run the Node in local "Instant Sealing" mode `make start` OR "Interval Sealing" mode for more realistic delay `make start-interval`
3. Setup the Environment Variables
   - `FREQUENCY_NODE="ws://127.0.0.1:9944"`
   - `FREQUENCY_PUBLIC_ENDPOINT="http://127.0.0.1:9944"`

### Provider Setup

Note: There are other options, but these are simplest to get started with.

#### Option 1: Frequency Rococo Testnet

1. Follow the instructions on the Frequency Provider Dashboard (coming soon)

#### Option 2: Local Network

1. Start the Frequency Node
2. `npm run local:init`
3. Setup the Environment Variables
   - `PROVIDER_KEY_URI="//Alice"`
   - `PROVIDER_ID="1"`

## Run DSNP Gateway Prototype

1. `npm install`
2. `npm run watch` OR `npm run start`

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
