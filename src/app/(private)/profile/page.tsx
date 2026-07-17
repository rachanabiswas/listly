import type { Metadata } from "next";
import { getServerSession } from "@/server/getServerSession";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcnui/card";
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
        <CardHeader>
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
