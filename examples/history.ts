import { QueryFlowClient } from "../src/index";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("❌ PRIVATE_KEY environment variable is required.");
  console.error("   Run with: PRIVATE_KEY=0x... npx tsx examples/history.ts");
  console.error("   (Use the same key you used for examples/real.ts)");
  process.exit(1);
}

async function main() {
  console.log("📜 QueryFlow History Demo\n");

  // Initialize Client
  // Note: We don't need 'real' mode just to fetch history, but we need a wallet address
  // The client derives the address from the private key
  const client = new QueryFlowClient(PRIVATE_KEY as string);

  console.log(`👤 Fetching history...`);

  try {
    const history = await client.getHistory();

    if (history.length === 0) {
      console.log("⚠️ No history found. Try running 'examples/real.ts' first!");
      return;
    }

    console.log(`✅ Found ${history.length} records:\n`);

    // Parse and display
    history.forEach((item, index) => {
      console.log(`[${index + 1}] ${item.type.toUpperCase()}`);
      console.log(`    Date:   ${new Date(item.timestamp).toLocaleString()}`);
      console.log(
        `    Cost:   ${item.amount} AVAX ($${item.amountUsd.toFixed(2)})`
      );
      console.log(`    TxType: ${item.status}`);
      console.log(`    TxHash: ${item.txHash}`);
      console.log(`    http://testnet.snowtrace.io/tx/${item.txHash}\n`);
    });
  } catch (error) {
    console.error("❌ Failed to fetch history:", error);
  }
}

main();
