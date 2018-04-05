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
        marginBottom: '1em',
        marginTop: 0
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
          marginBottom: '1em',
          marginTop: '2em'
      }}
      />
  </Container>
)


class DesktopComponent extends React.Component {

  state = {
    hasChannels: null
  }

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

          <ChannelHeading />

          <Loader active={fetching} />

          <ChannelMenu
            hasChannels={hasChannels}
            ethcalate={ethcalate}
            myChannels={myChannels}
            display={!fetching}
          />

        </Container>
      </div>
    )
  }
}

export default DesktopComponent
