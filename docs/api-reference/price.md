# price()

Get price prediction with technical analysis.

## Signature

```typescript
client.price(params: {
  asset: string;
  timeframe: string;
}): Promise<PriceResult>
```

## Parameters

| Parameter   | Type     | Description                                  |
| ----------- | -------- | -------------------------------------------- |
| `asset`     | `string` | Single token symbol (e.g., `"BTC"`)          |
| `timeframe` | `string` | Time period: `"1h"`, `"4h"`, `"24h"`, `"7d"` |

## Response

```typescript
interface PriceResult {
  prediction: {
    targetPrice: number;
    direction: "bullish" | "bearish" | "neutral";
    confidence: number; // 0-1
    timeframe: string;
  };
  signals: Array<{
    indicator: string;
    value: string;
    impact: "positive" | "negative" | "neutral";
  }>;
  technicalAnalysis?: {
    rsi: number;
    support: number;
    resistance: number;
    trend: string;
  };
  context: string; // AI analysis
}
```

## Example

```typescript
const result = await client.price({
  asset: "BTC",
  timeframe: "24h",
});

console.log(`Target: $${result.prediction.targetPrice}`);
console.log(`Direction: ${result.prediction.direction}`);
console.log(`Confidence: ${(result.prediction.confidence * 100).toFixed(0)}%`);
```

## Price

$0.03 per query
