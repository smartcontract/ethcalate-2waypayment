import React from 'react'
import { Menu, Segment, Container, Header, Grid } from 'semantic-ui-react'

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
    activeMenuItem: null
  }

  hideChannelButtons = _activeChannelIndex => {
    this.setState({
      activeChannelIndex: _activeChannelIndex
    })
  }

  render () {
    const { ethcalate, myChannels } = this.props
    const { activeMenuItem } = this.state

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
