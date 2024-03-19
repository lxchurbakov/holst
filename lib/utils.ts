import React from 'react';

export type Point = { x: number, y: number };
export type ValueTuple<T> = [value: T, onChange: ($: T) => void ];

export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
export const div = (a, b) => ({ x: a.x / b, y: a.y / b });

export const debounce = (predicate, time) => {
    let timeout = null;
    
    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            predicate(...args)
        }, time);
    };
};

export const useObjectField = <T, O extends Record<string, any>>([value, onChange]: ValueTuple<O>, name: string, def: T) => {
    return [
        React.useMemo(() => (value[name] as T) || def, [value, name]),
        React.useCallback(($: T) => onChange({ ...value, [name]: $ }), [value, onChange, name]),
    ] as const;
};

export const merge = (a, b) => {
    let c = {};

    Object.keys(a).concat(Object.keys(b)).forEach((key) => {
        if (typeof a[key] === 'object') {
            if (typeof b[key] !== 'object') {
                throw new Error(`attempt to merge object with non-object at key ${key}`);
            }

            c[key] = merge(a[key], b[key]);
        } else {
            c[key] = a[key] || b[key];
        }
    });

    return c;
};
