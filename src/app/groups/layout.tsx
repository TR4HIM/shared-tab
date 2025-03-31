export default function GroupsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="m-auto block max-w-screen-lg px-6">{children}</div>;
}
