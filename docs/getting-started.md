# Getting Started

## Installation

```bash
npm install @queryflow-402/sdk
# or
pnpm add @queryflow-402/sdk
# or
yarn add @queryflow-402/sdk
```

## Prerequisites

- Node.js 18+ (for native fetch support)
- A crypto wallet private key (for signing/payments)
- Testnet AVAX (for real payment mode)

## Quick Start

### 1. Initialize the Client

```typescript
import { QueryFlowClient } from "@queryflow-402/sdk";

// Use your wallet private key
const client = new QueryFlowClient(process.env.PRIVATE_KEY);
```

### 2. Make a Query

```typescript
const result = await client.market({
  assets: ["BTC", "ETH"],
  timeframe: "24h",
});

console.log(result.sentiment);
// { score: 72, trend: "bullish", summary: "..." }
```

### 3. Handle the Response

All query methods return typed responses:

```typescript
// Market sentiment
result.sentiment.score; // 0-100
result.sentiment.trend; // "bullish" | "bearish" | "neutral"
result.factors; // Key market factors
```

## Payment Flow

1. Your query is sent to the API
2. API returns `402 Payment Required` with price
3. SDK automatically signs/sends payment
4. API returns the AI insights

In **signature mode** (default), no real payment is made — perfect for development.

## Next Steps

- [Core Concepts](core-concepts.md) — Learn about x402 and pay-per-query
- [Payment Modes](payment-modes.md) — Configure real payments
- [API Reference](api-reference/README.md) — Full method documentation
