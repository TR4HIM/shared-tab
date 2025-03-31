import prisma from '@/lib/prisma';
import { generateUUID, uuidToBase62 } from '@/lib/utils';
import {
  CreateGroupInput,
  GroupWithRelations,
  UpdateGroupInput,
} from '@/types/Group';
import type { Group } from '@prisma/client';

export async function getGroups(): Promise<Group[]> {
  return prisma.group.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      members: true,
    },
  });
}

export async function getGroupById(
  id: string
): Promise<GroupWithRelations | null> {
  return prisma.group.findUnique({
    where: { id },
    include: {
      members: true,
    },
  });
}

export async function createGroup(data: CreateGroupInput): Promise<Group> {
  const groupId = uuidToBase62(generateUUID());

  await prisma.$transaction(async (tx) => {
    // Create the group
    await tx.group.create({
      data: {
        id: groupId,
        name: data.name,
        description: data.description,
        currency: data.currency || 'MAD', // Default to MAD if not provided
      },
    });

    // Create all members at once using createMany
    await tx.groupMember.createMany({
      data: data.members.map((member) => ({
        groupId: groupId,
        name: member.name,
        id: uuidToBase62(member.id),
      })),
    });
  });

  // Return the complete group with its members
  return prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: true,
    },
  }) as Promise<Group>;
}

export async function updateGroup(
  id: string,
  data: UpdateGroupInput
): Promise<Group> {
  // We need to handle members separately from other data
  const { members, ...groupData } = data;

  // Update the group basic data
  await prisma.group.update({
    where: { id },
    data: groupData,
  });

  if (members && members.length > 0) {
    // Get existing members
    const existingMembers = await prisma.groupMember.findMany({
      where: { groupId: id },
    });

    // Extract member names for easier comparison
    const existingMemberNames = existingMembers.map((member) => member.id);
    // update existing with new name if it's different
    const updatedExistingMembers = existingMembers
      .filter((member) => {
        const newMember = members.find((m) => m.id === member.id);
        return newMember && newMember.name !== member.name;
      })
      .map((member) => {
        const newMember = members.find((m) => m.id === member.id);
        return { ...member, name: newMember!.name };
      });

    const newMemberNames = members.map((member) => member.id);

    // Find members to delete (exist in DB but not in the new list)
    const membersToDelete = existingMembers.filter(
      (member) => !newMemberNames.includes(member.id)
    );

    // Find members to add (exist in new list but not in DB)
    const membersToAdd = members.filter(
      (member) => !existingMemberNames.includes(member.id as string)
    );

    // Delete members that are no longer needed
    if (membersToDelete.length > 0) {
      await prisma.groupMember.deleteMany({
        where: {
          id: {
            in: membersToDelete.map((member) => member.id),
          },
        },
      });
    }

    for (const member of membersToAdd) {
      await prisma.groupMember.create({
        data: {
          id: uuidToBase62(generateUUID()),
          name: member.name,
          groupId: id,
        },
      });
    }

    if (updatedExistingMembers.length > 0) {
      for (const member of updatedExistingMembers) {
        await prisma.groupMember.update({
          where: { id: member.id },
          data: { name: member.name },
        });
      }
    }
  }

  // Return the updated group with its members
  return prisma.group.findUnique({
    where: { id },
    include: {
      members: true,
    },
  }) as Promise<Group>;
}

export async function deleteGroup(id: string): Promise<Group> {
  // First, delete all expenses related to this group and their participants
  const expenses = await prisma.expense.findMany({
    where: { groupId: id },
    select: { id: true },
  });

  // Delete participants of each expense
  for (const expense of expenses) {
    await prisma.expenseParticipant.deleteMany({
      where: { expenseId: expense.id },
    });
  }

  // Now delete all expenses
  await prisma.expense.deleteMany({
    where: { groupId: id },
  });

  // Then delete all group members
  await prisma.groupMember.deleteMany({
    where: { groupId: id },
  });

  // Finally delete the group itself
  return prisma.group.delete({
    where: { id },
    include: {
      members: true,
    },
  });
}
