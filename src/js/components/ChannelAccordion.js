import React, { Component } from 'react'
import { Container, Header, Grid, Accordion, Button, Tab, Item } from 'semantic-ui-react'

import TransactionTable from './TransactionTable'
import ChallengeButton from './ChallengeButton'
import JoinChannelModal from './JoinChannelModal'
import UpdateStateModal from './UpdateStateModal'
import CloseChannelButton from './CloseChannelButton'

class ChannelAccordion extends Component {
  state = {
    activeIndex: null
  }

  handleRowClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    if (!activeIndex) {
      this.setState({ activeIndex: 0 })
    }
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

  channelTitlePanel ({
    id,
    agentA,
    agentB,
    balanceA,
    balanceB,
    latestNonce,
    status
  }) {
    const { ethcalate } = this.props

    // determine who is counterparty
    let counterparty
    let myBalance
    let counterpartyBalance
    // format balances
    if (agentA === ethcalate.web3.eth.accounts[0]) {
      counterparty = agentB
      myBalance = balanceA
        ? parseFloat(ethcalate.web3.fromWei(balanceA, 'ether')).toFixed(4)
        : 0
      counterpartyBalance = balanceB
        ? parseFloat(ethcalate.web3.fromWei(balanceB, 'ether')).toFixed(4)
        : 0
    } else if (agentB === ethcalate.web3.eth.accounts[0]) {
      counterparty = agentA
      myBalance = balanceB
        ? parseFloat(ethcalate.web3.fromWei(balanceB, 'ether')).toFixed(4)
        : 0
      counterpartyBalance = balanceA
        ? parseFloat(ethcalate.web3.fromWei(balanceA, 'ether')).toFixed(4)
        : 0
    }

    return (
      <Container>
        <Grid centered>
          <Grid.Row columns='equal' verticalAlign='middle'>
            <Grid.Column>
              <Header className='h3 centered'>Counterparty</Header>
              <Header className='centered sub header'>{counterparty}</Header>
            </Grid.Column>
            <Grid.Column>
              <Header className='h3 centered'>Balances</Header>
              <Grid.Row>
                <Header className='centered sub header'>
                  Mine: {myBalance}
                </Header>
                <Header className='centered sub header'>
                  Counterparty: {counterpartyBalance}
                </Header>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column>
              <Header className='h3 centered'>Status</Header>
              <Header className='centered sub header'>{status}</Header>
            </Grid.Column>

          </Grid.Row>
        </Grid>

      </Container>
    )
  }

  channelDetailsPanel (channel) {
    const { ethcalate } = this.props
    const {
      id,
      agentA,
      agentB,
      balanceA,
      balanceB,
      latestNonce,
      status
    } = channel

    let allowJoin = false
    if (ethcalate && ethcalate.web3) {
      allowJoin =
        agentB === ethcalate.web3.eth.accounts[0] && parseFloat(balanceB) === 0
    }
    return (
      <Container>
        <Grid centered columns='equal'>
          <Grid.Row>

            <Grid.Column>
              <UpdateStateModal channel={channel} ethcalate={ethcalate} />
            </Grid.Column>

            <Grid.Column>
              {allowJoin
                ? <JoinChannelModal channelId={id} ethcalate={ethcalate} />
                : <div />}
            </Grid.Column>

            <Grid.Column>
              <ChallengeButton />
            </Grid.Column>

            <Grid.Column>
              <CloseChannelButton />
            </Grid.Column>

          </Grid.Row>
        </Grid>

        <Grid centered>
          <Grid.Row>
            <Header className='centered h4' style={{ marginTop: '1em' }}>
              Latest Transactions
            </Header>
          </Grid.Row>
          <Grid.Row>
            <TransactionTable channel={channel} />
          </Grid.Row>
        </Grid>

        <Grid centered>
          <Grid.Row columns='equal'>
            <Grid.Column />
          </Grid.Row>
        </Grid>

        {/* <Grid centered celled>
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
          </Grid.Row>
        </Grid> */}

      </Container>
    )
  }

  accordionRow (channel, index) {
    return (
      <div key={channel.id}>
        <Accordion.Title
          active={this.state.activeIndex === index}
          index={index}
          onClick={this.handleRowClick}
        >
          {this.channelTitlePanel(channel)}
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndex === index}>
          {this.channelDetailsPanel(channel)}
        </Accordion.Content>
      </div>
    )
  }

  render () {
    const { activeIndex } = this.state
    const { myChannels } = this.props
    const channelGrid = this.channelDetailsPanel(
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
              return this.accordionRow(channel, index)
            })}
          </Accordion>
          
        </Container>
      </div>
    )
  }
}

export default ChannelAccordion
