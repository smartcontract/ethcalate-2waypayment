import React from 'react'
import { Container, Header, Grid } from 'semantic-ui-react'

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

  hideChannelButtons = _activeChannelIndex => {
    this.setState({
      activeChannelIndex: _activeChannelIndex
    })
  }

  render () {
    const { ethcalate, myChannels } = this.props

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
              {/* <Grid.Column>

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

              <Grid.Column >

                <Button
                  disabled={hideChannelButton}
                  onClick={this.joinChannel}
                >
                  Join Selected Channel
                </Button>

              </Grid.Column>

            </Grid.Row>
          </Grid>
        </Container> */}
            </Grid.Row>
          </Grid>

          <ChannelAccordion
            callbackFromParent={this.hideChannelButtons}
            myChannels={myChannels}
            ethcalate={ethcalate}
            visible={myChannels.length !== 0}
          />

        </Container>

      </div>
    )
  }
}

export default DesktopComponent
