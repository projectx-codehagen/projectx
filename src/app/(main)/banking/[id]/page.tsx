import { getAccountDetails } from "@/actions/banking/get-account-details";
import { notFound } from "next/navigation";
import AccountTransactions from "@/components/transactions/account-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { BalanceTooltip } from "@/components/transactions/balance-tooltip";

interface BankingDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function BankingDetailsPage({
  params,
}: BankingDetailsPageProps) {
  const result = await getAccountDetails(params.id);
  console.log(result);

  if (!result.success || !result.data) {
    notFound();
  }

  const { account, transactions } = result.data;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{account.name}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <BalanceTooltip
              balance={account.balance}
              availableBalance={account.balance}
              pendingBalance={0}
              lastUpdated={account.lastUpdated}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {account.balance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated{" "}
              {formatDistanceToNow(account.lastUpdated, { addSuffix: true })}
            </p>
          </CardContent>
        </Card>
      </div>

      <AccountTransactions transactions={transactions} />
    </div>
  );
}
