import { getLists, getTasks } from "@/app/actions/tasks";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Listly — Clear tasks, calm mind",
  description: "A personal task management application",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const filter = params.filter as string | undefined;
  const listId = params.listId as string | undefined;

  let tasks;
  const lists = await getLists();

  if (filter === "today") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tasks = await getTasks({});
    tasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      return due >= today && due < tomorrow;
    });
  } else if (filter === "important") {
    tasks = await getTasks({ priority: "high" });
  } else if (filter === "completed") {
    tasks = await getTasks({ isCompleted: true });
  } else if (listId) {
    tasks = await getTasks({ listId });
  } else {
    tasks = await getTasks({});
  }

  const activeList = listId ? lists.find((l) => l.id === listId) : null;

  let pageTitle = "All Tasks";
  if (filter === "today") pageTitle = "Today";
  else if (filter === "important") pageTitle = "Important";
  else if (filter === "completed") pageTitle = "Completed";
  else if (activeList) pageTitle = activeList.name;

  return (
    <DashboardClient
      tasks={tasks}
      lists={lists}
      pageTitle={pageTitle}
      filter={filter}
    />
  );
};

export default Page;
