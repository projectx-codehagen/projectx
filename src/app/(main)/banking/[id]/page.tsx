import AccountTransactions from "@/components/transactions/account-transactions";
import BankAccountOverview from "@/components/transactions/bank-account-overview";

export default function BankingDetailsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Bank Accounts</h2>
      </div>
      <AccountTransactions />
    </div>
  );
}
