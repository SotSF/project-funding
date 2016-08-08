
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

    let memberDonations;
    if (props.dues) {
        memberDonations = _.map(
            _.groupBy([...props.dues.campMembers, ...props.donors], 'name'),
            ((arr) => Object.assign({}, ...arr))
        );
    } else {
        memberDonations = [];
    }

    // Sort by amount paid
    memberDonations.sort((member1, member2) => {
        let donation1 = member1.donations || 0,
            donation2 = member2.donations || 0;

        if (donation1 > donation2) {
            return 1
        } else if (donation1 < donation2) {
            return -1;
        } else {
            return 0;
        }
    });

    return (
        <div style={style}>
            {_.map(memberDonations, (memberData) => {
                return (
                    <Donor
                        {...memberData}
                        key={memberData.name}
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
    let requiredDonation = props.owes || -1,
        donation;

    donation = props.donations > requiredDonation
        ? requiredDonation
        : props.donations;

    return (
        <div style={styles.wrapper}>
            <div>{props.name} (${props.donations ? props.donations : 0 })</div>
            <LinearProgress
                mode="determinate"
                value={donation / requiredDonation * 100}
                color={redToGreen(donation, requiredDonation)}
            />
        </div>
    );
};


export default DonorsPage;
