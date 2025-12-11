# Payment Modes

The SDK supports multiple payment modes for different use cases.

## Mode Comparison

| Mode        | Token       | Use Case                 | Cost |
| ----------- | ----------- | ------------------------ | ---- |
| `signature` | None        | Development/Testing      | Free |
| `tx`        | Native AVAX | SDK/Agents (Recommended) | Real |
| `thirdweb`  | AVAX        | Frontend + Thirdweb SDK  | Real |

## Signature Mode (Default)

Uses cryptographic signatures instead of real payments. Perfect for development.

```typescript
const client = new QueryFlowClient(privateKey);
// or explicitly:
const client = new QueryFlowClient(privateKey, { mode: "signature" });
```

**Pros:**

- ✅ Free for testing
- ✅ No testnet AVAX needed
- ✅ Instant (no blockchain confirmation)

**Cons:**

- ❌ Not suitable for production

## Transaction Mode (Recommended for Production)

Sends real AVAX payments on Avalanche Fuji testnet.

```typescript
const client = new QueryFlowClient(privateKey, { mode: "tx" });
```

**Pros:**

- ✅ Simple native AVAX payments
- ✅ No token approvals needed
- ✅ Full x402 compliance

**Cons:**

- ⚠️ Requires testnet AVAX (get free from [faucet](https://core.app/tools/testnet-faucet/))
- ⚠️ ~2-3 second confirmation time

## Thirdweb Mode

For frontend apps using the Thirdweb SDK. Uses the `x-payment` header format.

```typescript
const client = new QueryFlowClient(privateKey, { mode: "thirdweb" });
```

> **Note:** For most programmatic/agent use cases, we recommend `mode: "tx"`.

## Accessing Transaction Hash

After a successful query in `tx` mode, you can access the payment transaction hash:

```typescript
const result = await client.market({ assets: ["BTC"], timeframe: "24h" });
console.log("Tx Hash:", client.lastTxHash);
```
