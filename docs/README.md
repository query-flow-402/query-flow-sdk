# @queryflow-402/sdk

The official Node.js/TypeScript SDK for **QueryFlow** — a pay-per-query AI insights platform powered by the x402 payment protocol on Avalanche.

[![npm version](https://img.shields.io/npm/v/@queryflow-402/sdk.svg)](https://www.npmjs.com/package/@queryflow-402/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🧠 **AI-Powered Insights** — Market sentiment, price predictions, risk analysis, social trends
- 💸 **Pay-Per-Query** — No subscriptions, pay only for what you use
- 🔐 **Wallet-Based Auth** — No API keys, just your crypto wallet
- ⚡ **Simple Integration** — 3 lines of code to get started
- 🔄 **Dual Payment Modes** — Signature (dev) or Real AVAX (production)

## Quick Example

```typescript
import { QueryFlowClient } from "@queryflow-402/sdk";

const client = new QueryFlowClient(process.env.PRIVATE_KEY);

const result = await client.market({
  assets: ["BTC", "ETH"],
  timeframe: "24h",
});

console.log(`Sentiment: ${result.sentiment.score}/100`);
```

## Next Steps

- [Getting Started](getting-started.md) — Install and make your first query
- [Core Concepts](core-concepts.md) — Understand x402 and pay-per-query
- [API Reference](api-reference/README.md) — Full method documentation
