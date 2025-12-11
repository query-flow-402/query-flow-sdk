# risk()

Analyze wallet risk profile.

## Signature

```typescript
client.risk(params: {
  address: string;
}): Promise<RiskResult>
```

## Parameters

| Parameter | Type     | Description                                 |
| --------- | -------- | ------------------------------------------- |
| `address` | `string` | Wallet address to analyze (e.g., `"0x..."`) |

## Response

```typescript
interface RiskResult {
  risk: {
    score: number; // 0-100 (higher = riskier)
    level: "low" | "medium" | "high" | "critical";
    confidence: number; // 0-1
  };
  factors: Array<{
    type: string;
    severity: "low" | "medium" | "high";
    description: string;
  }>;
  recommendation: string;
  metadata: {
    walletAge: string;
    txCount: number;
    totalVolume: string;
  };
}
```

## Example

```typescript
const result = await client.risk({
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f7cB2c",
});

console.log(`Risk Level: ${result.risk.level}`);
console.log(`Score: ${result.risk.score}/100`);
console.log(`Recommendation: ${result.recommendation}`);
```

## Price

$0.05 per query
