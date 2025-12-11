# marketStream()

Stream market insights in real-time via Server-Sent Events (SSE).

## Signature

```typescript
client.marketStream(params: {
  assets: string[];
  timeframe?: string;
}): AsyncGenerator<{
  event: "connected" | "data_ready" | "chunk" | "done" | "error";
  data: any;
}>
```

## Parameters

| Parameter   | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `assets`    | `string[]` | Array of token symbols     |
| `timeframe` | `string`   | Optional. Default: `"24h"` |

## Events

| Event        | Description                        |
| ------------ | ---------------------------------- |
| `connected`  | Stream connected                   |
| `data_ready` | Initial data loaded                |
| `chunk`      | AI response chunk (streaming text) |
| `done`       | Stream complete                    |
| `error`      | Error occurred                     |

## Example

```typescript
for await (const { event, data } of client.marketStream({
  assets: ["BTC", "ETH"],
  timeframe: "24h",
})) {
  switch (event) {
    case "connected":
      console.log("Connected to stream");
      break;
    case "chunk":
      process.stdout.write(data.text); // Stream AI response
      break;
    case "done":
      console.log("\nStream complete");
      break;
    case "error":
      console.error("Error:", data);
      break;
  }
}
```

## Price

$0.02 per stream
