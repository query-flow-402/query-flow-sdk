/**
 * Real Payment Example
 *
 * This example performs a query using REAL AVAX tokens on the Fuji testnet.
 * Requirements:
 * 1. PRIVATE_KEY env var set to a wallet with AVAX (Fuji).
 * 2. Backend running with PAYMENT_RECEIVER_ADDRESS configured.
 */

import { QueryFlowClient } from "../src/index";

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("❌ PRIVATE_KEY environment variable is required.");
  console.error("   Run with: PRIVATE_KEY=0x... npx tsx examples/real.ts");
  process.exit(1);
}

// Explicitly cast to string because we've verified it's defined above
const validPrivateKey: string = PRIVATE_KEY;

async function main() {
  console.log("🚀 Initializing QueryFlow Client (REAL PAYMENT MODE)...");

  const client = new QueryFlowClient(validPrivateKey, {
    apiUrl: "http://localhost:3001",
    mode: "tx", // <--- Enable Real Payment Mode
  });

  try {
    console.log("\n📈 Querying Market Insights (Requires AVAX)...");

    // This call will:
    // 1. Get 402 with price (~0.1 AVAX usually, or whatever backend sets)
    // 2. Send Transaction from your wallet
    // 3. Wait for confirmation
    // 4. Resend request with proof
    const market = await client.market({
      assets: ["BTC"],
      timeframe: "24h",
    });

    console.log("✅ Query Successful!");
    console.log(`   Tokens Used: ${market.tokensUsed}`);
    console.log(
      `   Sentiment: ${market.sentiment.score}/100 (${market.sentiment.trend})`
    );
  } catch (error) {
    console.error("❌ Query Failed:", error);
  }
}

main();
