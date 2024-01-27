import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getUserWorkspaces } from "@/actions/account-switcher/get-workspace";

import { accounts, mails } from "@/components/new-dashboard/data";
import { SaveMoneyDashboard } from "@/components/savemoney/components/save-money-dashboard";

export const metadata = {
  title: "Dasboard",
  description: "Dashboard description",
};

export default async function DashboardPage() {
  const workspace = await getUserWorkspaces();
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <>
      <div className="flex flex-col">
        <SaveMoneyDashboard
          accounts={accounts}
          mails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
          workspace={workspace}
        />
      </div>
    </>
  );
}
