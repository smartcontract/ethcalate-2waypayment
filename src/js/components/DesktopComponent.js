import React from 'react'
import { Container, Header, Grid, Button, Form, Modal, Label, Input } from 'semantic-ui-react'

// import CloseButton from './CloseButton'
// import NewButton from './NewButton'
import ChannelAccordion from './ChannelAccordion';
import NewChannelModal from './NewChannelModal';

const MainHeading = () => (
    <Container text>
        <Header
            as='h2'
            content='Take your'
            style={{
                fontSize: '1.7em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: '1.5em'
            }}
        />
        <Header
            as='h1'
            content='Money Shot'
            style={{
                fontSize: '4em',
                fontWeight: 'normal',
                marginBottom: '1.5em',
                marginTop: 0
            }}
        />
    </Container>
)

class DesktopComponent extends React.Component {
    state = {
        hideCloseChannelButton : null,
    }

    hideCloseChannelButton = (_activeChannelIndex) => {
        this.setState({ 
            hideCloseChannelButton : (_activeChannelIndex === -1)
        })
    }

    async componentWillReceiveProps (nextProps) {
        if (nextProps.channelManager) {
            try {
                const channelManagerInstance = await nextProps.channelManager.deployed()
                this.setState({ channelManagerAddress: channelManagerInstance.address })
            } catch(e) {
                console.log(e)
            }
        }
    }

    closeChannel = async () => {
        // closeChannel(bytes32[4] h, uint8 v, uint256 value, uint256 nonce)

        // get contract instance
        const channelManagerInstance = await this.props.channelManager.deployed()
        return channelManagerInstance
    }

    render() {
        const {
            web3,
            web3detected,
            accountAddress,
            channelManager
        } = this.props

        const { hideCloseChannelButton, channelManagerAddress } = this.state

        return (
            <div>
                
                <MainHeading />

                <Container>
                    <Grid>
                        <Grid.Row columns='equal'>
                            <Grid.Column verticalAlign='left'>
                            
                                <NewChannelModal web3={web3} web3detected={web3detected} accountAddress={accountAddress} channelManager={channelManager} />

                            </Grid.Column>
                            <Grid.Column verticalAlign='right'>
                                <Button disabled={hideCloseChannelButton} onClick={this.closeChannel}>Close Selected Channel</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>

                <ChannelAccordion callbackFromParent={this.hideCloseChannelButton}></ChannelAccordion>
            
            </div>
        )
    }
}

export default DesktopComponent;