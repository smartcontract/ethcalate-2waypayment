import React, { Component } from 'react'
import { Container, Header, Grid, Accordion, Button } from 'semantic-ui-react'
import TransactionTable from './TransactionTable'

class ChannelAccordion extends Component {
  state = {
    activeIndex: 0
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
    this.props.callbackFromParent(newIndex)
  }

  handleJoinChannelClick = async channelId => {
    console.log('handleJoinChannelClick with channelId:' + channelId)
    const { ethcalate } = this.props
    try {
      await ethcalate.joinChannel({ channelId, depositInEth: '1' }) // TODO: SET AMOUNT FROM UI
    } catch (e) {
      console.log(e)
    }
  }

  handleUpdateStateClick = async ({
    id,
    agentA,
    agentB,
    balanceA,
    balanceB,
    latestNonce
  }) => {
    console.log('handleJoinChannelClick with channelId:' + id)
    const { ethcalate } = this.props

    console.log(agentA, agentB)

    // detect who is counterparty
    let isAgentA
    if (ethcalate.web3.eth.accounts[0] === agentA) {
      isAgentA = true
    } else if (ethcalate.web3.eth.accounts[0] === agentB) {
      isAgentA = false
    } else {
      throw new Error('This is not your channel')
    }
    console.log('isAgentA: ', isAgentA)

    try {
      const res = await ethcalate.updateState({
        channelId: id,
        nonce: parseInt(latestNonce) + 2,
        balanceA: ethcalate.web3.toWei(0.5, 'ether'),
        balanceB: ethcalate.web3.toWei(1.5, 'ether'),
        isAgentA
      })
      console.log('res: ', res)
    } catch (e) {
      console.log(e)
    }
  }

  handleStartChallengeClick = async channelId => {
    const { ethcalate } = this.props
    try {
      const res = await ethcalate.startChallengePeriod(channelId)
      console.log('res: ', res)
    } catch (e) {
      console.log(e)
    }
  }

  handleCloseChannelClick = async channelId => {
    const { ethcalate } = this.props
    try {
      const res = await ethcalate.closeChannel(channelId)
      console.log('res: ', res)
    } catch (e) {
      console.log(e)
    }
  }

  channelGrid ({ id, agentA, agentB, balanceA, balanceB, latestNonce, status }) {
    return (
      <Grid centered celled>
        <Grid.Row columns='equal'>
          <Grid.Column>{agentB ? `${agentB.slice(0, 5)}...` : ''}</Grid.Column>
          <Grid.Column>
            {balanceA ? parseFloat(balanceA).toFixed(4) : 0}
          </Grid.Column>
          <Grid.Column>
            {balanceB ? parseFloat(balanceB).toFixed(4) : 0}
          </Grid.Column>
          <Grid.Column>{status}</Grid.Column>
          <Grid.Column>{latestNonce}</Grid.Column>
          <Grid.Column>
            <Button onClick={() => this.handleJoinChannelClick(id)}>
              Join Channel
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              onClick={() =>
                this.handleUpdateStateClick({
                  id,
                  agentA,
                  agentB,
                  balanceA,
                  balanceB,
                  latestNonce,
                  status
                })}
            >
              Update State
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button onClick={() => this.handleStartChallengeClick(id)}>
              Start Challenge
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button onClick={() => this.handleCloseChannelClick(id)}>
              Close Channel
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  accordionRow (channel) {
    return (
      <div key={channel.id}>
        <Accordion.Title active={false} index={0} onClick={this.handleClick}>
          {this.channelGrid(channel)}
        </Accordion.Title>
        <Accordion.Content active={false}>
          <TransactionTable />
        </Accordion.Content>
      </div>
    )
  }

  render () {
    const { activeIndex } = this.state
    const { myChannels } = this.props
    const channelGrid = this.channelGrid(
      'Counterparty',
      'Balance',
      'Status',
      'Nonce'
    )

    return (
      <div>
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

          <Accordion fluid styled>
            {myChannels.map((channel, index) => {
              return this.accordionRow(channel)
            })}
          </Accordion>
        </Container>
      </div>
    )
  }
}

export default ChannelAccordion
