
import React from 'react';
import {GridList, GridTile, IconButton, Paper, Popover} from 'material-ui';
import transitions from 'material-ui/styles/transitions';
import SecretFireLogoIcon from './LogoIcon.jsx';
import Util from '../util';

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    gridList: {
        width: '100%',
        overflowY: 'auto',
        marginBottom: 24
    },
    projectTile: {
        transition: transitions.easeOut('750ms'),
        cursor: 'pointer'
    }
};


class ProjectGrid extends React.Component {
    render () {
        return (
            <div style={styles.root}>
                <GridList
                    cellHeight={250}
                    style={styles.gridList}
                    cols={4}
                    padding={10}
                >
                    {this.props.projects.map((project, index) => (
                        <ProjectTile key={index} project={project} />
                    ))}
                </GridList>
            </div>
        );
    }
}


class ProjectTile extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            hover: false
        };
    }

    render () {
        let imgStyle = {
            transition: transitions.easeOut(null, 'opacity'),
            opacity: this.state.hover ? 1 : 0.5
        };

        let projectTileStyle = Object.assign({
            boxShadow: this.state.hover
                ? 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px'
                : null
        }, styles.projectTile);

        return (
            <GridTile
                title={this.props.project.Project}
                style={projectTileStyle}
                onClick={this.clicked}
                onMouseOver={() => this.setState({ hover: true  })}
                onMouseOut={ () => this.setState({ hover: false })}
                actionIcon={<TileIcon project={this.props.project} />}
            >
                <img style={imgStyle} src={this.props.project['Image URL']} />
            </GridTile>
        );
    }

    clicked = () => {
        window.location = `#/project/${encodeURIComponent(this.props.project.Project)}`;
    }
}


class TileIcon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render () {
        let popoverStyle = {
            padding: '2px 5px',
            backgroundColor: 'black',
            color: 'white'
        };

        return (
            <IconButton>
                <SecretFireLogoIcon
                    color={Util.progressColor(this.props.project)}
                    onMouseOver={(e) => this.showPopover(e)}
                />
                <Popover
                  open={this.state.open}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={() => this.setState({ open: false })}
                  useLayerForClickAway={false}
                  style={popoverStyle}
                >
                    {Math.round(Util.percentFunded(this.props.project))}% funded
                </Popover>
            </IconButton>
        );
    }

    showPopover (event) {
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    }
}


export default ProjectGrid;
