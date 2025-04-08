
import { toast as sonnerToast } from "@/components/ui/toast";

// Configure auto-dismiss toasts
export const toast = (props: Parameters<typeof sonnerToast>[0]) => {
  return sonnerToast({
    ...props,
    duration: 5000, // Auto-dismiss after 5 seconds
  });
};
