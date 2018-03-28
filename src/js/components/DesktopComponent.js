import React from 'react'
import PropTypes from 'prop-types'
import { Container, Header, Grid } from 'semantic-ui-react'

import ReupButton from './ReupButton'
import NewButton from './NewButton'
import SearchButton from './SearchButton'
import TransactionTable from './TransactionTable';

const MainHeading = ({ mobile }) => (
    <Container text>
        <Header
            as='h2'
            content='Take your'
            style={{
                fontSize: mobile ? '1.5em' : '1.7em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: mobile ? '0.5em' : '1.5em'
            }}
        />
        <Header
            as='h1'
            content='Money Shot'
            style={{
                fontSize: mobile ? '2em' : '4em',
                fontWeight: 'normal',
                marginBottom: mobile ? '1.5em' : '1em',
                marginTop: 0
            }}
        />
    </Container>
)

MainHeading.propTypes = {
    mobile: PropTypes.bool,
}

const ButtonGrouping = () => (
    <Container>
        <Grid>
            <Grid.Row columns='equal'>
                <Grid.Column verticalAlign='left'>
                    <ReupButton />
                </Grid.Column>
                <Grid.Column verticalAlign='center'>
                    <NewButton />
                </Grid.Column>
                <Grid.Column verticalAlign='right'>
                    <SearchButton />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
)

// const TransactionFeed = () => (
//     <TransactionTable />
// )

class DesktopComponent extends React.Component {
    state = {}

    render() {
        return (
            <div>
                <MainHeading />
                <ButtonGrouping />
                <TransactionTable />
            </div>
        )
    }
}

export default DesktopComponent;