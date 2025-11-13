"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import DeleteShiftPage from "./DeleteShift";

export default function DeleteProtected() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
      setAuthChecked(true);
    }

    checkAuth();
  }, [router]);

  if (!authChecked) {
    return <div className="p-4">Checking authentication...</div>;
  }

  return <DeleteShiftPage />;
}
