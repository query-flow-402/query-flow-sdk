# social()

Get social media sentiment and trends.

## Signature

```typescript
client.social(params: {
  assets: string[];
}): Promise<SocialResult>
```

## Parameters

| Parameter | Type       | Description                                     |
| --------- | ---------- | ----------------------------------------------- |
| `assets`  | `string[]` | Array of token symbols (e.g., `["BTC", "ETH"]`) |

## Response

```typescript
interface SocialResult {
  sentiment: {
    score: number; // 0-100
    trend: "bullish" | "bearish" | "neutral";
    volume: "low" | "medium" | "high";
  };
  trending: Array<{
    topic: string;
    mentions: number;
    sentiment: "bullish" | "bearish" | "neutral" | "positive" | "negative";
  }>;
  summary: string;
  warnings: string[];
}
```

## Example

```typescript
const result = await client.social({
  assets: ["BTC", "ETH"],
});

console.log(`Social Score: ${result.sentiment.score}/100`);
console.log(`Volume: ${result.sentiment.volume}`);
console.log(`Trending: ${result.trending.map((t) => t.topic).join(", ")}`);

if (result.warnings.length > 0) {
  console.warn("Warnings:", result.warnings);
}
```

## Price

$0.02 per query
