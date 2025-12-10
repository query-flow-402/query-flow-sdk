import "dotenv/config";
import { QueryFlowClient } from "../src/index";
import { generatePrivateKey } from "viem/accounts";

// Use a generated key for testing (Signature Mode works with any active key)
// In production, use your actual wallet private key
const PRIVATE_KEY = process.env.PRIVATE_KEY || generatePrivateKey();

async function main() {
  console.log("🚀 Initializing QueryFlow Client...");
  console.log(
    `🔑 Wallet: ${PRIVATE_KEY.slice(0, 6)}...${PRIVATE_KEY.slice(-4)}`
  );

  const isRealKey = !!process.env.PRIVATE_KEY;
  console.log(
    `ℹ️  Mode: ${isRealKey ? "Real Payment (TX)" : "Dev Mode (Signature)"}`
  );

  const client = new QueryFlowClient(PRIVATE_KEY, {
    apiUrl: "http://103.94.239.242",
    mode: isRealKey ? "tx" : "signature",
  });

  try {
    console.log("\n📈 querying market insights...");
    const market = await client.market({
      assets: ["BTC", "ETH"],
      timeframe: "24h",
    });

    console.log("✅ Market Insight Received:");
    console.log(
      `   Sentiment: ${market.sentiment.score}/100 (${market.sentiment.trend})`
    );
    console.log(`   Summary: ${market.sentiment.summary}`);

    if (client.lastTxHash) {
      console.log(
        `   🔗 Tx: https://testnet.snowtrace.io/tx/${client.lastTxHash}`
      );
    }
  } catch (error) {
    console.error("❌ Query Failed:", error);
  }
}

main();
