
import _ from 'underscore';
import React from 'react';
import ProjectGrid from './ProjectGrid.jsx';



let shuffledProjects = _.once(() => _.shuffle(window.projects));
let App = () => {
    const headerStyle = {
        fontSize: 60,
        textAlign: 'center',
        margin: '10px 0 0',
        fontFamily: 'Wizard, Roboto',
        background: '-webkit-linear-gradient(#eb2200, #ede000)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    return (
        <div>
            <h1 style={headerStyle}>Eksperimental Magiks</h1>
            <ProjectGrid projects={shuffledProjects()} />
        </div>
    );
};


export default App;
