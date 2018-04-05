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
        marginBottom: '0em',
        marginTop: '-1em'
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
          marginBottom: '0.5em',
          marginTop: '0em'
        }}
      />
    </Container>
  )
}

class DesktopComponent extends React.Component {
  state = {
    activeMenuItem: 'open'
  }

  handleMenuItemClick = (e, { name }) => {
    this.setState({ activeMenuItem: name })
  }

  render () {
    const { ethcalate, myChannels } = this.props
    const { activeMenuItem } = this.state
    console.log(activeMenuItem)

    return (
      <div>
        <Container>
          <Grid centered>
            <Grid.Row verticalAlign='top' style={{ marginTop: '2em' }}>

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
