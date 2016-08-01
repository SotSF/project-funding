
import React from 'react';


let Aniron = (props) => {
    let defaultStyle = {
        fontSize: 42,
        margin: 0,
        background: '-webkit-linear-gradient(#eb2200, #ede000)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    let style = Object.assign(defaultStyle, props.style, {
        fontFamily: 'Wizard, Roboto'
    });
    
    return <div style={style}>{props.children}</div>;
};


export default Aniron;
