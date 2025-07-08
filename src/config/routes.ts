export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  requiresAuth: boolean;
  roles?: string[];
  title?: string;
}

export const routes: RouteConfig[] = [
  {
    path: "/login",
    component: () => import("@/pages/login").then(m => m.default),
    requiresAuth: false,
    title: "Login"
  },
  {
    path: "page/dashboard",
    component: () => import("@/pages/dashboard").then(m => m.default),
    requiresAuth: true,
    roles: ["user", "admin"],
    title: "Dashboard"
  },
  {
    path: "page/accounts",
    component: () => import("@/pages/listing").then(m => m.default),
    requiresAuth: true,
    roles: ["user", "admin"],
    title: "Accounts"
  },
  {
    path: "page/leads",
    component: () => import("@/pages/listing").then(m => m.default),
    requiresAuth: true,
    roles: ["user", "admin"],
    title: "Leads"
  },
  {
    path: "page/reports",
    component: () => import("@/pages/listing").then(m => m.default),
    requiresAuth: true,
    roles: ["admin"],
    title: "Reports"
  },
  {
    path: "page/settings",
    component: () => import("@/pages/listing").then(m => m.default),
    requiresAuth: true,
    roles: ["admin"],
    title: "Settings"
  }
];