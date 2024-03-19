import React from 'react';

import { add, div, sub, Point, debounce } from './utils';

const transform = (offset, scale) => 
    `scale(${scale.toFixed(10)}) translate(${offset.x}px, ${offset.y}px)`;

export default ({ canMove, canScale, children }) => {
    const [scale, setScale] = React.useState(1);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 } as Point);

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

    React.useEffect(() => {
        const wrap = wrapRef.current;
        const container = containerRef.current;

        if (!wrap || !container) {
            return;
        }

        let currentoffset = offset;
        let currentscale = scale;

        const updateDebounced = debounce(() => {
            setOffset(currentoffset);
            setScale(currentscale);
        }, 50);
        
        const handler = (e) => {
            e.preventDefault();

            const rawchange = -e.deltaY / 100;
            const oldscale = currentscale;

            currentscale = Math.min(2, Math.max(.2, oldscale + rawchange));
            const change = currentscale - oldscale;
            
            currentoffset.x = currentoffset.x - change * (e.clientX / (currentscale * oldscale));
            currentoffset.y = currentoffset.y - change * (e.clientY / (currentscale * oldscale));

            container.style.transform = transform(currentoffset, currentscale);

            updateDebounced();
        };

        if (canScale) {
            wrap.addEventListener('mousewheel', handler);
        }

        return () => {
            wrap.removeEventListener('mousewheel', handler);
        };
    }, [canScale, offset, scale]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }} ref={wrapRef}>
            <div  ref={containerRef} style={{ transformOrigin: '0 0', position: 'absolute', transform: transform(offset, scale) }}>
                {children}
            </div>
        </div>
    );
};
