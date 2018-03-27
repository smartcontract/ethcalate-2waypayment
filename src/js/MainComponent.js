import React from 'react'
import PropTypes from 'prop-types'
import { Container, Button, Header, Table, Divider, Grid, List, Menu, ResponsiveContainer, Segment, Label } from 'semantic-ui-react'

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
                    <Button>Reup</Button>
                    <Label className='tag'>$$$$$</Label>
                </Grid.Column>
                <Grid.Column verticalAlign='center'>
                    <Button>New</Button>
                </Grid.Column>
                <Grid.Column verticalAlign='right'>
                    <Button>Search</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
)

const TransactionFeed = () => (
    <Container>
        <Header
            as='h3'
            textAlign='center'
            content='Your Channels'
            style={{
                fontSize: '1.5em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: '2em'
            }}
        />
        <Table className='ui cell striped table'>
            <thead>
                <tr><th>Counterparty</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Current Nonce</th>
            </tr></thead>
            <tbody>
                <tr>
                    <td>Channel Counterparty Address Here 1</td>
                    <td>Channel Balance for participant  1</td>
                    <td>Status of the channel 1</td>
                    <td>Latest Channel Nonce Here 1</td>
                </tr>
                <tr>
                    <td>Channel Counterparty Address Here 2</td>
                    <td>Channel Balance for participant 2</td>
                    <td>Status of the channel 2</td>
                    <td>Latest Channel Nonce Here 2</td>
                </tr>
            </tbody>
        </Table>
    </Container>
)

class DesktopComponent extends React.Component {
    state = {}

    render() {
        return (
            <div>
                <MainHeading />
                <ButtonGrouping />
                <TransactionFeed />
            </div>
        )
    }
}

export default DesktopComponent;