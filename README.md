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

---

## 📦 Installation

```bash
npm install @queryflow-402/sdk
# or
pnpm add @queryflow-402/sdk
# or
yarn add @queryflow-402/sdk
```

---

## 🚀 Quick Start

```typescript
import { QueryFlowClient } from "@queryflow-402/sdk";

// Initialize with your wallet private key
const client = new QueryFlowClient(process.env.PRIVATE_KEY);

// Query market sentiment
const result = await client.market({
  assets: ["BTC", "ETH"],
  timeframe: "24h",
});

console.log(
  `Sentiment: ${result.sentiment.score}/100 (${result.sentiment.trend})`
);
```

---

## 💡 Payment Modes

The SDK supports three payment modes for different use cases:

| Mode        | Token        | Header          | Use Case                         |
| :---------- | :----------- | :-------------- | :------------------------------- |
| `signature` | None         | `x-402-payment` | Development/Testing              |
| `tx`        | Native AVAX  | `x-402-payment` | **SDK/Agents (Recommended)**     |
| `thirdweb`  | USDC (ERC20) | `x-payment`     | Frontend (requires Thirdweb SDK) |

### Signature Mode (Default — Free for Development)

```typescript
const client = new QueryFlowClient(privateKey);
// Uses cryptographic signatures instead of real payments
// Perfect for development and testing
```

### Real Payment Mode (Production — Recommended for SDK)

```typescript
const client = new QueryFlowClient(privateKey, {
  mode: "tx",
});
// Sends real AVAX transactions on Avalanche Fuji
// Simple, no token approvals needed
```

### Thirdweb Mode (USDC — For Frontend Integration)

```typescript
// Best used with Thirdweb React hooks (useFetchWithPayment)
// Requires EIP-712 permit signatures for USDC
const client = new QueryFlowClient(privateKey, { mode: "thirdweb" });
```

> **Note**: For programmatic/agent use, we recommend `mode: "tx"` with native AVAX for simplicity.

---

## 🪙 Supported Assets

The following tokens are supported for market, price, and social queries:

| Symbol | Name      | Symbol  | Name         |
| :----- | :-------- | :------ | :----------- |
| `BTC`  | Bitcoin   | `SOL`   | Solana       |
| `ETH`  | Ethereum  | `BNB`   | Binance Coin |
| `AVAX` | Avalanche | `XRP`   | Ripple       |
| `ADA`  | Cardano   | `DOGE`  | Dogecoin     |
| `DOT`  | Polkadot  | `MATIC` | Polygon      |
| `USDC` | USD Coin  | `USDT`  | Tether       |

> **Note**: Asset names are case-insensitive. You can use `"btc"`, `"BTC"`, or `"bitcoin"`.

---

## 📖 API Reference

### Constructor

```typescript
new QueryFlowClient(privateKey: string, options?: ClientOptions)
```

| Parameter        | Type                  | Description                                           |
| :--------------- | :-------------------- | :---------------------------------------------------- |
| `privateKey`     | `string`              | Your wallet private key (with or without `0x` prefix) |
| `options.apiUrl` | `string`              | API endpoint (uses production by default)             |
| `options.mode`   | `"signature" \| "tx"` | Payment mode (default: `"signature"`)                 |

---

### `client.market(params)`

Get AI-powered market sentiment analysis.

```typescript
const result = await client.market({
  assets: ["BTC", "ETH", "SOL"],
  timeframe: "24h", // Options: "1h", "4h", "24h", "7d"
});
```

**Response: `MarketResult`**

```typescript
{
  sentiment: {
    score: 72,           // 0-100
    trend: "bullish",    // "bullish" | "bearish" | "neutral"
    summary: "Market shows positive momentum..."
  },
  factors: [...],        // Key market factors
  tokensUsed: 150        // AI tokens consumed
}
```

---

### `client.price(params)`

Get price prediction with technical analysis.

```typescript
const result = await client.price({
  asset: "BTC",
  timeframe: "24h",
});
```

**Response: `PriceResult`**

```typescript
{
  prediction: {
    targetPrice: 95000,
    direction: "up",     // "up" | "down" | "neutral"
    confidence: 0.75,    // 0-1
    timeframe: "24h"
  },
  signals: [...],        // Technical indicators
  analysis: "..."        // AI analysis summary
}
```

---

### `client.risk(params)`

Analyze wallet risk profile.

```typescript
const result = await client.risk({
  address: "0x...",
});
```

**Response: `RiskResult`**

```typescript
{
  riskScore: 25,              // 0-100 (higher = riskier)
  riskLevel: "low",           // "low" | "medium" | "high" | "critical"
  factors: [...],             // Risk factors detected
  recommendation: "..."       // AI recommendation
}
```

---

### `client.social(params)`

Get social media sentiment and trends.

```typescript
const result = await client.social({
  assets: ["BTC", "ETH"],
});
```

**Response: `SocialResult`**

```typescript
{
  sentiment: {
    score: 65,
    trend: "bullish"
  },
  trendingTopics: [...],     // What's trending
  volume: "high",            // Social activity level
  warnings: [...]            // Potential concerns
}
```

---

### `client.getHistory()`

Fetch your past query history (recorded on-chain).

```typescript
const history = await client.getHistory();
// Returns: QueryHistoryItem[]
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Required for real payment mode
PRIVATE_KEY=0x...

# Optional: Custom API endpoint (uses production by default)
# QUERYFLOW_API_URL=https://your-custom-endpoint.com
```

### Custom API URL

```typescript
const client = new QueryFlowClient(privateKey, {
  apiUrl: "https://your-custom-endpoint.com",
});
```

---

## 📁 Examples

See the `examples/` folder for complete working demos:

| File       | Description                                  |
| :--------- | :------------------------------------------- |
| `basic.ts` | Simple market query with signature mode      |
| `agent.ts` | AI agent simulation making trading decisions |
| `real.ts`  | Real AVAX payment on Fuji testnet            |

Run examples:

```bash
# Signature mode (free)
npx tsx examples/basic.ts

# Real payment mode (requires AVAX)
PRIVATE_KEY=0x... npx tsx examples/real.ts
```

---

## 🏗️ Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev
```

---

## 📄 License

MIT © QueryFlow Team

---

## 🔗 Links

- [QueryFlow Platform](https://queryflow.io)
- [Documentation](https://docs.queryflow.io)
- [GitHub](https://github.com/query-flow-402/query-flow-sdk)
