  "use client"

  import { toast } from "sonner"

  // Re-export toast from sonner for compatibility
  export { toast }

  // For backward compatibility, also export as useToast
  export const useToast = () => {
    return {
      toast,
      dismiss: toast.dismiss,
    }
  }