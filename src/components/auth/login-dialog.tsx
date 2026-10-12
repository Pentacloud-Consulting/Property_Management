"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HomeOwner365Logo } from "@/components/shared/homeowner365-logo";
import { useAuth } from "@/hooks/use-auth";
import { AUTH_CREDENTIALS } from "@/lib/auth-constants";
import { Lock, User, ArrowRight, Loader2, Sparkles, Eye, EyeOff, ShieldCheck } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
}

export function LoginDialog({
  open,
  onOpenChange,
  redirectTo = "/dashboard",
}: LoginDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleFillDemo = () => {
    setUsername(AUTH_CREDENTIALS.username);
    setPassword(AUTH_CREDENTIALS.password);
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    const success = await login(username.trim(), password);
    setIsLoading(false);

    if (success) {
      onOpenChange(false);
      router.push(redirectTo);
      router.refresh();
    } else {
      setErrorMsg(
        "Invalid credentials. Please use username: Pentacloud and password: Pentacloud@2026"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-[#E8ECF3] rounded-3xl shadow-[0_25px_50px_-12px_rgba(16,27,58,0.25)] bg-white">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-br from-[#625BFF] via-[#5145E5] to-[#3B30DE] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <HomeOwner365Logo size="sm" variant="light" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-bold text-white border border-white/20 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Portal
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <h2 className="text-xl font-black tracking-tight text-white">Sign In to HomeOwner365</h2>
            <p className="text-[13px] text-indigo-100 font-medium mt-1">
              Access your centralized portfolio workspace and analytics.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Demo helper pill */}
          <div className="mb-5 p-3 rounded-2xl bg-[#EEF0FF] border border-[#625BFF]/20 flex items-center justify-between gap-2">
            <div className="text-[12px] text-[#101B3A]">
              <span className="font-extrabold text-[#625BFF] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Demo Access
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                <strong className="text-slate-800">Pentacloud</strong> / <strong className="text-slate-800">Pentacloud@2026</strong>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillDemo}
              className="h-8 px-3 text-[11px] font-bold text-[#625BFF] hover:bg-[#625BFF] hover:text-white border-[#625BFF]/30 rounded-xl transition-all"
            >
              Auto Fill
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-extrabold text-[#111827]">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  type="text"
                  placeholder="Enter username (Pentacloud)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 pl-10 rounded-xl border-[#E8ECF3] bg-[#F3F5F9] text-[13px] font-medium text-[#111827] focus:bg-white focus:border-[#625BFF] focus:ring-4 focus:ring-[#625BFF]/10 transition-all placeholder:text-[#64748B]/60"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] font-extrabold text-[#111827]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password (Pentacloud@2026)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10 rounded-xl border-[#E8ECF3] bg-[#F3F5F9] text-[13px] font-medium text-[#111827] focus:bg-white focus:border-[#625BFF] focus:ring-4 focus:ring-[#625BFF]/10 transition-all placeholder:text-[#64748B]/60"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[12px] font-semibold">
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-[#625BFF] to-[#5145E5] hover:from-[#5145E5] hover:to-[#4338CA] text-white text-[13px] font-bold rounded-xl shadow-[0_10px_20px_rgba(98,91,255,0.25)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-[11px] text-[#64748B]">
              Protected with 256-bit enterprise encryption. By signing in, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
