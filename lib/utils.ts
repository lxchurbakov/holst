export type Point = { x: number, y: number };

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
