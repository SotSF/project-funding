
import React from 'react';
import { LinearProgress } from 'material-ui';
import Aniron from './Aniron.jsx';
import { getOnce, redToGreen } from '../util';


class DonorsPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data      : null,
            errorCode : null
        };
    }

    componentDidMount () {
        getOnce('data/donorData.json')
            .then((data) => this.setState({ data }))
            .catch((xhr) => this.setState({ errorCode: xhr.status }));
    }

    render () {
        const styles = {
            header: {
                fontSize: 60,
                textAlign: 'center',
                margin: '10px 0 0'
            },
            error: {
                textAlign: 'center'
            }
        };

        let donorsList = this.state.data && (
            <DonorsList
                donors={this.state.data}
                dues={this.state.dues}
                key="donors"
            />
        );

        let errorCode = this.state.errorCode && (
            <div style={styles.error} key="error">
                Request for donor data returned with {this.state.errorCode} error
            </div>
        );

        let components = [
            donorsList,
            errorCode
        ];


        return <div>
            <Aniron style={styles.header}>Donations Tracker</Aniron>
            {components}
        </div>;
    }
}


let DonorsList = (props) => {
    let style = {
        marginBottom: 10
    };

    return (
        <div style={style}>
            {props.donors.map((donor) => (
                <Donor {...donor} key={donor.name} />
            ))}
        </div>
    );
};


let Donor = (props) => {
    let styles = {
        wrapper: {
            marginTop: 10
        }
    };

    // Cap the donation amount at 50 for the purposes of the progress bar (show actual donation
    // amount with the name)
    let requiredDonation = 50,
        donation         = props.donations > requiredDonation ? requiredDonation : props.donations;

    return (
        <div style={styles.wrapper}>
            <div>{props.name} (${props.donations})</div>
            <LinearProgress
                mode="determinate"
                value={donation / requiredDonation * 100}
                color={redToGreen(donation, requiredDonation)}
            />
        </div>
    );
};


export default DonorsPage;
