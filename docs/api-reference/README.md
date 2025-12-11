# API Reference

Complete documentation for all QueryFlowClient methods.

## Constructor

```typescript
new QueryFlowClient(privateKey: string, options?: ClientOptions)
```

See [QueryFlowClient](client.md) for details.

## Query Methods

| Method                             | Description               | Price |
| ---------------------------------- | ------------------------- | ----- |
| [market()](market.md)              | Market sentiment analysis | $0.02 |
| [price()](price.md)                | Price prediction          | $0.03 |
| [risk()](risk.md)                  | Wallet risk assessment    | $0.05 |
| [social()](social.md)              | Social media sentiment    | $0.02 |
| [getHistory()](history.md)         | Query history             | Free  |
| [marketStream()](market-stream.md) | Streaming market data     | $0.02 |

## Response Types

All methods return strongly-typed responses. See individual method pages for response structures.
