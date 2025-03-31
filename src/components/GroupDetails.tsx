import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { GroupInput } from '@/types/Group';

export default function GroupDetails({
  group,
}: Readonly<{
  group: GroupInput;
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-gray-800">
          <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-400">ID</dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{group.id}</dd>
          </div>
          <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-400">Name</dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{group.name}</dd>
          </div>
          <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-400">Description</dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              {group.description ?? 'No description'}
            </dd>
          </div>
          <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-400">Members</dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              ({group.members.length}) members
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
