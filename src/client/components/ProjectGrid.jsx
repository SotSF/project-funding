
import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import transitions from 'material-ui/styles/transitions';

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
        transition: transitions.easeOut(),
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
                ? 'rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px'
                : null
        }, styles.projectTile);

        return (
            <GridTile
                title={this.props.project.Project}
                style={projectTileStyle}
                onClick={this.clicked}
                onMouseOver={() => this.setState({ hover: true  })}
                onMouseOut={ () => this.setState({ hover: false })}
            >
                <img style={imgStyle} src={this.props.project['Image URL']} />
            </GridTile>
        );
    }

    clicked = () => {
        window.location = `#/${encodeURIComponent(this.props.project.Project)}`;
    }
}


export default ProjectGrid;