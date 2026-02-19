import React, { useState } from "react";
import { Search, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "../../lib/auth-context";

interface NavbarProps {
  onAdminClick: () => void;
  onLoginClick: () => void;
}

export function Navbar({ onAdminClick, onLoginClick }: NavbarProps) {
  const { user, loading, signOut } = useAuth();
  const [searchInput, setSearchInput] = useState("");

  const goToSearch = () => {
    const q = searchInput.trim();
    if (typeof window !== "undefined") {
      window.location.hash = `#search?q=${encodeURIComponent(q)}`;
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 sm:py-0 sm:h-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-base sm:text-xl font-semibold text-primary shrink-0 break-keep">
          용산구시설관리공단 지도자 현황
        </h1>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 min-w-0 flex-1 sm:justify-end">
          <form
            className="relative flex items-center w-full sm:max-w-[14rem] md:max-w-[20rem]"
            onSubmit={(e) => {
              e.preventDefault();
              goToSearch();
            }}
          >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              type="search"
              placeholder="이름 / 종목 / 직책 / 성별 / 근무센터 검색"
              className="w-full min-w-0 pl-9 pr-20 border-primary/60 focus-visible:ring-primary shadow-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button type="submit" size="sm" className="absolute right-1">
              검색
            </Button>
          </form>

          {!loading && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {user ? (
                <>
                  <Button variant="outline" size="sm" onClick={onAdminClick}>
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">관리자 대시보드</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">로그아웃</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={onLoginClick}>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">관리자 로그인</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
