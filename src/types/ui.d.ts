import type { ReactNode, FormEvent } from 'react';

export type FormErrors = Record<string, string>;

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export interface FormPropsBase {
  formErrors: FormErrors;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  error?: string;
}
