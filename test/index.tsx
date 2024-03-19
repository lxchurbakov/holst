import React from 'react';

import { createRoot } from 'react-dom';

import Holst from '../lib';
import s from './index.module.css';

const app = document.getElementById('app');

const root = createRoot(app);

root.render(
    <Holst canMove canScale={true}>
        <div className={s.block}>
            <div className={s.text}>Some Text comes here</div>
        </div>
    </Holst>
);

