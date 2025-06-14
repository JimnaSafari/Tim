
// Simple toast utility to avoid circular dependencies
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const simpleToast = (options: ToastOptions) => {
  // Create a simple toast notification using DOM manipulation
  const toastEl = document.createElement('div');
  toastEl.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm transition-all duration-300 ${
    options.variant === 'destructive' 
      ? 'bg-red-600 text-white border border-red-700' 
      : 'bg-green-600 text-white border border-green-700'
  }`;
  
  toastEl.innerHTML = `
    <div class="font-medium">${options.title || ''}</div>
    ${options.description ? `<div class="text-sm opacity-90 mt-1">${options.description}</div>` : ''}
  `;
  
  document.body.appendChild(toastEl);
  
  // Animate in
  setTimeout(() => {
    toastEl.style.transform = 'translateX(0)';
    toastEl.style.opacity = '1';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (document.body.contains(toastEl)) {
      toastEl.style.transform = 'translateX(100%)';
      toastEl.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toastEl)) {
          document.body.removeChild(toastEl);
        }
      }, 300);
    }
  }, 3000);
};
