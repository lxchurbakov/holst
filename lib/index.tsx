import React from 'react';

import s from './index.module.css';

export default ({ children }) => {
    const wrapRef = React.useRef(null);
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const wrap = wrapRef.current;
        const container = containerRef.current;

        if (!wrap || !container) {
            return;
        }

        const mousedown = ({ clientX: startx, clientY: starty }) => {
            const mousemove = ({ clientX: x, clientY: y }) => {
                const diffx = x - startx;
                const diffy = y - starty;

                container.style.transform = `translate(${diffx}px, ${diffy}px)`;    
            };

            const mouseup = ({ clientX: x, clientY: y }) => {
                const diffx = x - startx;
                const diffy = y - starty;

                container.style.transform = `none`;
                container.style.left = (parseInt(container.style.left) || 0) + diffx;
                container.style.top = (parseInt(container.style.top) || 0) + diffy;

                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            };

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);
        };

        wrap.addEventListener('mousedown', mousedown);

        return () => {
            wrap.removeEventListenter('mousedown', mousedown);
        };
    }, []);

    return (
        <div className={s.wrap} ref={wrapRef}>
            <div className={s.container} ref={containerRef}>
                {children}
            </div>
        </div>
    );
};
