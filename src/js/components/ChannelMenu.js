import React, { Component } from 'react'
import { Menu, Segment, Grid, Header, Container } from 'semantic-ui-react'

import ChannelAccordion from './ChannelAccordion'

const NoChannelsHeading = () => (
  <Container>
    <Header
      as='h3'
      textAlign='center'
      content='Uh Oh! You have no Channels.'
      style={{
        fontSize: '1.5em',
        fontWeight: 'normal',
        marginBottom: '1em',
        marginTop: '2em'
      }}
    />
    <Header
      as='h4'
      textAlign='center'
      content='Get started by clicking above!'
      style={{
        fontWeight: 'normal',
        marginBottom: '1em',
        marginTop: '2em'
      }}
    />
  </Container>
)

class ChannelMenu extends Component {
  state = {
    activeMenuItem: 'open'
  }

  handleMenuItemClick = (e, { name }) => {
    this.setState({ activeMenuItem: name })
  }

  render () {
    const { activeMenuItem } = this.state
    const { hasChannels, myChannels, ethcalate, display } = this.props

    console.log('ChannelMenu:activeMenuItem', activeMenuItem)

    if (display && !hasChannels) {
      return (
        <Grid>
          <Grid.Row>
            <NoChannelsHeading />
          </Grid.Row>
        </Grid>
      )
    } else if (display) {
      return (
        <Grid>
          <Grid.Row>
            <Menu className='four item pointing top attached menu'>
              <Menu.Item
                active={activeMenuItem === 'open'}
                name='open'
                className='link'
                onClick={this.handleMenuItemClick}
              >
                Open
              </Menu.Item>
              <Menu.Item
                active={activeMenuItem === 'join'}
                name='join'
                className='link'
                onClick={this.handleMenuItemClick}
              >
                Join Channels
              </Menu.Item>
              <Menu.Item
                active={activeMenuItem === 'challenge'}
                name='challenge'
                className='link'
                onClick={this.handleMenuItemClick}
              >
                Challenge Period
              </Menu.Item>
              <Menu.Item
                active={activeMenuItem === 'closed'}
                name='closed'
                className='link'
                onClick={this.handleMenuItemClick}
              >
                Closed
              </Menu.Item>
            </Menu>

            <Segment attached='bottom'>
              <ChannelAccordion
                myChannels={myChannels}
                ethcalate={ethcalate}
                channelType={activeMenuItem}
              />
            </Segment>

          </Grid.Row>

        </Grid>
      )
    } else {
      return <Grid />
    }
  }
}

export default ChannelMenu
