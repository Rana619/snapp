import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, BarChart3, TrendingUp } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { AICRMAnimation } from "@/components/ui/ai-crm-animation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { setConfig, updateConfig } from "@/store/slices/configSlice";
import { RootState } from "@/types/store.type";

export default function LoginPage() {
  const dispatch = useDispatch()
  const configData = useSelector((state: RootState) => state.config)

  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    if (configData?.rememberedEmail) {
      setEmail(configData?.rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response: any = await apiClient.post("/auth/login", {
        username: email,
        password
      });

      if (response?.token) {
        dispatch(setUser({
          authToken: response.token,
          user: {
            name: response.name,
            email: response.username,
            roles: response.roles || ['user']
          }
        }))

        if (rememberMe) {
          dispatch(updateConfig({
            "rememberedEmail": email
          }))
        } else {
          dispatch(updateConfig({
            "rememberedEmail": ""
          }))
        }
        toast.success("Logged in successfully");

        if (configData.theme === "dark") {
          document.documentElement.classList.add("dark");
          // document.body.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
          document.body.classList.remove("dark");
        }
        navigate("/");
      } else {
        toast.error(response?.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          <path
            d="M 100 300 Q 400 100 700 300 Q 400 500 100 300"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.5 }} />
              <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 0.5 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500"></div>

      {/* Main Content Container */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          {/* Header Section - Centered */}


          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left Side - AI Animation */}
            <div className="flex items-center justify-center order-2 lg:order-1">
              <div className="w-full max-w-lg transform hover:scale-105 transition-transform duration-500">
                <AICRMAnimation />
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <div className="w-full max-w-md">
                {/* Login Card with Arc Design */}
                <Card className="relative overflow-hidden shadow-2xl shadow-blue-500/10 dark:shadow-none border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
                  {/* Arc decoration */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>

                  <CardHeader className="space-y-2 pb-6 pt-8">
                    <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                      Sign In
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                      Enter your credentials to continue
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6 pb-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="h-12 pr-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <label htmlFor="remember-me" className="flex items-center cursor-pointer select-none">
                            <input
                              id="remember-me"
                              name="remember-me"
                              type="checkbox"
                              checked={rememberMe}
                              onChange={e => setRememberMe(e.target.checked)}
                              className="peer appearance-none h-4 w-4 border border-gray-300 rounded bg-white checked:bg-black checked:border-gray transition-colors duration-200"
                            />
                            <span className="pointer-events-none absolute w-4 h-4 rounded bg-black opacity-0 peer-checked:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                                <path d="M4 8l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Remember me
                            </span>
                          </label>
                        </div>

                        <div className="text-sm">
                          <a href="#" className="font-medium text-black-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                            Forgot password?
                          </a>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="bg-black text-white hover:bg-gray-900 w-full h-12"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>

                    {/* <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-300 text-center font-medium">
                        Demo Credentials
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 text-center mt-1">
                        Email: admin@example.com | Password: password
                      </p>
                    </div> */}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}