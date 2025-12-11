# Core Concepts

## What is QueryFlow?

QueryFlow is a **pay-per-query** platform that provides AI-powered blockchain insights. Instead of monthly subscriptions, you pay only for the data you request.

## The x402 Payment Protocol

QueryFlow uses the **x402 payment protocol** — a standard for HTTP-based micropayments inspired by the HTTP 402 "Payment Required" status code.

### How It Works

```
┌─────────┐         ┌─────────┐         ┌────────────┐
│  Your   │  POST   │  Query  │   402   │  Payment   │
│   App   │ ──────► │  Flow   │ ──────► │  Required  │
└─────────┘         │   API   │         └────────────┘
     │              └─────────┘               │
     │                   ▲                    │
     │ ┌─────────────────┼────────────────────┘
     │ │ Send AVAX       │
     ▼ │                 │
┌─────────┐         ┌─────────┐
│ Wallet  │ ──────► │  Retry  │ ──────► 200 + Data
│   Tx    │  Header │ Request │
└─────────┘         └─────────┘
```

1. **Initial Request** — You send a query (e.g., market sentiment)
2. **402 Response** — API returns payment requirements (price, address)
3. **Payment** — SDK sends AVAX or signs a message
4. **Retry with Proof** — SDK resends request with payment proof in header
5. **Data Response** — API returns your AI insights

## Wallet-Based Authentication

QueryFlow uses your **wallet address** as your identity. No API keys, no accounts to create.

- Your wallet signs requests to prove ownership
- Query history is linked to your address
- Payments are recorded on-chain (Avalanche)

## Pay-Per-Query Pricing

| Query Type | Price (USD) | Price (AVAX approx) |
| ---------- | ----------- | ------------------- |
| Market     | $0.02       | ~0.0001 AVAX        |
| Price      | $0.03       | ~0.0002 AVAX        |
| Risk       | $0.05       | ~0.0003 AVAX        |
| Social     | $0.02       | ~0.0001 AVAX        |

> Prices are dynamically converted to AVAX at current exchange rates.

## Next Steps

- [Payment Modes](payment-modes.md) — Configure signature vs real payments
- [API Reference](api-reference/README.md) — Full method documentation
