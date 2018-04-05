import React from 'react'
import { Container, Header, Grid, Loader } from 'semantic-ui-react'

import ChannelMenu from './ChannelMenu'
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

const ChannelHeading = () => (
  <Container>
      <Header
      as='h3'
      textAlign='center'
      content='Your Channels'
      style={{
          fontSize: '1.5em',
          fontWeight: 'normal',
<<<<<<< HEAD
          marginBottom: '1em',
          marginTop: '2em'
      }}
=======
          marginBottom: '0.5em',
          marginTop: '0em'
        }}
>>>>>>> 1d546381d0e118fcf596e0b02cb13cf93d263fc0
      />
  </Container>
)


class DesktopComponent extends React.Component {

  state = {
    hasChannels: null
  }

<<<<<<< HEAD
  componentWillMount = () => {
    const { ethcalate, myChannels } = this.props
    const fetching = (!ethcalate)
    const hasChannels = (myChannels.length !== 0)
    this.setState({
      hasChannels, fetching
    })
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps && nextProps !== this.props) {
      this.setState({
        hasChannels: (nextProps.myChannels.length !== 0)
      })
    }
=======
  handleMenuItemClick = (e, { name }) => {
    this.setState({ activeMenuItem: name })
>>>>>>> 1d546381d0e118fcf596e0b02cb13cf93d263fc0
  }

  render () {
    const { ethcalate, myChannels, fetching } = this.props
    const { hasChannels } = this.state
    
    console.log('DesktopComponent:fetching', fetching)
    console.log('DesktopComponent:hasChannels', hasChannels)
    console.log('DesktopComponent:myChannels', myChannels)

    return (
      <div>
        <Container>
          <Grid centered>
<<<<<<< HEAD
            <Grid.Row verticalAlign='top' style={{ marginTop: '1.5em' }}>
=======
            <Grid.Row verticalAlign='top' style={{ marginTop: '2em' }}>

>>>>>>> 1d546381d0e118fcf596e0b02cb13cf93d263fc0
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

          <ChannelHeading />

<<<<<<< HEAD
          <Loader active={fetching} />

          <ChannelMenu
            hasChannels={hasChannels}
            ethcalate={ethcalate}
            myChannels={myChannels}
            display={!fetching}
          />
=======
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
>>>>>>> 1d546381d0e118fcf596e0b02cb13cf93d263fc0

        </Container>
      </div>
    )
  }
}

export default DesktopComponent
