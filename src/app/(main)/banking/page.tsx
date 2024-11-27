import { getCurrentUser } from "@/actions/user/get-current-user";
import { getBankingOverview } from "@/actions/banking/get-banking-overview";
import BankAccountOverview from "@/components/transactions/bank-account-overview";
import BankAccountSelector from "@/components/transactions/bank-account-selector";
import { redirect } from "next/navigation";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Wallet } from "lucide-react";
import { AddBankAccountComponent } from "@/components/account-connection";

export default async function BankingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { success, data, error } = await getBankingOverview();
  console.log(data);

  if (!success || !data || data.bankAccounts.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Bank Accounts</h2>
          <div className="flex items-center space-x-2">
            <AddBankAccountComponent />
          </div>
        </div>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon icon={Wallet} />
          <EmptyPlaceholder.Title>No bank accounts yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Connect your bank accounts to start tracking your finances.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Bank Accounts</h2>
        <div className="flex items-center space-x-2">
          <AddBankAccountComponent />
        </div>
      </div>
      <BankAccountOverview data={data} />
      <BankAccountSelector data={data} />
    </div>
  );
}
