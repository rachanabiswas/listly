"use client";

import { getLists } from "@/app/actions/tasks";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  CheckCheckIcon,
  FlagIcon,
  InboxIcon,
  ListIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ListItem = Awaited<ReturnType<typeof getLists>>[number];

const defaultViews = [
  { id: "all", label: "All Tasks", icon: InboxIcon, href: "/" as const },
  {
    id: "today",
    label: "Today",
    icon: CalendarIcon,
    href: "/?filter=today" as const,
  },
  {
    id: "important",
    label: "Important",
    icon: FlagIcon,
    href: "/?filter=important" as const,
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCheckIcon,
    href: "/?filter=completed" as const,
  },
] as const;

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [lists, setLists] = useState<ListItem[]>([]);
  const [newListName, setNewListName] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);

  const fetchLists = useCallback(async () => {
    const data = await getLists();
    setLists(data);
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists, pathname]);

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    const { createList } = await import("@/app/actions/tasks");
    await createList(newListName.trim());
    setNewListName("");
    setIsAddingList(false);
    await fetchLists();
  };

  const handleDeleteList = async (listId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { deleteList } = await import("@/app/actions/tasks");
    await deleteList(listId);
    await fetchLists();
  };

  const navigateToList = (listId: string) => {
    router.push(`/list/${listId}`);
  };

  return (
    <aside className="bg-card flex h-full w-64 flex-col border-r p-4">
      {/* App Title */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <CheckCheckIcon className="text-primary size-6" />
        <h1 className="text-xl font-bold">Listly</h1>
      </div>

      {/* Default Views */}
      <nav className="mb-6 space-y-1">
        {defaultViews.map((view) => {
          const Icon = view.icon;
          return (
            <Link
              key={view.id}
              href={view.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                (
                  pathname === view.href ||
                    (view.id === "all" &&
                      pathname === "/" &&
                      !pathname.includes("?filter="))
                ) ?
                  "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}>
              <Icon className="size-4" />
              {view.label}
            </Link>
          );
        })}
      </nav>

      {/* Lists Section */}
      <div className="mb-2 flex items-center justify-between px-2">
        <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Lists
        </h2>
        <button
          onClick={() => setIsAddingList(!isAddingList)}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-5 items-center justify-center rounded-md"
          aria-label="Add new list">
          <PlusIcon className="size-4" />
        </button>
      </div>

      {isAddingList && (
        <div className="mb-2 px-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddList();
            }}
            className="flex gap-1">
            <input
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name..."
              className="bg-background focus:ring-primary flex-1 rounded-md border px-2 py-1 text-sm outline-none focus:ring-1"
              onBlur={() => {
                if (!newListName.trim()) setIsAddingList(false);
              }}
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs">
              Add
            </button>
          </form>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {lists.map((list) => {
          const listHref = `/list/${list.id}`;
          const isActive = pathname === listHref;
          return (
            <button
              key={list.id}
              onClick={() => navigateToList(list.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ?
                  "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}>
              <ListIcon
                className="size-4"
                style={{ color: list.color }}
              />
              <span className="flex-1 truncate text-left">{list.name}</span>
              <span className="text-muted-foreground text-xs">
                {list._count.tasks}
              </span>
              <button
                onClick={(e) => handleDeleteList(list.id, e)}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive hidden size-5 items-center justify-center rounded group-hover:flex"
                aria-label={`Delete ${list.name}`}>
                <Trash2Icon className="size-3.5" />
              </button>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
