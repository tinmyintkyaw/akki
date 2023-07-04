type DebounceFunction = (...args: any[]) => void;

export interface DebounceInstance {
  (): void;
  cancel: () => void;
  isActive: () => boolean;
}

const debounce = (
  callback: DebounceFunction,
  delay: number
): DebounceInstance => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isActive = false;

  const debounced: DebounceInstance = (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      isActive = false;
      callback(...args);
    }, delay);

    isActive = true;
  };

  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    isActive = false;
  };

  debounced.isActive = () => {
    return isActive;
  };

  return debounced;
};

export default debounce;
