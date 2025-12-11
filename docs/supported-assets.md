# Supported Assets

The following tokens are supported for market, price, and social queries.

## Token List

| Symbol | Name      | Symbol  | Name         |
| ------ | --------- | ------- | ------------ |
| `BTC`  | Bitcoin   | `SOL`   | Solana       |
| `ETH`  | Ethereum  | `BNB`   | Binance Coin |
| `AVAX` | Avalanche | `XRP`   | Ripple       |
| `ADA`  | Cardano   | `DOGE`  | Dogecoin     |
| `DOT`  | Polkadot  | `MATIC` | Polygon      |
| `USDC` | USD Coin  | `USDT`  | Tether       |

## Usage Notes

- **Case insensitive** — `"btc"`, `"BTC"`, and `"Bitcoin"` all work
- **Multiple assets** — Pass arrays for market and social queries

```typescript
// Single asset
await client.price({ asset: "BTC", timeframe: "24h" });

// Multiple assets
await client.market({ assets: ["BTC", "ETH", "SOL"], timeframe: "24h" });
```

## Timeframes

All time-based queries support these intervals:

| Value   | Description |
| ------- | ----------- |
| `"1h"`  | 1 hour      |
| `"4h"`  | 4 hours     |
| `"24h"` | 24 hours    |
| `"7d"`  | 7 days      |
