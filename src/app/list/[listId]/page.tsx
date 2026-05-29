import { getLists, getTasks } from "@/app/actions/tasks";
import DashboardClient from "@/app/DashboardClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ listId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ListPage = async ({ params }: PageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { listId } = await params;
  const lists = await getLists();
  const activeList = lists.find((l) => l.id === listId);

  if (!activeList) {
    redirect("/");
  }

  const tasks = await getTasks({ listId });

  return (
    <DashboardClient
      tasks={tasks}
      lists={lists}
      pageTitle={activeList.name}
      filter={undefined}
    />
  );
};

export default ListPage;
