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
    activeChannelIndex: null,
    channelManagerAddress: null,
    channelStatus: null
  }

  // retrieve the channel manager contract address if set
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

  // updates whether the close and challenge buttons should be active
  hideChannelButtons = _activeChannelIndex => {
    // get channel status from active channel index
    this.setState({
      activeChannelIndex: _activeChannelIndex
    })
  }

  // call the ethcalate.closeChannel() function here
  // retrieve parameters from the ethcalate hub database
  closeChannel = async () => {
    // closeChannel(bytes32[4] h, uint8 v, uint256 value, uint256 nonce)
    const { ethcalate, myChannels } = this.props
    const { activeChannelIndex, channelManagerAddress } = this.state

    // get contract instance
    const channelManagerInstance = await this.props.channelManager.deployed()
    return channelManagerInstance
  }

  // call the ethcalate.issueChallenge() function here
  issueChallenge = async () => {
    const { ethcalate, myChannels } = this.props
    const { activeChannelIndex, channelManagerAddress } = this.state


  }

  render () {
    const { ethcalate, myChannels } = this.props
    const { activeChannelIndex } = this.state
    const hideChannelButton = activeChannelIndex === -1

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
                  disabled={hideChannelButton}
                  onClick={this.closeChannel}
                >
                  Close Selected Channel
                </Button>

              </Grid.Column>
              <Grid.Column>
                
                <Button
                  disabled={hideChannelButton}
                  onClick={this.issueChallenge}
                >
                  Issue Channel Challenge
                </Button>
                
              </Grid.Column>

              <Grid.Column>
                
                <Button
                  disabled={hideChannelButton}
                  onClick={this.joinChannel}
                >
                  Join Selected Channel
                </Button>
                
              </Grid.Column>

            </Grid.Row>
          </Grid>
        </Container>

        <ChannelAccordion
          callbackFromParent={this.hideChannelButtons}
          myChannels={myChannels}
          ethcalate={ethcalate}
        />

      </div>
    )
  }
}

export default DesktopComponent
