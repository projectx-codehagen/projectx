import { getCurrentUser } from "@/actions/user/get-current-user";
import { CategoryChart } from "@/components/categories/category-chart";
import { CategoryList } from "@/components/categories/category-list";
import { RecentTransactions } from "@/components/categories/recent-transactions";
import { EditBudgetComponent } from "@/components/categories/edit-budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, List, Receipt } from "lucide-react";
import { redirect } from "next/navigation";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { getCategoriesOverview } from "@/actions/categories/get-categories-overview";
import { BudgetSummary } from "@/components/categories/budget-summary";
import { CreateBudgetButton } from "@/components/categories/create-budget-button";

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { success, data, error } = await getCategoriesOverview();
  console.log(data);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your categories</h2>
        {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
          <EditBudgetComponent />
        ) : (
          <CreateBudgetButton />
        )}
      </div>

      {data?.categoryBreakdown && data.categoryBreakdown.length > 0 && (
        <BudgetSummary data={data} />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryChart data={data.categoryBreakdown} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon icon={PieChart} />
                <EmptyPlaceholder.Title>
                  No spending data
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Add categories and transactions to see your spending
                  breakdown.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            </CardContent>
          </Card>
        )}

        {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryList data={data.categoryBreakdown} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon icon={List} />
                <EmptyPlaceholder.Title>
                  No categories yet
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Add your first category to start tracking expenses.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            </CardContent>
          </Card>
        )}
      </div>

      {data?.recentTransactions && data.recentTransactions.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions data={data.recentTransactions} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon icon={Receipt} />
              <EmptyPlaceholder.Title>
                No transactions yet
              </EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                Transactions will appear here as you add them.
              </EmptyPlaceholder.Description>
            </EmptyPlaceholder>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
