import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-bold">Ashy</h1>

        <div className="flex items-center gap-4">
          {/* Nav Links */}
          <nav className="hidden sm:flex items-center gap-4">
            <a
              href="/quiz"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Quiz
            </a>
            <a
              href="/learn"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn
            </a>
          </nav>

          {/* Theme toggle */}
          <ThemeToggle theme={theme || "light"} setTheme={setTheme} />

          {/* User Dropdown */}
          {session?.user && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="h-8 w-8 rounded-full border border-border"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md bg-popover text-popover-foreground shadow-lg border border-border z-50">
                  <div className="px-4 py-3 border-b border-border text-sm font-medium">
                    {session.user.name}
                  </div>
                  <ul className="py-1">
                    <li>
                      <a
                        href="/"
                        className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
