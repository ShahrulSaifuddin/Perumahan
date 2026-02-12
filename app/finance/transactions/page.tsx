import { Metadata } from "next";
import { getTransactions } from "@/lib/api/transactions";
import { getCurrentUserProfile } from "@/lib/api/users";
import { TransactionList } from "@/features/finance/transaction-list";
import { TransactionForm } from "@/features/finance/transaction-form";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Transactions | DBKL Flat Management",
  description: "Manage income and expenses",
};

export default async function TransactionsPage() {
  const user = await getCurrentUserProfile();
  if (!user) redirect("/auth/login");

  const targetPropertyId =
    user.property_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const transactions = await getTransactions(targetPropertyId, {
    year: new Date().getFullYear(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage incomings and outgoings.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Form Column */}
        <div className="md:col-span-1">
          <div className="clay-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">New Transaction</h2>
            <TransactionForm propertyId={targetPropertyId} />
          </div>
        </div>

        {/* List Column */}
        <div className="md:col-span-2">
          <div className="clay-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              History ({new Date().getFullYear()})
            </h2>
            <TransactionList
              transactions={transactions || []}
              currentUserRole={user.role}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
