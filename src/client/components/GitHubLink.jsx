
import React from 'react';

let GitHubLogo = () => {
    let styles = {
        link: {
            position: 'absolute',
            top: 10,
            right: 10
        },
        img: {
            width: 30,
            height: 30
        }
    };

    return (
        <a style={styles.link} href="https://github.com/SotSF/project-funding" target="_blank">
            <img style={styles.img} src="/static/img/github-logo.png" />
        </a>
    );
};

export default GitHubLogo;