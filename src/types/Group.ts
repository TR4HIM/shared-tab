import { Prisma } from '@prisma/client';
import { z } from 'zod';
// Schema for adding a member to a group
export const groupMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});
export type GroupMemberInput = z.infer<typeof groupMemberSchema>;

export const groupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Group name is required' }),
  description: z.string().optional(),
  currency: z.string().default('MAD'),
  members: z
    .array(groupMemberSchema)
    .min(1, { message: 'At least one member is required' })
    .max(10, { message: 'Maximum of 10 members allowed' })
    .superRefine((members, ctx) => {
      const namesMap = new Map<string, number>();

      members.forEach((member, index) => {
        const name = member.name.toLowerCase();
        if (namesMap.has(name)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Member name must be unique',
            path: [`${index}.name`],
          });
        }
        namesMap.set(name, index);
      });
    }),
});
export const groupsSchema = z.array(groupSchema);
export type GroupInput = z.infer<typeof groupSchema>;

// Schema for creating a new group
export const createGroupSchema = groupSchema.omit({ id: true });
export type CreateGroupInput = z.infer<typeof createGroupSchema>;

// Schema for updating an existing group
export const updateGroupSchema = groupSchema.partial();
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;

export type GroupWithRelations = Prisma.GroupGetPayload<{
  where: { id: string };
  include: {
    members: true;
  };
}>;
