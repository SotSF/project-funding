
import React from 'react';
import { Dialog, FlatButton } from 'material-ui';
import transitions from 'material-ui/styles/transitions';


class Explanation extends React.Component {
    constructor () {
        super();
        this.state = {
            open: false,
            hover: false
        };
    }

    handleClose () {
        this.setState({ open: false });
    }

    render () {
        const styles = {
            label: {
                fontSize: 12,
                float: 'right',
                textAlign: 'right',
                marginBottom: 5,
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: this.state.hover ? 1 : 0.54,
                transition: transitions.easeOut()
            },
            content: {
                textAlign: 'justify',
                lineHeight: '150%'
            }
        };

        const dialogActions = [
            <FlatButton
                label="Cool!"
                primary={true}
                onTouchTap={() => this.handleClose()}
            />
        ];

        return (
            <div>
                <div
                    style={styles.label}
                    onTouchTap={() => this.setState({ open: true })}
                    onMouseOver={() => this.setState({ hover: true })}
                    onMouseLeave={() => this.setState({ hover: false })}
                >
                    What is this?
                </div>

                <Dialog
                    title="Camp Project Funding!"
                    actions={dialogActions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={() => this.handleClose()}
                >
                    <div style={styles.content}>
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
                </Dialog>
            </div>
        )
    }
}


export default Explanation;
