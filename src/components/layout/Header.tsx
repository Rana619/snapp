const images = import.meta.glob('./*.png', { eager: true, import: 'default' });
import {
  Bell,
  ChevronDown,
  User,
  Sun,
  Moon,
  LogOut,
  Settings,
  Bot,
  Send,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import type { LayoutConfig } from "@/types";
import DynamicNavOptions from "./DynamicNavOptions";
import { ChatWidget } from "../widgets/ChatWidget";
import { useSelector, useDispatch } from "react-redux";
import { resetConfig } from "@/store/slices/configSlice";
import { resetUser } from "@/store/slices/userSlice";
import { RootState } from "@/types/store.type";

interface HeaderProps {
  header: LayoutConfig["header"];
}

export function Header({ header }: HeaderProps) {
  const dispatch = useDispatch()
  const configData = useSelector((state: RootState) => state.config)
  const { toggleTheme } = useTheme();
  const user = useSelector((state: RootState) => state.user)
  const [, navigate] = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const imageSrc: any = header?.logoUrl ? images[`./${header.logoUrl.replace(/^\//, '')}`] : undefined;
    if (header?.logoUrl) {
      const link: any = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = imageSrc;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = imageSrc;
        document.head.appendChild(newLink);
      }
    }
    if (header?.logoText) {
      document.title = header.logoText
    }
  }, [header])

  const handleLogout = () => {
    // dispatch(resetConfig({}))
    dispatch(resetUser({}))
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getIcon = (iconName?: string): React.ReactNode => {
    const iconProps = { className: "w-4 h-4" };
    switch (iconName) {
      case 'user':
        return <User {...iconProps} />;
      case 'logout':
        return <LogOut {...iconProps} />
      default:
        return null;
    }
  };

  const imageSrc: any = header?.logoUrl ? images[`./${header.logoUrl.replace(/^\//, '')}`] : undefined;

  return (
    <header className="bg-white dark:bg-[#081028] shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-4 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* ─── Mobile Hamburger (only on < lg) ─── */}
          <div className="block lg:hidden">
            <Sheet
              open={isMobileNavOpen}
              onOpenChange={setIsMobileNavOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileNavOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-white dark:bg-[#081028] p-4"
              >
                <SheetHeader>
                  <SheetTitle>Snapp Menu</SheetTitle>
                </SheetHeader>
                {/* Reuse your DynamicNavOptions in “vertical” mode */}
                <nav className="mt-4 flex flex-col space-y-3">
                  {header.nav.map((item) => (
                    <Link
                      key={item.label}
                      to={item.route}
                      className="text-gray-800 dark:text-gray-200 hover:text-primary"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* ─── Logo ─── */}
          <div className="flex-shrink-0">
            <Link to="/page/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src={imageSrc} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {header.logoText}
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex space-x-6">
            <DynamicNavOptions navigationItems={header.nav} />
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              {configData?.theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {/* AI Chat */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(!isChatOpen)}
              title="AI Assistant"
            >
              <Bot className="w-6 h-6" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.name ?? ""}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-2">
                  <p className="font-medium">{user?.name || "John Doe"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                {header.userMenu.map((userItem, inx) => {
                  return (<DropdownMenuItem
                    key={inx}
                    className={`${userItem.label == "Logout" ? "text-red-600" : ""}`}
                    onClick={() => userItem.label == "Logout" ? handleLogout() : navigate(userItem.route)}>
                    {getIcon(userItem.icon ?? "logout")}
                    {userItem.label}
                  </DropdownMenuItem>)
                })}
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ─── Chat Widget Sheet ─── */}
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent side="right" className="w-80 sm:w-96 p-0">
          <SheetHeader className="p-6 pb-3 border-b">
            <SheetTitle>Chap AI Assistant</SheetTitle>
          </SheetHeader>
          <ChatWidget
            data={{ welcomeMessage: "Hi! I'm Chap, your AI assistant." }}
            fullHeight
          />
        </SheetContent>
      </Sheet>
    </header>
  );
}
