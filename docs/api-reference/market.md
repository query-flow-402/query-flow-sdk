# market()

Get AI-powered market sentiment analysis.

## Signature

```typescript
client.market(params: {
  assets: string[];
  timeframe: string;
}): Promise<MarketResult>
```

## Parameters

| Parameter   | Type       | Description                                     |
| ----------- | ---------- | ----------------------------------------------- |
| `assets`    | `string[]` | Array of token symbols (e.g., `["BTC", "ETH"]`) |
| `timeframe` | `string`   | Time period: `"1h"`, `"4h"`, `"24h"`, `"7d"`    |

## Response

```typescript
interface MarketResult {
  tokensUsed: number;
  sentiment: {
    score: number; // 0-100
    trend: "bullish" | "bearish" | "neutral";
    summary: string; // AI-generated summary
  };
  factors: string[]; // Key market factors
}
```

## Example

```typescript
const result = await client.market({
  assets: ["BTC", "ETH", "SOL"],
  timeframe: "24h",
});

console.log(`Score: ${result.sentiment.score}/100`);
console.log(`Trend: ${result.sentiment.trend}`);
console.log(`Summary: ${result.sentiment.summary}`);
console.log(`Factors: ${result.factors.join(", ")}`);
```

## Price

$0.02 per query
