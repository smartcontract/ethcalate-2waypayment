import React from 'react'
import { Container, Header, Grid, Button, Menu } from 'semantic-ui-react'

import ChannelAccordion from './ChannelAccordion'
import NewChannelModal from './NewChannelModal'
import UserSettingsModal from './UserSettingsModal'

const MainHeading = () => (
  <Container text>
      <Header
        as='h1'
        content='Money Shot'
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: '1em',
          marginTop: 0
        }}
      />
  </Container>
)

class DesktopComponent extends React.Component {
  state = {
    activeChannelIndex: null,
    channelId: null
  }

  // retrieve the channel manager contract address if set
  async componentWillReceiveProps (nextProps) {
    if (nextProps && this.props.ethcalate) {
      console.log('componentWillRecieveProps()')
      const { ethcalate, myChannels } = this.props
      console.log('ethcalate.channelManager.address: ' + ethcalate.channelManager.address)
    }
    // const { ethcalate, myChannels } = this.props
    // if (nextProps.channelManager) {
    //   try {
    //     const channelManagerInstance = await nextProps.channelManager.deployed()
    //     this.setState({ channelManagerAddress: channelManagerInstance.address })
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }
  }


  hideChannelButtons = _activeChannelIndex => {
    this.setState({
      activeChannelIndex: _activeChannelIndex
    })
  }


  closeChannel = async () => {
    // closeChannel(bytes32[4] h, uint8 v, uint256 value, uint256 nonce)
    const { ethcalate, myChannels } = this.props
    const { activeChannelIndex } = this.state

    // get contract instance
    await ethcalate.closeChannel()
  }

  issueChallenge = async () => {
    const { ethcalate, myChannels } = this.props
    const { activeChannelIndex } = this.state


  }

  handleMenuItemClick = (menuItem) => {
    return
  }

  render () {
    const { ethcalate, myChannels } = this.props
    const { activeChannelIndex } = this.state
    const hideChannelButton = (activeChannelIndex === -1 || activeChannelIndex === null)

    console.log(myChannels)

    return (
      <div>
        <Container>
          <Grid centered>
            <Grid.Row verticalAlign='top' style={{marginTop: '1.5em'}}>
              
              <Grid.Column textAlign='right'>
                <UserSettingsModal ethcalate={ethcalate}/>
              </Grid.Column>
              
            </Grid.Row>
      
            <Grid.Row>
              <Grid.Column textAlign='center'>
                <MainHeading />
              </Grid.Column>
            </Grid.Row>
            
            <Grid.Row columns='equal' verticalAlign='middle'>
              <Grid.Column textAlign='center'>
                <NewChannelModal ethcalate={ethcalate} />
              </Grid.Column>
           </Grid.Row>

          </Grid>
          <Grid>
            <Grid.Row>
              <Menu className='three item pointing top attached menu'>
                <Menu.Item active className='link' onClick={this.handleMenuItemClick('Open')}>Open</Menu.Item>
                <Menu.Item className='link' onClick={this.handleMenuItemClick('Action Needed')}>Action Needed</Menu.Item>
                <Menu.Item className='link' onClick={this.handleMenuItemClick('Closed')}>Closed</Menu.Item>
              </Menu>
            </Grid.Row>

            <Grid.Row>
              <Menu active className='bottom attached segment'>
                Test
              </Menu>
            
            </Grid.Row>

          </Grid>
        {/* <ChannelAccordion
          callbackFromParent={this.hideChannelButtons}
          myChannels={myChannels}
          ethcalate={ethcalate}
          visible={myChannels.length !== 0}
        /> */}

        </Container>


      </div>
    )
  }
}

export default DesktopComponent
