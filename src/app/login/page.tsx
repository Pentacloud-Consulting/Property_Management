"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HomeOwner365Logo } from "@/components/shared/homeowner365-logo";
import { useAuth } from "@/hooks/use-auth";
import { AUTH_CREDENTIALS } from "@/lib/auth-constants";
import { Lock, User, ArrowRight, Loader2, Sparkles, Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
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
      router.push("/dashboard");
      router.refresh();
    } else {
      setErrorMsg("Invalid credentials. Please use Pentacloud / Pentacloud@2026");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F9] flex flex-col justify-between p-4 md:p-8">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <HomeOwner365Logo href="/" size="md" />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#64748B] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white rounded-3xl border border-[#E8ECF3] shadow-[0_25px_50px_-12px_rgba(16,27,58,0.1)] overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#625BFF] via-[#5145E5] to-[#3B30DE] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold text-white border border-white/20 backdrop-blur-md mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> HomeOwner365 Enterprise
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">Sign In to Dashboard</h1>
              <p className="text-[13px] text-indigo-100 font-medium mt-1.5 leading-relaxed">
                Centralized property portfolio, rent collection, lease lifecycles, and maintenance tickets.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Demo Helper */}
            <div className="mb-6 p-4 rounded-2xl bg-[#EEF0FF] border border-[#625BFF]/20 flex items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-[#625BFF] text-[12px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Demo Login Credentials
                </span>
                <p className="text-[12px] text-[#101B3A] mt-1 font-semibold">
                  Username: <span className="font-extrabold text-[#625BFF]">Pentacloud</span>
                  <br />
                  Password: <span className="font-extrabold text-[#625BFF]">Pentacloud@2026</span>
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillDemo}
                className="h-9 px-3.5 text-[12px] font-extrabold text-[#625BFF] hover:bg-[#625BFF] hover:text-white border-[#625BFF]/30 rounded-xl transition-all shrink-0"
              >
                Auto Fill
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
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

              <div className="space-y-2">
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[12px] font-semibold">
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
          </div>
        </div>

        {/* Feature bullet summary */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white border border-[#E8ECF3] flex items-center gap-2 text-[12px] font-bold text-[#101B3A]">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" /> Real-time Portfolio
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E8ECF3] flex items-center gap-2 text-[12px] font-bold text-[#101B3A]">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" /> Full Tenant Lifecycle
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[12px] text-[#64748B] py-2">
        © 2026 HomeOwner365. Every Property. Every Tenant. Every Day.
      </div>
    </div>
  );
}
