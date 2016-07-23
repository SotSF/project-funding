
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
        fontFamily: 'Wizard, Roboto'
    }
};


let shuffledProjects = _.once(() => _.shuffle(window.projects));
let App = () => (
    <div style={styles.appContainer}>
        <h1 style={styles.appHeader}>Servant Projects</h1>
        <ProjectGrid projects={shuffledProjects()} />
    </div>
);

export default App;
