
import _ from 'underscore';
import React from 'react';
import ProjectGrid from './ProjectGrid.jsx';
import Aniron from './Aniron.jsx';



let shuffledProjects = _.once(() => _.shuffle(window.projects));
let App = () => {
    const headerStyle = {
        fontSize: 60,
        textAlign: 'center',
        margin: '10px 0 0'
    };

    return (
        <div>
            <Aniron style={headerStyle}>Eksperimental Magiks</Aniron>
            <ProjectGrid projects={shuffledProjects()} />
        </div>
    );
};


export default App;
