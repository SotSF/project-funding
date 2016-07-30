
import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import marked from 'marked';
import {Divider, LinearProgress, Paper, Subheader} from 'material-ui';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Util from '../util';


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
        const styles = {
            backButtonWrapper: {
                marginTop: 10
            },
            backButton: {
                cursor: 'pointer',
                width: 50,
                height: 50
            },
            projectWrapper: {
                marginTop: 30
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
            projectContent: {
                width: 700,
                height: 300,
                paddingLeft: 20,
                boxSizing: 'border-box',
                display: 'inline-block'
            },
            projectName: {
                fontSize: 42,
                margin: 0,
                fontFamily: 'Wizard, Roboto',
                background: '-webkit-linear-gradient(#eb2200, #ede000)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            },
            projectDescription: {
                lineHeight: '180%',
                color: '#666'
            },
            divider: {
                marginTop: 15
            }
        };

        // Only show expenditures list if there are any
        let expenditures = [];
        if (project['Expenditures'].length) {
            expenditures = [
                <ExpendituresList expenditures={project['Expenditures']} key="expenditures" />
            ];
        }

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
                    <div style={styles.projectContent}>
                        <h1 style={styles.projectName}>{project.Project}</h1>
                        <div
                            style={styles.projectDescription}
                            dangerouslySetInnerHTML={{__html: marked(project.Description)}}
                        />
                        <ProjectProgress project={project} />
                        {expenditures}
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

        const styles = {
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
        };

        return (
            <div>
                <h4 style={styles.percentFunded}>
                    <span style={styles.goal}>Goal: {stats.goal}</span>
                    <span style={styles.raised}>Raised: ${stats.raised}</span>
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
        const styles = {
            recipientHeader: {
                marginBottom: 5
            },
            via: {
                color: '#666',
                fontSize: '14px'
            }
        };

        return (
            <div>
                <h3 style={styles.recipientHeader}>Send donations to {this.props.recipient}</h3>
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


class ExpendituresList extends React.Component {
    render () {
        const styles = {
            container: {
                marginTop: 20
            },
            subheader: {
                paddingLeft: 10,
                lineHeight: '35px'
            },
            itemWrapper: {
                position: 'relative',
                paddingLeft: 10,
                lineHeight: '160%',
                opacity: 0.54
            },
            cost: {
                position: 'absolute',
                top: 0,
                right: 10
            }
        };

        let itemWrapperStyle = (index) => {
            return Object.assign({
                backgroundColor: index % 2 === 0 ? 'white' : '#eee'
            }, styles.itemWrapper);
        };

        return (
            <Paper zDepth={1} style={styles.container}>
                <Subheader style={styles.subheader}>Expenditures</Subheader>
                <Divider />
                {this.props.expenditures.map((expenditure, index) => (
                    <div style={itemWrapperStyle(index)} key={expenditure.item}>
                        <span>{expenditure.item}</span>
                        <span style={styles.cost}>${ExpendituresList.formatCost(expenditure.cost)}</span>
                    </div>
                ))}
            </Paper>
        );
    }

    static formatCost (cost) {
        if (cost % 1 === 0) return cost;

        // It's got some cents.
        let dollars   = Math.floor(cost),
            cents     = cost % 1,
            fullCents = cents.toFixed(2);

        return `${dollars}${fullCents.slice(fullCents.indexOf('.'))}`;
    }
}

export default Project;