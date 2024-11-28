import { getCurrentUser } from "@/actions/user/get-current-user";
import { getDashboardOverview } from "@/actions/dashboard/get-dashboard-overview";
import { AddBankAccountComponent } from "@/components/account-connection";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { TopCharts } from "@/components/dashboard/top-charts";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { success, data, error } = await getDashboardOverview();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Hey {user?.name?.split(" ")[0]}, Welcome back 👋
        </h2>
        <div className="hidden items-center space-x-2 md:flex">
          <AddBankAccountComponent />
        </div>
      </div>
      <TopCharts data={data} />

      <MetricCards data={data} />
    </div>
  );
}
