
import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

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
    gridTile: {
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
                        <GridTile
                            key={index}
                            title={project.Project}
                            subtitle={<span>by <b>{project.author}</b></span>}
                            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                            style={styles.gridTile}
                            onClick={() => ProjectGrid.clicked(project)}
                        >
                            <img src={project['Image URL']} />
                        </GridTile>
                    ))}
                </GridList>
            </div>
        );
    }

    static clicked (project) {
        window.location = `/#/${project.Project}`;
    }
}


export default ProjectGrid;