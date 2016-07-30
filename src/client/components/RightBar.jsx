
import React from 'react';
import GitHubLink from './GitHubLink.jsx';
import Explanation from './Explanation.jsx';


class RightBar extends React.Component {
    render () {
        let style = {
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 10,
            maxWidth: 75
        };

        return (
            <div style={style}>
                <GitHubLink />
                <Explanation />
            </div>
        );
    }
}


export default RightBar;
