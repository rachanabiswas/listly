import type { Metadata } from "next";
import { getServerSession } from "@/server/getServerSession";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shadcnui/card";
import ProfileForm from "@/components/Profile/ProfileForm";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile settings",
};

const ProfilePage = async () => {
  const session = await getServerSession();

  return (
    <section className="flex justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center gap-4">
          {session!.user.image ? (
            <img
              src={session!.user.image}
              alt={session!.user.name}
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
              {session!.user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              name: session!.user.name,
              image: session!.user.image ?? "",
            }}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default ProfilePage;
