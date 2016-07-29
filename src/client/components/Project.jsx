
import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import marked from 'marked';
import LinearProgress from 'material-ui/LinearProgress';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Util from '../util';


const styles = {
    backButtonWrapper: {
        position: 'absolute',
        width: 1000,
        left: '50%',
        top: 10,
        marginLeft: '-500px'
    },
    backButton: {
        cursor: 'pointer',
        width: 50,
        height: 50
    },
    projectWrapper: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        margin: '-150px 0 0 -500px'
    },
    projectImgWrapper: {
        width: 300,
        height: 300,
        float: 'left',
        overflow: 'hidden'
    },
    projectImg: {
        height: '100%',
        transform: 'translateX(-50%)',
        position: 'relative',
        left: '50%'
    },
    projectHeader: {
        width: 700,
        height: 300,
        paddingLeft: 20,
        boxSizing: 'border-box',
        display: 'inline-block'
    },
    projectName: {
        fontSize: 56,
        margin: 0
    },
    projectDescription: {
        lineHeight: '180%',
        color: '#666',
        maxHeight: 200,
        overflowY: 'scroll'
    },

    progress: {
        goal: {
            marginRight: 20,
            color: 'rgb(135, 147, 252)'
        },
        raised: {
            marginRight: 20,
            color: 'rgb(135, 147, 252)'
        },
        percentFunded: {
            marginBottom: 10
        }
    },
    recipientHeader: {
        marginBottom: 5
    },
    via: {
        color: '#666',
        fontSize: '14px'
    }
};

class Project extends React.Component {
    constructor () {
        super(...arguments);
        this.project = window.projects[this.props.params.projectName];
    }

    componentDidMount () {
        this.ensureImageCover();
        $('html,body').scrollTop(0);
    }

    ensureImageCover() {
        let imgEl = this.img;

        if (imgEl) {
            const fit = () => {
                if (imgEl.offsetWidth < imgEl.parentNode.offsetWidth) {
                    imgEl.style.height = 'auto';
                    imgEl.style.left = '0';
                    imgEl.style.width = '100%';
                    imgEl.style.top = '50%';
                    imgEl.style.transform = imgEl.style.WebkitTransform = 'translateY(-50%)';
                } else {
                    imgEl.style.height = '100%';
                    imgEl.style.transform = 'translateX(-50%)';
                    imgEl.style.position = 'relative';
                    imgEl.style.left = '50%';
                }
                imgEl.removeEventListener('load', fit);
                imgEl = null; // prevent closure memory leak
            };
            if (imgEl.complete) {
                fit();
            } else {
                imgEl.addEventListener('load', fit);
            }
        }
    }

    render () {
        let project = this.project;
        return (
            <div>
                <div style={styles.backButtonWrapper}>
                    <ArrowBack
                        style={styles.backButton}
                        hoverColor='rgb(135, 147, 252)'
                        onClick={this.back}
                    />
                </div>

                <div style={styles.projectWrapper}>
                    <div style={styles.projectImgWrapper}>
                        <img
                            ref={(c) => this.img = c}
                            src={project['Image URL']}
                            style={styles.projectImg}
                        />
                    </div>
                    <div style={styles.projectHeader}>
                        <h1 style={styles.projectName}>{project.Project}</h1>
                        <div
                            style={styles.projectDescription}
                            dangerouslySetInnerHTML={{__html: marked(project.Description)}}
                        />
                        <ProjectProgress project={project} />
                    </div>
                </div>
            </div>
        );
    }

    back () {
        window.location = '#/';
    }
}


class ProjectProgress extends React.Component {
    render() {
        let project = this.props.project,
            stats = Util.stats(project),
            percentFunded = Util.percentFunded(project),
            color = Util.progressColor(project);

        // Goal may not be specified (sometimes it's silly things like "TBD")
        if (_.isNull(stats.goal)) stats.goal = 'Unspecified';
        else stats.goal = '$' + stats.goal;

        return (
            <div>
                <h4 style={styles.progress.percentFunded}>
                    <span style={styles.progress.goal}>Goal: {stats.goal}</span>
                    <span style={styles.progress.raised}>Raised: ${stats.raised}</span>
                    <span style={{ color }}>Funding Progress: {percentFunded.toFixed(2)}%</span>
                </h4>
                <LinearProgress mode="determinate" value={percentFunded} color={color} />
                <SendMoneyTo
                    recipient={project['Send Money To']}
                    via={project['Send Via']}
                />
            </div>
        );
    }
}


class SendMoneyTo extends React.Component {
    render () {
        let venmo_id = this.props.via[1].replace('@', '');
        return (
            <div>
                <h3 style={styles.recipientHeader}>
                    Send donations to <span style={styles.recipient}>{this.props.recipient}</span>
                </h3>
                <div style={styles.via}>
                    Venmo:&nbsp;
                    <a href={`https://venmo.com/${encodeURIComponent(venmo_id)}`} target="_blank">
                        {this.props.via[1]}
                    </a>
                </div>
            </div>
        );
    }
}

export default Project;