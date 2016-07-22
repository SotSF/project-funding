
import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './components/App.jsx'
import Project from './components/Project.jsx';

injectTapEventPlugin();

$(function () {
    // Query for the latest project data
    $.get('/projectData.json').done(function (projectList) {
        // Shuffle the JSON
        window.projects = _.object(
            _.pluck(projectList, 'Project'),
            _.omit(projectList, 'Project')
        );

        ReactDom.render(
            <MuiThemeProvider>
                <Router history={hashHistory}>
                    <Route path="/" component={App}/>
                    <Route path="/:projectName" component={Project}/>
                </Router>
            </MuiThemeProvider>,
            document.getElementById('app-container')
        );
    });
});
