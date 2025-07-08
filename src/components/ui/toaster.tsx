"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      richColors
      position="bottom-right" 
      {...props}
    />
  );
};

export { Toaster };
