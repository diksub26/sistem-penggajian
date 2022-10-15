const TOAST_TOP = 'top'
const TOAST_BOTTOM = 'bottom'

type ToastPosition = typeof TOAST_TOP | typeof TOAST_BOTTOM

type ToastMessagePayload = {
  content: string;
  color?: string;
  timeout?: number;
  position?: ToastPosition;
}

interface ToastMessage extends ToastMessagePayload {
  id: string;
}

export {
  ToastMessagePayload, ToastMessage, ToastPosition, TOAST_BOTTOM, TOAST_TOP
}