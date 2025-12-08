import fetch from "node-fetch";
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  type Hash,
  type WalletClient,
  type PublicClient,
  type Transport,
  type Chain,
  type Account,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { avalancheFuji } from "viem/chains";
import {
  createPaymentMessage,
  signPayment,
  encodePaymentHeader,
} from "./payment";
import type {
  ClientOptions,
  MarketResult,
  PriceResult,
  RiskResult,
  SocialResult,
  QueryHistoryItem,
  ApiResponse,
} from "./types";

export class QueryFlowClient {
  private apiUrl: string;
  private privateKey: string;
  private address: string;
  private mode: "signature" | "tx" | "thirdweb";

  // Clients for Real Payment Mode
  private walletClient?: WalletClient<Transport, Chain, Account>;
  private publicClient?: PublicClient<Transport, Chain>;

  constructor(privateKey: string, options: ClientOptions = {}) {
    if (!privateKey) throw new Error("Private key is required");

    this.privateKey = privateKey.startsWith("0x")
      ? privateKey
      : `0x${privateKey}`;
    this.apiUrl = options.apiUrl || "http://localhost:3001";
    this.mode = options.mode || "signature";

    // Derive address
    const account = privateKeyToAccount(this.privateKey as `0x${string}`);
    this.address = account.address;

    // Initialize Viem Clients if in Real Mode or Thirdweb Mode
    if (this.mode === "tx" || this.mode === "thirdweb") {
      this.publicClient = createPublicClient({
        chain: avalancheFuji,
        transport: http(), // Default public RPC
      });

      this.walletClient = createWalletClient({
        account,
        chain: avalancheFuji,
        transport: http(),
      });
    }
  }

  /**
   * Private helper to handle the 402 payment flow
   */
  private async fetchWithAuth<T>(
    endpoint: string,
    payload: any = {}
  ): Promise<T> {
    const url = `${this.apiUrl}/api/v1${endpoint}`;

    // 1. Initial Request
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // 2. Handle 402 Payment Required
    if (response.status === 402) {
      const data = (await response.json()) as ApiResponse<any>;
      let authHeader = "";
      let headerName = "x-402-payment"; // Default for legacy modes

      if (this.mode === "thirdweb") {
        // --- THIRDWEB STANDARD X402 FLOW ---
        if (!this.walletClient || !this.publicClient) {
          throw new Error("Wallet client not initialized for thirdweb mode");
        }

        // Thirdweb x402 uses x-payment header
        headerName = "x-payment";

        const paymentAddress = data.payment?.paymentAddress;
        const priceAvax = data.payment?.priceAvax;

        if (!paymentAddress || !priceAvax) {
          throw new Error("Missing payment details in 402 response");
        }

        console.log(
          `💸 [Thirdweb x402] Sending Payment: ${priceAvax} AVAX to ${paymentAddress}...`
        );

        try {
          // Send Transaction
          const hash = await this.walletClient.sendTransaction({
            to: paymentAddress as `0x${string}`,
            value: parseEther(priceAvax),
          });

          console.log(`   Tx Sent: ${hash}. Waiting for confirmation...`);

          // Wait for Receipt
          await this.publicClient.waitForTransactionReceipt({ hash });
          console.log(`   ✅ Confirmed.`);

          // Thirdweb x-payment header format (JSON with tx proof)
          const headerPayload = {
            payload: {
              type: "x402-payment",
              version: "1",
              scheme: "exact",
              network: "avalanche-fuji",
              payer: this.address,
            },
            signature: hash, // Use tx hash as proof
          };
          authHeader = Buffer.from(JSON.stringify(headerPayload)).toString(
            "base64"
          );
        } catch (err) {
          throw new Error(`Payment Failed: ${(err as Error).message}`);
        }
      } else if (this.mode === "tx") {
        // --- CUSTOM REAL PAYMENT FLOW ---
        if (!this.walletClient || !this.publicClient) {
          throw new Error(
            "Wallet client not initialized for real payment mode"
          );
        }

        const paymentAddress = data.payment?.paymentAddress;
        const priceAvax = data.payment?.priceAvax;

        if (!paymentAddress || !priceAvax) {
          throw new Error("Missing payment details in 402 response");
        }

        console.log(
          `💸 Sending Payment: ${priceAvax} AVAX to ${paymentAddress}...`
        );

        try {
          // Send Transaction
          const hash = await this.walletClient.sendTransaction({
            to: paymentAddress as `0x${string}`,
            value: parseEther(priceAvax),
          });

          console.log(`   Tx Sent: ${hash}. Waiting for confirmation...`);

          // Wait for Receipt
          await this.publicClient.waitForTransactionReceipt({ hash });
          console.log(`   ✅ Confirmed.`);

          // Create Header
          const headerPayload = {
            mode: "tx",
            txHash: hash,
            payer: this.address,
          };
          authHeader = Buffer.from(JSON.stringify(headerPayload)).toString(
            "base64"
          );
        } catch (err) {
          throw new Error(`Payment Failed: ${(err as Error).message}`);
        }
      } else {
        // --- SIGNATURE BYPASS FLOW ---
        const nonce = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}`;
        const timestamp = Date.now();
        const amount = "0"; // Bypass amount

        const message = createPaymentMessage(
          amount,
          "0x0000000000000000000000000000000000000000",
          nonce,
          timestamp
        );
        const signature = await signPayment(this.privateKey, message);

        authHeader = encodePaymentHeader(
          signature,
          timestamp,
          amount,
          nonce,
          this.address
        );
      }

      // 3. Retry with Header (use correct header name based on mode)
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [headerName]: authHeader,
        },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      // Parse error
      let errorMsg = response.statusText;
      try {
        const errData = (await response.json()) as any;
        if (errData.error?.message) {
          errorMsg = errData.error.message;
          if (errData.error.details) {
            errorMsg += ` Details: ${JSON.stringify(errData.error.details)}`;
          }
        }
      } catch {}
      throw new Error(`QueryFlow API Error (${response.status}): ${errorMsg}`);
    }

    const result = (await response.json()) as ApiResponse<T>;
    if (!result.success || !result.data) {
      throw new Error(result.error?.message || "Unknown API error");
    }

    return result.data;
  }

  // =========================================================================
  // Public Methods
  // =========================================================================

  async market(params: {
    assets: string[];
    timeframe: string;
  }): Promise<MarketResult> {
    return this.fetchWithAuth<MarketResult>("/insights/market", params);
  }

  async price(params: {
    asset: string;
    timeframe: string;
  }): Promise<PriceResult> {
    return this.fetchWithAuth<PriceResult>("/insights/price", params);
  }

  async risk(params: { address: string }): Promise<RiskResult> {
    return this.fetchWithAuth<RiskResult>("/insights/risk", params);
  }

  async social(params: { assets: string[] }): Promise<SocialResult> {
    return this.fetchWithAuth<SocialResult>("/insights/social", params);
  }

  async getHistory(): Promise<QueryHistoryItem[]> {
    const url = `${this.apiUrl}/api/v1/history/${this.address}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }

    const json = (await response.json()) as any;
    if (json.success && json.data && Array.isArray(json.data.queries)) {
      return json.data.queries;
    }
    return [];
  }

