import React from 'react'
import { Container, Header, Grid, Button } from 'semantic-ui-react'

// import CloseButton from './CloseButton'
// import NewButton from './NewButton'
import ChannelAccordion from './ChannelAccordion'
import NewChannelModal from './NewChannelModal'

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
    hideCloseChannelButton: null
  }

  async componentWillReceiveProps (nextProps) {
    if (nextProps.channelManager) {
      try {
        const channelManagerInstance = await nextProps.channelManager.deployed()
        this.setState({ channelManagerAddress: channelManagerInstance.address })
      } catch (e) {
        console.log(e)
      }
    }
  }

  hideCloseChannelButton = _activeChannelIndex => {
    this.setState({
      hideCloseChannelButton: _activeChannelIndex === -1
    })
  }

  closeChannel = async () => {
    // closeChannel(bytes32[4] h, uint8 v, uint256 value, uint256 nonce)

    // get contract instance
    const channelManagerInstance = await this.props.channelManager.deployed()
    return channelManagerInstance
  }

  render () {
    const { ethcalate, myChannels } = this.props
    const { hideCloseChannelButton } = this.state

    return (
      <div>

        <MainHeading />

        <Container>
          <Grid>
            <Grid.Row columns='equal'>
              <Grid.Column>

                <NewChannelModal ethcalate={ethcalate} />

              </Grid.Column>
              <Grid.Column>
                <Button
                  disabled={hideCloseChannelButton}
                  onClick={this.closeChannel}
                >
                  Close Selected Channel
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

        <ChannelAccordion
          callbackFromParent={this.hideCloseChannelButton}
          myChannels={myChannels}
          ethcalate={ethcalate}
        />

      </div>
    )
  }
}

export default DesktopComponent
