import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { TaskCreateForm } from "@/components/Tasks/TaskCreateForm";

export const metadata: Metadata = {
  title: "Create Task",
  description: "Create a new task",
};

const CreateTaskPage = () => {
  return (
    <section className="py-8">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>New Task</CardTitle>
          <CardDescription>Fill in the details to create a new task.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskCreateForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateTaskPage;
