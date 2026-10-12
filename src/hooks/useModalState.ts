import { useState } from 'react';

export function useModalState<T>() {
  const [open, setOpen] = useState<T | null>(null);
  const handleOpen = (val: T) => setOpen(val);
  const handleClose = () => setOpen(null);
  return [open, handleOpen, handleClose] as const;
}
