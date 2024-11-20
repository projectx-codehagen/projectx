import { getCurrentUser } from "@/actions/user/get-current-user";
import { AddBankAccountComponent } from "@/components/account-connection";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { TopCharts } from "@/components/dashboard/top-charts";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Hey {user?.name?.split(" ")[0]}, Welcome back 👋
        </h2>
        <div className="hidden items-center space-x-2 md:flex">
          {/* <CalendarDateRangePicker /> */}
          <AddBankAccountComponent />
        </div>
      </div>
      <TopCharts />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      <MetricCards />
    </div>
  );
}
