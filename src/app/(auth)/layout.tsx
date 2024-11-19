interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: MarketingLayoutProps) {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {children}
    </main>
  );
}
