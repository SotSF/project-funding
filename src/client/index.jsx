
import _ from 'underscore';
import xhr from 'tiny-xhr';
import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { App, DonorsPage, Project, RightBar} from './components';

injectTapEventPlugin();

xhr({
    url: 'data/projectData.json',
    method: 'GET',
    type: 'json',
    data: 'data',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then((projectList) => {
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
                            <Route path="/donors" component={DonorsPage} />
                            <Route path="/project/:projectName" component={Project}/>
                        </Router>
                    </div>
                </div>
            </MuiThemeProvider>,
            document.getElementById('app-container')
        );
    });
