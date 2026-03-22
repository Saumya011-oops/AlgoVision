import { useToastStore } from '../store/toastStore';

export const validateNumericInput = (input: string, min: number = 0, max: number = 1000, maxLength: number = 50): number[] | null => {
  const parts = input.split(',').map(s => s.trim()).filter(s => s !== '');
  
  if (parts.length === 0) {
    useToastStore.getState().addToast('error', 'Input cannot be empty.');
    return null;
  }
  
  if (parts.length > maxLength) {
    useToastStore.getState().addToast('error', `Maximum ${maxLength} elements allowed.`);
    return null;
  }

  const numbers: number[] = [];
  for (const p of parts) {
    const num = Number(p);
    if (isNaN(num)) {
      useToastStore.getState().addToast('error', `Invalid number detected: "${p}"`);
      return null;
    }
    if (num < min || num > max) {
      useToastStore.getState().addToast('error', `Numbers must be between ${min} and ${max}.`);
      return null;
    }
    numbers.push(num);
  }

  return numbers;
};
