import toast from "react-hot-toast";

interface ToastProps {
  message: string;
}

export const showSuccess = ({ message }: ToastProps) => toast.success(message);
export const showError = ({ message }: ToastProps) => toast.error(message);
export const showInfo = ({ message }: ToastProps) => toast(message);
export const showLoading = ({ message }: ToastProps) => toast.loading(message);
