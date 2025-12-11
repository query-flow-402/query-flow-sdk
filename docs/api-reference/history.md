# getHistory()

Fetch your past query history (recorded on-chain).

## Signature

```typescript
client.getHistory(): Promise<QueryHistoryItem[]>
```

## Parameters

None — uses the wallet address from the client.

## Response

```typescript
interface QueryHistoryItem {
  id: string;
  type: string; // Query type (market, price, etc.)
  amount: string; // Payment amount in AVAX
  amountUsd: number; // Payment amount in USD
  timestamp: number; // Unix timestamp
  txHash: string; // Payment transaction hash
  status: string; // Query status
  resultHash: string; // Hash of the result data
}
```

## Example

```typescript
const history = await client.getHistory();

for (const item of history) {
  console.log(
    `${item.type} - $${item.amountUsd} - ${new Date(
      item.timestamp
    ).toISOString()}`
  );
}
```

## Price

Free (no payment required)
