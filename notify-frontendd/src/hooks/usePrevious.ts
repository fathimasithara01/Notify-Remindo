'use client';

import { useEffect, useRef } from 'react';
// useRef value change cheythal component re-render cheyyilla.
// usePrevious hook current value-inte previous render value remember cheythu return cheyyunna reusable custom hook aanu.

export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}