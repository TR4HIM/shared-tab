'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useGroups } from '@/hooks/groupHooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdArrowForward, MdPeople } from 'react-icons/md';
export default function GroupsPage() {
  const router = useRouter();
  const { loading, groups, isError } = useGroups();

  if (loading || !groups || isError) {
    return (
      <div className="container mx-auto py-6">
        <LoadingSpinner size="large" className="mx-auto" color="red" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">My Groups</h3>
        <Button
          onClick={() => router.push('/groups/new')}
          variant="default"
          size="default"
          data-test-id="new-group-button"
        >
          New Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card
          className="border-2 border-dashed border-gray-200 bg-gray-50/50"
          data-test-id="no-groups-card"
        >
          <CardHeader className="text-center">
            <CardTitle className="text-xl">No groups found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-gray-500">
              Create your first group to get started.
            </p>
            <Button
              onClick={() => router.push('/groups/new')}
              variant="default"
              size="lg"
              className="px-8"
            >
              Create Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          data-test-id="groups-list"
        >
          {groups.map((group) => (
            <Card
              key={group.id}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-md"
              data-test-id={`group-card-${group.id}`}
            >
              <Link
                href={`/groups/${group.id}`}
                className="absolute inset-0 z-10"
                aria-label={`View details for ${group.name} group`}
              >
                <span className="sr-only">View group details</span>
              </Link>

              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="line-clamp-1">{group.name}</span>
                  <MdArrowForward className="invisible h-5 w-5 text-gray-400 transition-transform group-hover:visible group-hover:translate-x-1" />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {group.description ?? 'No description'}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MdPeople className="h-4 w-4" />
                  <span>{group.members.length} members</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
