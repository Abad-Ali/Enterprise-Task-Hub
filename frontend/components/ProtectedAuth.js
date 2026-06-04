'use client';

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedAuth({ children }) {
  const { user } = useSelector(state => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const publicPages = ['/signin', '/signup', '/']; // pages that do NOT require auth

  useEffect(() => {
    if (user === undefined) return; // wait for Redux to load
    if (!user && !publicPages.includes(pathname)) {
      router.replace('/signin'); // redirect only if not on a public page
    } else {
      setCheckingAuth(false); // safe to render
    }
  }, [user, pathname, router]);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl font-bold font-sans">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}