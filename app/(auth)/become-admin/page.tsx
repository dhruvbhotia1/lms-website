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
import { makeUserAdmin } from "@/hooks/make-user-admin";
import { toast } from "sonner";

export default function BecomeAdmin() {
  const [email, setEmail] = useState("");

  const [pendingTransition, startAdminTransition] = useTransition();

  const becomeAdmin = (email: string) => {
    if (!email) return;

    try {
      startAdminTransition(async () => {
        const result = await makeUserAdmin(email);

        if (result.status === "error") {
          toast.error(result.message);
        } else {
          toast.success("You are now an admin!");
        }
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card className={"gap-y-6"}>
      <CardHeader>
        <CardTitle className={"text-xl"}>Welcome</CardTitle>
        <CardDescription>
          You can sign up to be become an admin here.
        </CardDescription>
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
          onClick={() => becomeAdmin(email)}
          disabled={pendingTransition}
        >
          Become an Admin
        </Button>
      </CardContent>
    </Card>
  );
}
