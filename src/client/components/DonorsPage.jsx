
import _ from 'underscore';
import React from 'react';
import { LinearProgress } from 'material-ui';
import Aniron from './Aniron.jsx';
import { getOnce, redToGreen } from '../util';


class DonorsPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data      : null,
            dues      : null,
            errorCode : null
        };
    }

    componentDidMount () {
        getOnce('data/donorData.json')
            .then((data) => this.setState({ data }))
            .catch((xhr) => this.setState({ errorCode: xhr.status }));

        getOnce('config/kickstarterDues.json')
            .then((dues) => this.setState({ dues }))
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
            {props.dues && _.map(props.dues.campMembers, (memberDues) => {
                console.log(_.findWhere(props.donors, { name: memberDues.name }));
                return (
                    <Donor
                        {...memberDues}
                        donor={_.findWhere(props.donors, { name: memberDues.name })}
                        key={memberDues.name}
                    />
                )
            })}
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
    let requiredDonation = props.owes,
        donation;

    if (props.donor) {
        donation = props.donor.donations > requiredDonation
            ? requiredDonation
            : props.donor.donations;
    } else {
        donation = 0;
    }

    return (
        <div style={styles.wrapper}>
            <div>{props.name} (${props.donor ? props.donor.donations : 0 })</div>
            <LinearProgress
                mode="determinate"
                value={donation / requiredDonation * 100}
                color={redToGreen(donation, requiredDonation)}
            />
        </div>
    );
};


export default DonorsPage;
