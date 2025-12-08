/**
 * QueryFlow SDK - Streaming Example
 * Demonstrates real-time AI insight streaming via SSE
 *
 * Run: PRIVATE_KEY=xxx npx tsx examples/stream.ts
 */

import { QueryFlowClient } from "../src";

async function main() {
  console.log("🌊 QueryFlow Streaming Demo\n");

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ PRIVATE_KEY not set in .env");
    process.exit(1);
  }

  // Initialize client with real AVAX payment mode
  const client = new QueryFlowClient(privateKey, {
    mode: "tx", // Real AVAX payments on Fuji testnet
  });

  console.log("📈 Streaming Market Insights for BTC, ETH...\n");
  console.log("━".repeat(50));

  try {
    // Stream insights in real-time
    for await (const event of client.marketStream({
      assets: ["bitcoin", "ethereum"],
      timeframe: "24h",
    })) {
      switch (event.event) {
        case "connected":
          console.log("🔗 Connected to stream");
          console.log(
            `   Assets: ${event.data.assets?.join(", ") || "unknown"}`
          );
          break;

        case "data_ready":
          console.log(`\n📊 Data fetched in ${event.data.latencyMs}ms`);
          console.log(`   Source: ${event.data.source}`);
          console.log("\n🤖 AI Response (streaming):");
          break;

        case "chunk":
          // Print chunks as they arrive (no newline)
          process.stdout.write(event.data.text);
          break;

        case "done":
          console.log("\n\n━".repeat(50));
          console.log(`✅ Stream complete!`);
          console.log(`   Tokens: ${event.data.tokensUsed}`);
          console.log(`   Total latency: ${event.data.totalLatencyMs}ms`);
          break;

        case "error":
          console.error("❌ Error:", event.data.message);
          break;
      }
    }
  } catch (error) {
    console.error("Stream error:", (error as Error).message);
  }
}

main();
