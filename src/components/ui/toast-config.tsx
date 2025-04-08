
import { toast as hookToast } from "@/hooks/use-toast";

// Configure auto-dismiss toasts
export const toast = (props: Parameters<typeof hookToast>[0]) => {
  return hookToast({
    ...props,
    duration: 5000, // Auto-dismiss after 5 seconds
  });
};
