"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import ThemeSwitch from "@/lib/theme";
import { cn } from "@/lib/utils";
import { AlignJustify, X, Briefcase, BookOpen, User, LogOut, LayoutDashboard, Plus, Home, Bot, MapIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Drawer } from "vaul";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/button";

export default function DashboardNavbar() {
  const isMobile = useMediaQuery("(max-width: 992px)");
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Dashboard-specific nav items
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/jobs", label: "Find Jobs", icon: Briefcase },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
    { href: "/roadmaps", label: "Career Roadmap", icon: MapIcon },
    ...(user?.role === 'POSTER' || user?.role === 'ADMIN' 
      ? [{ href: "/post-job", label: "Post Job", icon: Plus }] 
      : []
    ),
  ];

  return (
    <header className="w-full border-b dark:border-neutral-800 border-neutral-200 bg-white dark:bg-zinc-950 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {isMobile && (
            <Drawer.Root direction="left" open={isOpen} onOpenChange={setIsOpen}>
              <Drawer.Trigger className="px-3 text-white h-10 grid place-content-center bg-gradient-to-b from-blue-500 from-100% to-blue-700 w-fit rounded-lg">
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
                    <Drawer.Title className="sr-only">Navigation Menu</Drawer.Title>
                    <div className="w-full flex justify-between mb-4">
                      <Link href="/" className="flex items-center pl-2">
                        <div className="text-zinc-950 dark:text-white flex gap-2 items-center">
                          <img src="/logo.png" alt="Harican Logo" className="w-9 h-10 object-contain" />
                          <span className="font-semibold text-lg">Harican</span>
                        </div>
                      </Link>
                      <button
                        className="rounded-md w-fit bg-neutral-950 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
                        onClick={() => setIsOpen(false)}
                      >
                        <X />
                      </button>
                    </div>

                    {/* User Info */}
                    {user && (
                      <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          {user.profileImage ? (
                            <img 
                              src={user.profileImage} 
                              alt={user.fullName} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {user.fullName?.split(' ').pop()?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.fullName}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded inline-block">
                          {user.role}
                        </span>
                      </div>
                    )}

                    {/* Nav Items */}
                    <div className="flex-1 overflow-y-auto">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "cursor-pointer gap-2 select-none p-3 dark:hover:text-blue-200 hover:text-base-blue rounded-md transition-colors duration-200 flex items-center justify-start mb-1",
                            pathname === item.href &&
                              "dark:text-blue-200 dark:border dark:border-blue-950 text-base-blue dark:bg-neutral-900 bg-neutral-200",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon size={20} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t dark:border-neutral-800 border-neutral-200 space-y-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 p-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          )}

          {/* Desktop Nav */}
          {!isMobile && (
            <nav className="flex gap-4 items-center font-medium">
              <Link href="/" className="flex items-center mr-4">
                <div className="text-zinc-950 dark:text-white flex gap-2 items-center">
                  <img src="/logo.png" alt="Harican Logo" className="w-9 h-10 object-contain" />
                  <span className="font-semibold text-lg">Harican</span>
                </div>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "cursor-pointer gap-1 select-none px-3 py-2 dark:hover:text-blue-200 hover:text-base-blue rounded-md transition-colors duration-200 flex items-center justify-center",
                    pathname === item.href &&
                      "dark:text-blue-200 dark:border dark:border-blue-950 text-base-blue dark:bg-neutral-900 bg-neutral-200",
                  )}
                >
                  <item.icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <nav className="flex items-center gap-2">
            <ThemeSwitch
              className="border w-10 rounded-md h-10 dark:border-neutral-800 border-neutral-200"
            />
            {!isMobile && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 h-10 border dark:border-neutral-800 border-neutral-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.fullName} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user?.fullName?.split(' ').pop()?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-sm">{user?.fullName}</span>
                  </div>
                </Link>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="h-10 gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
