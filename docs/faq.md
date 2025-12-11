# FAQ

## General

### What is QueryFlow?

QueryFlow is a pay-per-query AI insights platform for blockchain data. Get market sentiment, price predictions, risk analysis, and social trends — paying only for what you use.

### Do I need an API key?

No. QueryFlow uses wallet-based authentication. Your wallet address is your identity.

### What chains are supported?

Currently, QueryFlow runs on **Avalanche Fuji Testnet**. Mainnet support coming soon.

## Payments

### How much do queries cost?

| Query   | Price |
| ------- | ----- |
| Market  | $0.02 |
| Price   | $0.03 |
| Risk    | $0.05 |
| Social  | $0.02 |
| History | Free  |

### Can I test without paying?

Yes! Use `signature` mode (default) for free development testing.

```typescript
const client = new QueryFlowClient(privateKey);
// No real payments made
```

### Where do I get testnet AVAX?

Use the [Avalanche Faucet](https://core.app/tools/testnet-faucet/).

## Troubleshooting

### "Private key is required" error

Make sure you're passing a valid private key to the constructor:

```typescript
// ✅ Correct
const client = new QueryFlowClient("0xabc...");

// ❌ Wrong
const client = new QueryFlowClient(""); // Empty
const client = new QueryFlowClient(undefined); // Undefined
```

### "Wallet client not initialized" error

You're using `tx` mode but the wallet setup failed. Check your private key format.

### Payment transaction fails

- Ensure you have enough testnet AVAX
- Check that you're on the Fuji network
- Verify the private key has funds

## Support

- [GitHub Issues](https://github.com/query-flow-402/query-flow-sdk/issues)
- [Documentation](https://docs.queryflow.io)
