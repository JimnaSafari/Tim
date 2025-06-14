
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const PaymentRequests = () => {
  const navigate = useNavigate();

  // Placeholder list. Backend integration can be added later.
  const requests = [
    { id: 1, amount: 120, description: "Savings payout", status: "Pending" },
    { id: 2, amount: 65, description: "Batch contribution", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      <div className="flex items-center gap-2 mb-6 pt-12">
        <Button
          variant="ghost"
          size="sm"
          className="text-white p-2"
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          ←
        </Button>
        <h1 className="text-xl font-medium">Payment Requests</h1>
      </div>
      <Card className="glassmorphism p-6 border-0 mb-8">
        <h2 className="text-lg font-semibold mb-3">Submit a Payment Request</h2>
        <form
          className="flex flex-col md:flex-row gap-3"
          onSubmit={e => {
            e.preventDefault();
            alert("Submission logic not yet implemented.");
          }}
        >
          <input
            className="rounded px-3 py-2 bg-gray-700 border border-gray-500 text-white flex-1"
            placeholder="Description"
            disabled
          />
          <input
            className="rounded px-3 py-2 bg-gray-700 border border-gray-500 text-white w-40"
            placeholder="Amount"
            type="number"
            min="1"
            disabled
          />
          <Button
            type="submit"
            className="gradient-primary text-white md:w-auto"
            disabled
          >
            Submit
          </Button>
        </form>
        <div className="text-xs text-gray-400 mt-2">
          (Submitting requests is not yet implemented.)
        </div>
      </Card>
      <h2 className="text-lg font-semibold mb-3">Your Payment Requests</h2>
      <div className="space-y-3">
        {requests.map(r => (
          <Card
            key={r.id}
            className="flex items-center gap-4 p-4 border-0 glassmorphism-dark"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{r.description}</div>
              <div className="text-sm text-gray-400">${r.amount}</div>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded ${
                r.status === "Completed"
                  ? "bg-green-600 text-white"
                  : "bg-yellow-600 text-white"
              }`}
            >
              {r.status}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentRequests;
