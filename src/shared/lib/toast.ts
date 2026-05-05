import { toast as sonnerToast } from "sonner";

const DEFAULT_SUCCESS = "Action completed successfully";
const DEFAULT_ERROR = "Something went wrong";

export const toast = {
  success(message = DEFAULT_SUCCESS) {
    return sonnerToast.success(message);
  },
  error(message = DEFAULT_ERROR) {
    return sonnerToast.error(message);
  },
  info(message: string) {
    return sonnerToast.info(message);
  },
  warning(message: string) {
    return sonnerToast.warning(message);
  },
  loading(message: string) {
    return sonnerToast.loading(message);
  },
  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },
  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) {
    return sonnerToast.promise(promise, messages);
  },
};
