# QueryFlowClient

The main client class for interacting with the QueryFlow API.

## Constructor

```typescript
new QueryFlowClient(privateKey: string, options?: ClientOptions)
```

### Parameters

| Parameter    | Type            | Required | Description                                      |
| ------------ | --------------- | -------- | ------------------------------------------------ |
| `privateKey` | `string`        | Yes      | Wallet private key (with or without `0x` prefix) |
| `options`    | `ClientOptions` | No       | Configuration options                            |

### ClientOptions

```typescript
interface ClientOptions {
  apiUrl?: string; // Custom API endpoint
  mode?: "signature" | "tx" | "thirdweb"; // Payment mode
}
```

## Properties

### `lastTxHash`

```typescript
public lastTxHash: string | null
```

After a successful query in `tx` mode, contains the payment transaction hash.

## Example

```typescript
import { QueryFlowClient } from "@queryflow-402/sdk";

// Development (signature mode)
const devClient = new QueryFlowClient(process.env.PRIVATE_KEY);

// Production (real payments)
const prodClient = new QueryFlowClient(process.env.PRIVATE_KEY, {
  mode: "tx",
});

// Custom API endpoint
const customClient = new QueryFlowClient(process.env.PRIVATE_KEY, {
  apiUrl: "https://your-custom-api.com",
});
```
