import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotPublisherPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>

          <CardTitle className="text-2xl">You are not a Publisher.</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            You do not have the necessary permissions to create or delete a course.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-6">
          <Link
            href="/"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <ArrowLeft className="size-4 inline-block" />
            Back to Home
          </Link>

          <Link
            href="/become-publisher"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <ArrowRight className="size-4 inline-block" />
            Become a Publisher
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
