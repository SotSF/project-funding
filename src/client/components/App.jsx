
import _ from 'underscore';
import React from 'react';
import transitions from 'material-ui/styles/transitions';
import ProjectGrid from './ProjectGrid.jsx';


const styles = {
    appContainer: {
        width: 1000,
        margin: 'auto'
    },
    appHeader: {
        fontSize: 60,
        textAlign: 'center',
        margin: '10px 0 0',
        fontFamily: 'Wizard, Roboto',
        background: '-webkit-linear-gradient(#eb2200, #ede000)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    explanation: {
        fontSize: '12px',
        textAlign: 'center',
        marginBottom: 5,
        overflow: 'hidden',
        cursor: 'default'
    }
};


let shuffledProjects = _.once(() => _.shuffle(window.projects));
let App = () => (
    <div style={styles.appContainer}>
        <h1 style={styles.appHeader}>Eksperimental Magiks</h1>
        <Explanation />
        <ProjectGrid projects={shuffledProjects()} />
    </div>
);

class Explanation extends React.Component {
    constructor () {
        super();
        this.state = {
            hover: false
        };
    }

    render () {
        let explanationStyle = {
            maxHeight: this.state.hover ? 200 : 0,
            transition: transitions.easeOut('750ms'),
            overflow: 'hidden',
            textAlign: 'justify',
            lineHeight: '150%'
        };

        return (
            <div
                style={styles.explanation}
                onMouseLeave={() => this.setState({ hover: false })}
            >
                <strong
                    onMouseOver={() => this.setState({ hover: true })}
                    onClick={() => this.setState({ hover: true })}
                >What is this?</strong>
                <div style={explanationStyle}>
                    <p>
                        The Servants of the Secret Fire are an active bunch of wizards! This is a
                        collection of the projects currently being undertaken by camp members to
                        bring to the Playa in 2016. Check out the projects below to get a sense of
                        what camp will be like at 9:15 and B!
                    </p>

                    <p>
                        Of course, creating is not always an easy or cheap enterprise. As prolific
                        as the Servants aspire to be, the spectre of funding always manages to
                        intrude. That's why, as a part of camp membership, SotSF requires its
                        wizards to monetarily contribute to the development of each other's ideas.
                        We recognize the necessity of diversity, and wish to strongly encourage
                        our fellow campmates to follow the whimsical paths of their imagination,
                        towards whatever end inspires them. Funding from outside the camp is happily
                        accepted, but never expected.
                    </p>
                </div>
            </div>
        )
    }
}

export default App;
