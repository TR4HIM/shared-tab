'use client';

import { useGroup } from '@/hooks';
import { useParams } from 'next/navigation';
export default function GroupsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { group } = useGroup(id);

  return <div>{group ? children : null}</div>;
}
