
// Simple toast utility to avoid circular dependencies
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastQueue: ToastOptions[] = [];
let toastListeners: Array<(toasts: ToastOptions[]) => void> = [];

export const simpleToast = (options: ToastOptions) => {
  toastQueue = [options, ...toastQueue].slice(0, 5); // Keep max 5 toasts
  toastListeners.forEach(listener => listener([...toastQueue]));
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t !== options);
    toastListeners.forEach(listener => listener([...toastQueue]));
  }, 3000);
};

export const useSimpleToast = () => {
  const [toasts, setToasts] = React.useState<ToastOptions[]>([]);
  
  React.useEffect(() => {
    const listener = (newToasts: ToastOptions[]) => setToasts(newToasts);
    toastListeners.push(listener);
    
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) toastListeners.splice(index, 1);
    };
  }, []);
  
  return toasts;
};
