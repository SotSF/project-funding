
import _ from 'underscore';
import React from 'react';
import ProjectGrid from './ProjectGrid.jsx'


const styles = {
    appContainer: {
        width: 1000,
        margin: 'auto'
    },
    appHeader: {
        fontSize: 60,
        textAlign: 'center',
        margin: '10px 0',
        fontFamily: 'Wizard, Roboto',
        background: '-webkit-linear-gradient(#eb2200, #ede000)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent'
    }
};


let shuffledProjects = _.once(() => _.shuffle(window.projects));
let App = () => (
    <div style={styles.appContainer}>
        <h1 id="app-header" style={styles.appHeader}>Eksperimental Magiks</h1>
        <ProjectGrid projects={shuffledProjects()} />
    </div>
);

export default App;
