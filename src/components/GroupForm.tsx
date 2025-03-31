import TrashIcon from '@/components/icons/TrashIcon';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { generateUUID } from '@/lib/utils';
import { CreateGroupInput, createGroupSchema } from '@/types/Group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { LuUserPlus } from 'react-icons/lu';

interface GroupFormProps {
  initialValues: Partial<CreateGroupInput>;
  onSubmit: (data: CreateGroupInput) => Promise<void>;
  onCancel?: () => void;
  submitButtonText: string;
  loading: boolean;
  allParticipants: string[];
}

export function GroupForm({
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText,
  loading,
  allParticipants,
}: Readonly<GroupFormProps>) {
  const form = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: initialValues.name ?? '',
      description: initialValues.description ?? '',
      currency: initialValues.currency ?? 'MAD',
      members: initialValues.members?.length
        ? initialValues.members
        : [{ id: generateUUID(), name: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  });

  useEffect(() => {
    if (
      initialValues &&
      !form.formState.isSubmitting &&
      !form.formState.isDirty
    ) {
      if (initialValues.name !== undefined) {
        form.setValue('name', initialValues.name);
      }

      if (initialValues.description !== undefined) {
        form.setValue('description', initialValues.description);
      }

      if (initialValues.currency !== undefined) {
        form.setValue('currency', initialValues.currency);
      }

      if (initialValues.members && initialValues.members.length > 0) {
        form.setValue('members', initialValues.members);
      }
    }
  }, [initialValues, form]);

  // Scroll to first error using refs
  useEffect(() => {
    const errors = form.formState.errors;
    const firstError = Object.values(errors)[0];
    if (
      firstError &&
      firstError.ref &&
      'focus' in firstError.ref &&
      typeof firstError.ref.focus === 'function'
    ) {
      firstError.ref.focus();
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full flex-col gap-4"
        data-test-id="group-form"
      >
        <Card>
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Group Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input placeholder="Currency" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description (optional)"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>
              Add participants to the group. You can add up to 10 participants.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id}>
                <FormField
                  control={form.control}
                  name={`members.${index}.name`}
                  render={({ field: memberField }) => (
                    <div className="flex gap-2">
                      <FormItem className="flex w-full flex-col">
                        <FormControl>
                          <Input placeholder="Member name" {...memberField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      {allParticipants.includes(fields[index].id) ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="destructive"
                                data-test-id="remove-member-button"
                                className="h-full bg-gray-400 hover:bg-gray-400"
                              >
                                <TrashIcon className="h-4 w-4 text-white" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                You cannot remove a participant that is
                                currently active in the group.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          data-test-id="remove-member-button"
                          className="h-full"
                        >
                          <TrashIcon className="h-4 w-4 text-white" />
                        </Button>
                      )}
                    </div>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="elevated"
              onClick={() => append({ id: generateUUID(), name: '' })}
              disabled={fields.length >= 20}
              size="sm"
            >
              <LuUserPlus className="h-4 w-4" />
              Add Member
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || loading}
          >
            {form.formState.isSubmitting || loading ? (
              <>
                {submitButtonText}
                <LoadingSpinner />
              </>
            ) : (
              submitButtonText
            )}
          </Button>

          {onCancel && (
            <Button
              variant="secondary"
              type="button"
              onClick={onCancel}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
