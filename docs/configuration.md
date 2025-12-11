# Configuration

## Environment Variables

| Variable              | Required            | Description         |
| --------------------- | ------------------- | ------------------- |
| `PRIVATE_KEY`         | Yes (for `tx` mode) | Wallet private key  |
| `NEXT_PUBLIC_API_URL` | No                  | Custom API endpoint |

## Example .env

```bash
# Required for real payments
PRIVATE_KEY=0xabc123...

# Optional: Custom API endpoint
# NEXT_PUBLIC_API_URL=https://your-custom-api.com
```

## Custom API URL

Override the default API endpoint:

```typescript
const client = new QueryFlowClient(privateKey, {
  apiUrl: "https://your-custom-api.com",
});
```

## Network Configuration

The SDK is configured for **Avalanche Fuji Testnet** by default.

| Setting  | Value                                             |
| -------- | ------------------------------------------------- |
| Chain ID | 43113                                             |
| RPC      | Default public RPC                                |
| Explorer | [Snowtrace Testnet](https://testnet.snowtrace.io) |

## Getting Testnet AVAX

For `tx` mode, you need testnet AVAX:

1. Go to [Avalanche Faucet](https://core.app/tools/testnet-faucet/)
2. Enter your wallet address
3. Request testnet AVAX
4. Wait for confirmation (~2 seconds)
