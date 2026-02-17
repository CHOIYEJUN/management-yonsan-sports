import React from "react";
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

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-semibold text-primary">용산구시설관리공단</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="강사 검색..."
              className="w-64 pl-9"
            />
          </div>

          {!loading && (
            user ? (
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
            )
          )}
        </div>
      </div>
    </nav>
  );
}
