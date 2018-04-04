import React from 'react'
import { Container, Header, Grid, Button, Menu, Segment } from 'semantic-ui-react'

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

const ChannelHeading = () => {
  return (
    <Container>
      <Header
        as='h3'
        textAlign='center'
        content='Your Channels'
        style={{
          fontSize: '1.5em',
          fontWeight: 'normal',
          marginBottom: '1em',
          marginTop: '2em'
        }}
      />
    </Container>
  )
}

class DesktopComponent extends React.Component {
  state = {
    activeChannelIndex: null,
    channelId: null,
    activeMenuItem: null
  }

  // retrieve the channel manager contract address if set
  async componentWillReceiveProps (nextProps) {
    if (nextProps && this.props.ethcalate) {
      console.log('componentWillRecieveProps()')
      const { ethcalate, myChannels } = this.props
      console.log(
        'ethcalate.channelManager.address: ' + ethcalate.channelManager.address
      )
    }
  }

  hideChannelButtons = _activeChannelIndex => {
    this.setState({
      activeChannelIndex: _activeChannelIndex
    })
  }

  // handleMenuItemClick = (e, titleProps) => {
  //   const { index } = titleProps
  //   this.setState({
  //     activeMenuItem: index
  //   })
  // }

  handleMenuItemClick = (e, {name}) => {
    this.setState({ activeMenuItem: name })
  }

  render () {
    const { ethcalate, myChannels } = this.props
    const { activeChannelIndex, activeMenuItem } = this.state
    const hideChannelButton = (activeChannelIndex === -1 || activeChannelIndex === null)
    console.log(activeMenuItem)

    console.log(myChannels)

    return (
      <div>
        <Container>
          <Grid centered>
            <Grid.Row verticalAlign='top' style={{ marginTop: '1.5em' }}>

              <Grid.Column textAlign='right'>
                <UserSettingsModal ethcalate={ethcalate} />
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
              <ChannelHeading />
            </Grid.Row>

            <Grid.Row>
              <Menu className='three item pointing top attached menu'>
                <Menu.Item active={activeMenuItem === 'open'} name='open' className='link' onClick={this.handleMenuItemClick}>Open</Menu.Item>
                <Menu.Item active={activeMenuItem === 'action'} name='action' className='link' onClick={this.handleMenuItemClick}>Action Needed</Menu.Item>
                <Menu.Item active={activeMenuItem === 'closed'} name='closed' className='link' onClick={this.handleMenuItemClick}>Closed</Menu.Item>
              </Menu>

              <Segment attached='bottom'>
                <ChannelAccordion
                  callbackFromParent={this.hideChannelButtons}
                  myChannels={this.getmyChannels}
                  ethcalate={ethcalate}
                  visible={myChannels.length !== 0}
                  type={activeMenuItem}
                />
              </Segment>
              
            </Grid.Row>

          </Grid>
        </Container>
      </div>
    )
  }
}

export default DesktopComponent
