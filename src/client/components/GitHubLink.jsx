
import React from 'react';
import transitions from 'material-ui/styles/transitions';

class GitHubLogo extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            hover: false
        };
    }

    render () {
        let styles = {
            link: {
                opacity: this.state.hover ? 0.54 : 0.38,
                transition: transitions.easeOut(),
                float: 'right'
            },
            img: {
                width: 30,
                height: 30
            }
        };

        return (
            <a
                style={styles.link}
                href="https://github.com/SotSF/project-funding"
                target="_blank"
                onMouseOver={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
            >
                <img style={styles.img} src="static/img/github-logo.png" />
            </a>
        );
    }
}

export default GitHubLogo;