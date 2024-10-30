import { useCallback, useRef } from "react";

export function useThrottle<
  T extends (...args: Parameters<T>) => ReturnType<T>
>(callback: T, delay: number): T {
  const lastCall = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return callback(...args);
      }
    },
    [callback, delay]
  ) as T;
}
