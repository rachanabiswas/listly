import LoginForm from "@/components/Auth/LoginForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/shadcnui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description: "",
};

const page = () => {
  return (
    <section className="grid h-dvh place-items-center">
      <Card>
        <CardHeader></CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter></CardFooter>
      </Card>
    </section>
  );
};

export default page;
