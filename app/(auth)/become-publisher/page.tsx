"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { makeUserPublisher } from "@/hooks/make-user-publisher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BecomePublisherPage() {
  const [email, setEmail] = useState("");

  const [pendingTransition, startPublisherTransition] = useTransition();

  const router = useRouter();

  const becomePublisher = (email: string) => {
    if (!email) return;

    try {
      startPublisherTransition(async () => {
        const result = await makeUserPublisher(email); // change this

        if (result.status === "error") {
          toast.error(result.message);
        } else {
          toast.success("You are now a Publisher!");
        }

        router.push("/publisher"); // change the route to publisher
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Card className={"gap-y-6"}>
      <CardHeader>
        <CardTitle className={"text-xl"}>Welcome</CardTitle>
        <CardDescription>You can sign up to be become a publisher here.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-y-6">
        <Input
          placeholder={"Please type your email address for verification"}
          type={"email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          className="w-1/2 mx-auto"
          onClick={() => becomePublisher(email)}
          disabled={pendingTransition}
        >
          Become a Publisher
        </Button>
      </CardContent>
    </Card>
  );
}
