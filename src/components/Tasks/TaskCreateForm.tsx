"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, type TaskFormType } from "@/lib/zodSchema";
import type { TaskPriority } from "@generated/prisma/client";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/shadcnui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnui/select";
import { Loader2 as Loader2Icon } from "lucide-react";
import { createTask } from "@/server/tasks/createTask";
import { DateTimePicker } from "./DateTimePicker";

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const TaskCreateForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<TaskFormType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    },
    mode: "all",
  });

  const onSubmit = async (data: TaskFormType) => {
    await createTask(data);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              rows={3}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="priority"
        control={control}
        render={({ field, fieldState }) => {
          const priorityLabel = priorityOptions.find(
            (opt) => opt.value === field.value,
          )?.label;
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select priority">
                    {priorityLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {priorityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />

      <Controller
        name="dueDate"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Due Date</FieldLabel>
            <DateTimePicker
              value={field.value}
              onChange={field.onChange}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => router.push("/dashboard")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
          Create
        </Button>
      </div>
    </form>
  );
};
