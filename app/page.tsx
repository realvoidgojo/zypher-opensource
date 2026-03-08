"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const sid = localStorage.getItem("supplier_id");
    if (sid) router.replace("/dashboard");
    else router.replace("/landing");
  }, [router]);
  return null;
}
