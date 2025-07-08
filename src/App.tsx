import { QueryClientProvider } from "@tanstack/react-query";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useState } from "react";
import { Provider } from "react-redux"
import store, { persistor } from "./store/store";
import { PersistGate } from 'redux-persist/integration/react';
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppRouter } from "@/components/routing/AppRouter";

function App() {
  const [themeData, setThemeData] = useState<{
    dark: string;
    light: string;
  }>({
    dark: "",
    light: ""
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider themeColors={themeData}>
          <TooltipProvider>
            <DndProvider backend={HTML5Backend}>
              <PersistGate loading={null} persistor={persistor}>
                <AppLayout>
                  <AppRouter />
                </AppLayout>
              </PersistGate>
              <Toaster />
            </DndProvider>
          </TooltipProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider >
  );
}

export default App;