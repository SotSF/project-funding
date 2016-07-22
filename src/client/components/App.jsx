
import _ from 'underscore';
import React from 'react';
import ProjectGrid from './ProjectGrid.jsx'


const styles = {
    appContainer: {
        width: 1000,
        margin: 'auto'
    }
};

let shuffledProjects = _.once(() => _.shuffle(window.projects));
let App = () => (
    <div style={styles.appContainer}>
        <ProjectGrid projects={shuffledProjects()} />
    </div>
);

export default App;
