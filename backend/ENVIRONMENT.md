# Environment Variables

This application recognizes the following environment variables:

| Name                           | Description                                                                          |          Range/Type           | Required? | Default |
| ------------------------------ | ------------------------------------------------------------------------------------ | :---------------------------: | :-------: | :-----: |
| `API_PORT`                     | HTTP port that the application listens on                                            |         1025 - 65535          |           |  3000   |
| `FREQUENCY_HTTP_URL`           | Blockchain node address for the SiwF UI (must be resolvable from a browser)          |         http(s): URL          |     Y     |         |
| `FREQUENCY_URL`                | Blockchain node address                                                              |    http(s): or ws(s): URL     |     Y     |         |
| `PROVIDER_ACCOUNT_SEED_PHRASE` | Seed phrase for provider MSA control key                                             |            string             |     Y     |         |
| `PROVIDER_ID`                  | Provider MSA ID                                                                      |            integer            |     Y     |         |
| `CHAIN_ENVIRONMENT`            | What type of chain we're connected to                                                | dev\|rococo\|testnet\|mainnet |     Y     |         |
| `IPFS_BASIC_AUTH_SECRET`       | If using Infura, put auth token here, or leave blank for Kubo RPC                    |            string             |     N     |  blank  |
| `IPFS_BASIC_AUTH_USER`         | If using Infura, put Project ID here, or leave blank for Kubo RPC                    |            string             |     N     |  blank  |
| `IPFS_ENDPOINT`                | URL to IPFS endpoint                                                                 |              URL              |     Y     |         |
| `IPFS_GATEWAY_URL`             | IPFS gateway URL. '[CID]' is a token that will be replaced with an actual content ID |         URL template          |     Y     |         |
| `SIWF_DOMAIN`                  | Domain to be used in SIWF login payloads                                             |            string             |     Y     |         |
| `SIWF_URL`                     | URL for the SIgn-in with Frequency UI                                                |              URL              |     Y     |         |