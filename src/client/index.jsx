
import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import RightBar from './components/RightBar.jsx';
import App from './components/App.jsx'
import Project from './components/Project.jsx';

injectTapEventPlugin();

$(function () {
    // Query for the latest project data
    $.get('data/projectData.json').done(function (projectList) {
        // Shuffle the JSON
        window.projects = _.object(
            _.pluck(projectList, 'Project'),
            _.omit(projectList, 'Project')
        );

        let appContainerStyle = {
            width: 1000,
            margin: 'auto'
        };

        ReactDom.render(
            <MuiThemeProvider>
                <div>
                    <RightBar />
                    <div id="content-container" style={appContainerStyle}>
                        <Router history={hashHistory}>
                            <Route path="/" component={App}/>
                            <Route path="/:projectName" component={Project}/>
                        </Router>
                    </div>
                </div>
            </MuiThemeProvider>,
            document.getElementById('app-container')
        );
    });
});
