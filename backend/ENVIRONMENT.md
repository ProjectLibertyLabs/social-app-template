# Environment Variables

This application recognizes the following environment variables:

| Name                   | Description                                                                                                                          |          Range/Type           | Required? | Default |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------: | :-------: | :-----: |
| `API_PORT`             | HTTP port that the application listens on                                                                                            |         1025 - 65535          |           |  3000   |
| `SIWF_NODE_RPC_URL`    | Blockchain node address for the SiwF UI (must be resolvable from a browser)                                                          |         http(s): URL          |     Y     |         |
| `FREQUENCY_API_WS_URL` | Blockchain node address                                                                                                              |    http(s): or ws(s): URL     |     Y     |         |
| `PROVIDER_ID`          | Provider MSA ID                                                                                                                      |            integer            |     Y     |         |
| `CHAIN_ENVIRONMENT`    | What type of chain we're connected to                                                                                                | dev\|rococo\|testnet\|mainnet |     Y     |         |
| `IPFS_GATEWAY_URL`     | IPFS gateway domain URL. If set, will replace the 'protocol://domain:port' portion of content URLs loaded from the chain             |         URL template          |           |         |
| `IPFS_UA_GATEWAY_URL`  | IPFS gateway domain URL (user-agent resolvable). If set, will override IPFS_GATEWAY_URL in the auth response sent to the user-agent. |         URL template          |           |         |
| `SIWF_DOMAIN`          | Domain to be used in SIWF login payloads                                                                                             |            string             |     Y     |         |
| `SIWF_URL`             | URL for the SIgn-in with Frequency UI                                                                                                |              URL              |     Y     |         |