  /**
   * Stream market insights in real-time via SSE
   * Returns an AsyncGenerator that yields SSE events as they arrive
   */
  async *marketStream(params: {
    assets: string[];
    timeframe?: string;
  }): AsyncGenerator<{
    event: "connected" | "data_ready" | "chunk" | "done" | "error";
    data: any;
  }> {
    const url = `${this.apiUrl}/api/v1/insights/market/stream`;

    // Same payment flow as regular request
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    // Handle 402 Payment Required
    if (response.status === 402) {
      const paymentData = (await response.json()) as ApiResponse<any>;
      let authHeader = "";
      let headerName = "x-402-payment";

      if (this.mode === "tx") {
        // Real payment mode
        if (!this.walletClient || !this.publicClient) {
          throw new Error("Wallet client not initialized for tx mode");
        }

        const paymentAddress = paymentData.payment?.paymentAddress;
        const priceAvax = paymentData.payment?.priceAvax;

        if (!paymentAddress || !priceAvax) {
          throw new Error("Missing payment details in 402 response");
        }

        console.log(
          `💸 Sending Payment: ${priceAvax} AVAX to ${paymentAddress}...`
        );

        try {
          const txHash = await this.walletClient.sendTransaction({
            to: paymentAddress as `0x${string}`,
            value: parseEther(priceAvax),
          });

          console.log(`   Tx Sent: ${txHash}. Waiting for confirmation...`);
          await this.publicClient.waitForTransactionReceipt({
            hash: txHash,
          });
          console.log(`   ✅ Confirmed.`);

          authHeader = Buffer.from(
            JSON.stringify({
              payer: this.address,
              amount: parseEther(priceAvax).toString(),
              txHash,
            })
          ).toString("base64");
        } catch (err) {
          throw new Error(`Payment Failed: ${(err as Error).message}`);
        }
      } else {
        // Signature bypass mode
        const nonce = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}`;
        const timestamp = Date.now();
        const amount = "0";

        const message = createPaymentMessage(
          amount,
          "0x0000000000000000000000000000000000000000",
          nonce,
          timestamp
        );
        const signature = await signPayment(this.privateKey, message);

        authHeader = encodePaymentHeader(
          signature,
          timestamp,
          amount,
          nonce,
          this.address
        );
      }

      // Retry with payment header - SSE response
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [headerName]: authHeader,
        },
        body: JSON.stringify(params),
      });
    }

    if (!response.ok || !response.body) {
      throw new Error(`SSE request failed: ${response.status}`);
    }

    // Parse SSE stream
    const reader = response.body;
    const decoder = new TextDecoder();
    let buffer = "";

    for await (const chunk of reader as any) {
      buffer += decoder.decode(chunk, { stream: true });

      // Parse SSE events from buffer
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      let currentEvent = "";
      let currentData = "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          currentEvent = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          currentData = line.slice(5).trim();
        } else if (line === "" && currentEvent && currentData) {
          // Empty line = end of event
          try {
            const parsed = JSON.parse(currentData);
            yield {
              event: currentEvent as any,
              data: parsed,
            };
          } catch {
            yield {
              event: currentEvent as any,
              data: currentData,
            };
          }
          currentEvent = "";
          currentData = "";
        }
      }
    }
  }
}
