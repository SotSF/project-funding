
import React from 'react';
import {SvgIcon} from 'material-ui';

let SecretFireLogoIcon = (props) => {
    let lowerFlameData = [
        'M', 457.6, 590.1,
        'c', -25, 73, -84.1, 141.9, -99.1, 178.9,
        'c', -8, -31, -130.5, -117.3, -130.5, -117.3,
        's', -84.5, -68.7, -91.5, -179.7,
        's', 29.4, -188.5, 80, -322.3,
        'c', -19, 107.3, 83.5, 222.9, 184, 295.3,
        'C', 483.5, 512.1, 457.6, 590.1, 457.6, 590.1,
        'z'
    ].join(' ');

    let upperFlameData = [
        'M', 284.3, 222.5,
        'c', -24.3, -75.5, 21.2, -200, 21.2, -200,
        'c', 15.2, 132.3, 109, 112.7, 135.8, 209.1,
        'c', 26.7, 96.4, -8.9, 189.1, -8.9, 189.1,
        'C', 401.3, 347.8, 305.9, 316.3, 284.3, 222.5,
        'z'
    ].join(' ');

    let iconAttrs = Object.assign({
        viewBox: '0 0 650 800'
    }, props);

    return (
        <SvgIcon {...iconAttrs}>
            <path d={upperFlameData} />
            <path d={lowerFlameData} />
        </SvgIcon>
    );
};


export default SecretFireLogoIcon;
