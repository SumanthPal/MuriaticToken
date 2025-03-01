"use client";
import React, { useState } from "react";
import { useToken } from "@/hooks/useToken";

const TransferForm: React.FC = () => {
  const { transfer, symbol } = useToken();
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient || !amount) {
      setMessage("Please enter a recipient and amount!");
      return;
    }

    setIsTransferring(true);
    setMessage("");

    try {
      const success = await transfer(recipient, amount);

      if (success) {
        setMessage(
          `Successfully transferred ${amount} ${symbol} to ${recipient}`
        );
        setAmount("");
        setRecipient("");
      } else {
        setMessage("Transfer failed");
      }
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
        Transfer Tokens
      </h2>

      <form onSubmit={handleTransfer} className="space-y-5">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={isTransferring}
            className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Amount
          </label>
          <div className="flex items-center border border-white/20 bg-white/10 rounded-lg p-3">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              disabled={isTransferring}
              className="w-full bg-transparent text-white focus:outline-none disabled:bg-gray-800"
            />
            <span className="ml-2 text-gray-300">{symbol}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isTransferring || !recipient || !amount}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
            isTransferring || !recipient || !amount
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 shadow-lg"
          }`}
        >
          {isTransferring ? "Processing..." : "Transfer"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-300">{message}</p>}
    </div>
  );
};

export default TransferForm;
