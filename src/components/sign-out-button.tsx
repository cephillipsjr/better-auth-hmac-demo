"use client";

// next
import { useRouter } from "next/navigation";

// third-party
import { authClient } from "@/lib/auth-client";

// project imports
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/actions/sign-out";

// ==============================|| SIGN OUT BUTTON ||============================== //

export function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await signOutAction();

    console.log(result);

    if (result.success) {
      router.push("/login");
    }
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out <LogOut className="size-4" />
    </Button>
  );
}
