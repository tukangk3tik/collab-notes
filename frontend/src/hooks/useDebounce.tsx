import { useCallback, useRef } from "react";

type AnyFunction = (...args: any[]) => void;

export function useDebounce<T extends AnyFunction>(callback: T, delay: number): T {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    return useCallback(
        ((...args: Parameters<T>) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }

            timer.current = setTimeout(() => {
                callback(...args);
            }, delay);
        }) as T,
        [callback, delay]
    );
}