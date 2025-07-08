import { resetUser } from "@/store/slices/userSlice";
import store from "@/store/store";
const API_BASE_URL = "https://snapp-blue-river.fly.dev";

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle empty responses for DELETE
    const text = await response.text();
    return text ? JSON.parse(text) : {} as T;
  },

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : {} as T;
  },
};

function handleUnauthorized() {
  // Clear auth data
  store.dispatch(resetUser({}))
  // Redirect to login
  window.history.pushState({}, "", "/login");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getHeaders() {
  const state = store.getState();
  const authToken = state.user.authToken

  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(authToken && { "Authorization": `Bearer ${authToken}` }),
  };
}