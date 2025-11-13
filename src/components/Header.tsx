"use client";
import { useRouter, usePathname } from "next/navigation";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const handleOnClickPath = (val: string) => {
    if (val === "calendar") {
      if (pathname === "/calendar") return;
      router.push("/calendar");
    }

    if (val === "form") {
      if (pathname === "/") return;
      router.push("/");
    }
  };

  return (
    <div className="flex flex-row w-full justify-between">
      <div onClick={() => handleOnClickPath("form")}>
        <h3
          className={`text-lg mb-4 ${
            pathname === "/"
              ? "font-bold cursor-default"
              : "cursor-pointer font-normal hover:underline"
          }`}
        >
          Input Jadwal Dokter
        </h3>
      </div>
      <div onClick={() => handleOnClickPath("calendar")}>
        <h3
          className={`text-lg mb-4 ${
            pathname === "/calendar"
              ? "font-bold cursor-default"
              : "cursor-pointer font-normal hover:underline"
          }`}
        >
          Lihat Jadwal Dokter
        </h3>
      </div>
    </div>
  );
}

export default Header;
