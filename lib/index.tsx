import React from 'react';

import s from './index.module.css';

const transform = (offset, scale) => 
    `scale(${scale.toFixed(10)}) translate(${offset.x}px, ${offset.y}px)`;

const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const div = (a, b) => ({ x: a.x / b, y: a.y / b });

const useFresh = (v) => {
    const ref = React.useRef(v);

    ref.current = v;

    return ref;
};

const debounce = (predicate, time) => {
    let timeout = null;
    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            predicate(...args)
        }, time);
    };
}

export default ({ canMove, canScale, children }) => {
    const [scale, setScale] = React.useState(1);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });

    const wrapRef = React.useRef(null);
    const containerRef = React.useRef(null);

    /* Move effect */

    React.useEffect(() => {
        const wrap = wrapRef.current;
        const container = containerRef.current;

        if (!wrap || !container) {
            return;
        }

        const mousedown = ({ clientX: startx, clientY: starty }) => {
            const mousemove = ({ clientX: x, clientY: y }) => {
                const diff = sub({ x, y }, { x: startx, y: starty });
                const scaleddiff = div(diff, scale);

                container.style.transform = transform(add(offset, scaleddiff), scale);
            };

            const mouseup = ({ clientX: x, clientY: y }) => {
                const diff = sub({ x, y }, { x: startx, y: starty });
                const scaleddiff = div(diff, scale);

                setOffset(add(offset, scaleddiff));

                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            };

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);
        };
        
        if (canMove) {
            wrap.addEventListener('mousedown', mousedown);
        }

        return () => {
            wrap.removeEventListener('mousedown', mousedown);
        };
    }, [canMove, offset, scale]);

    /* Scale effect */

    const wtf = useFresh({ offset, scale });

    const updateDebounced = React.useMemo(() => {
        return debounce(() => {
            setOffset(wtf.current.offset);
            setScale(wtf.current.scale);
        }, 1);
    }, []);

    React.useEffect(() => {
        const wrap = wrapRef.current;
        const container = containerRef.current;

        if (!wrap || !container) {
            return;
        }

        const handler = (e) => {
            e.preventDefault();

            const { offset, scale } = wtf.current;

            const rawchange = -e.deltaY / 100;
            const oldscale = scale;

            const newscale = Math.min(2, Math.max(.2, oldscale + rawchange));
            const change = newscale - oldscale;
            
            const x = offset.x - change * (e.clientX / (newscale * oldscale));
            const y = offset.y - change * (e.clientY / (newscale * oldscale));

            container.style.transform = transform({ x, y }, newscale);
            wtf.current = { offset: { x, y }, scale: newscale };

            updateDebounced();
        };

        wrap.addEventListener('mousewheel', handler);

        return () => {
            wrap.removeEventListener('mousewheel', handler);
        };
    }, [canScale]);

    return (
        <div className={s.wrap} ref={wrapRef}>
            <div className={s.container} ref={containerRef} style={{ transform: transform(offset, scale) }}>
                {children}
            </div>
        </div>
    );
};
