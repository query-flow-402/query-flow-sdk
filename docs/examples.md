# Examples

Complete working examples for common use cases.

## Basic Query (Signature Mode)

```typescript
import { QueryFlowClient } from "@queryflow-402/sdk";

const client = new QueryFlowClient(process.env.PRIVATE_KEY);

async function main() {
  const result = await client.market({
    assets: ["BTC", "ETH"],
    timeframe: "24h",
  });

  console.log("Market Sentiment:", result.sentiment);
}

main();
```

## Real Payment Mode

```typescript
import { QueryFlowClient } from "@queryflow-402/sdk";

const client = new QueryFlowClient(process.env.PRIVATE_KEY, {
  mode: "tx",
});

async function main() {
  const result = await client.price({
    asset: "BTC",
    timeframe: "24h",
  });

  console.log("Price Prediction:", result.prediction);
  console.log("Transaction Hash:", client.lastTxHash);
}

main();
```

## AI Trading Agent

```typescript
import { QueryFlowClient } from "@queryflow-402/sdk";

const client = new QueryFlowClient(process.env.PRIVATE_KEY, { mode: "tx" });

async function analyzeAndDecide() {
  // Get market sentiment
  const market = await client.market({
    assets: ["BTC"],
    timeframe: "24h",
  });

  // Get price prediction
  const price = await client.price({
    asset: "BTC",
    timeframe: "24h",
  });

  // Make decision
  if (market.sentiment.score > 70 && price.prediction.direction === "bullish") {
    console.log("🟢 BUY Signal");
    console.log(`Target: $${price.prediction.targetPrice}`);
  } else if (market.sentiment.score < 30) {
    console.log("🔴 SELL Signal");
  } else {
    console.log("🟡 HOLD");
  }
}

analyzeAndDecide();
```

## Wallet Risk Check

```typescript
import { QueryFlowClient } from "@queryflow-402/sdk";

const client = new QueryFlowClient(process.env.PRIVATE_KEY);

async function checkWallet(address: string) {
  const risk = await client.risk({ address });

  console.log(`Risk Level: ${risk.risk.level}`);
  console.log(`Score: ${risk.risk.score}/100`);

  if (risk.factors.length > 0) {
    console.log("Risk Factors:");
    for (const factor of risk.factors) {
      console.log(`  - [${factor.severity}] ${factor.description}`);
    }
  }
}

checkWallet("0x742d35Cc6634C0532925a3b844Bc9e7595f7cB2c");
```

## Run Examples

```bash
# Signature mode (free)
npx tsx examples/basic.ts

# Real payment mode (requires AVAX)
PRIVATE_KEY=0x... npx tsx examples/real.ts
```
