export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-[1920px] mx-auto">{children}</div>;
}
