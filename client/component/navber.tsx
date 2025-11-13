"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import ThemeSwitch from "@/lib/theme";
import { cn } from "@/lib/utils";
import { AlignJustify, X, Briefcase, BookOpen, User, Twitter, TrendingUp, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Drawer } from "vaul";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/button";

interface HomeHeaderProps {}

export default function HomeHeader({}: HomeHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 992px)");
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { href: "/jobs", label: "Find Jobs", icon: Briefcase },
    { href: "/resources", label: "Learning Resources", icon: BookOpen },
    // { href: "/profile", label: "Profile", icon: User },
  ];
  return (
    <header className="w-full top-0 z-10 absolute lg:z-10 lg:flex lg:items-center lg:px-8 lg:py-0 text-primary-foreground">
      <div className="flex md:max-w-screen-lg mx-auto w-full items-center relative justify-between  h-16 px-4  p-2 bg-white border dark:border-neutral-800 border-neutral-200   rounded-b-xl  dark:bg-zinc-950">
        {isMobile && (
          <Drawer.Root direction="left" open={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Trigger className="px-3 text-white h-10 grid place-content-center bg-gradient-to-b from-blue-500 from-100% to-blue-700  w-fit rounded-lg">
              <AlignJustify />
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
              <Drawer.Content
                className="left-2 top-2 bottom-2 fixed z-50 outline-none w-72 flex"
                style={
                  {
                    "--initial-transform": "calc(100% + 8px)",
                  } as React.CSSProperties
                }
              >
                <div className="dark:bg-black bg-white border border-neutral-200 dark:border-neutral-800 p-2 h-full w-full grow flex flex-col rounded-[16px]">
                  <div className="w-full flex justify-between mb-2">
                    <a href="/" className="  flex items-center pl-2">
                      <div className="text-zinc-950 dark:text-white flex gap-2 items-center">
                        <div className="w-9 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-semibold text-lg">Harican</span>
                      </div>
                    </a>
                    <button
                      className="rounded-md w-fit bg-neutral-950 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <X />
                    </button>
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "cursor-pointer gap-1 select-none p-2 dark:hover:text-blue-200 hover:text-base-blue rounded-md transition-colors duration-200 flex items-center justify-start",
                        pathname.startsWith(item.href) &&
                          "dark:text-blue-200 dark:border dark:border-blue-950 text-base-blue dark:bg-neutral-900 bg-neutral-200",
                      )}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}
        {!isMobile && (
          <>
            <nav className="flex gap-2 items-center font-medium">
              <a href="/" className="  flex items-center pl-2">
                <div className="text-zinc-950 dark:text-white flex gap-2 items-center">
                  <div className="w-9 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-lg">Harican</span>
                </div>
              </a>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "cursor-pointer gap-1 select-none p-2 dark:hover:text-blue-200 hover:text-base-blue   rounded-md transition-colors duration-200 flex items-center justify-center",
                    pathname.startsWith(item.href) &&
                      "dark:text-blue-200 dark:border dark:border-blue-950 text-base-blue dark:bg-neutral-900 bg-neutral-200",
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </>
        )}
        <nav className="flex items-center gap-2">
          <a
            href="https://x.com/mihf05"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 border dark:border-neutral-800 border-neutral-200  px-3 rounded-md items-center justify-center"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <ThemeSwitch
            className="border w-10 rounded-md h-10 dark:border-neutral-800 border-neutral-200"
          />
          {isAuthenticated ? (
            <>
                <Link
                href="/profile"
                className="flex items-center gap-2 px-3 h-10 border dark:border-neutral-800 border-neutral-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                <User className="h-4 w-4" />
                <span className="text-sm hidden md:inline">{user?.fullName || "User"}</span>
                </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="h-10 gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-[#334cec] text-white border dark:border-neutral-800 border-neutral-200 h-10 items-center flex justify-center px-3 rounded-md"
              >
                Get Start
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}