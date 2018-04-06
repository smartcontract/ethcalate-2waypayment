import React, { Component } from 'react'
import { Container, Header, Grid, Accordion } from 'semantic-ui-react'

import TransactionModal from './TransactionModal'
import ChallengeButton from './ChallengeButton'
import JoinChannelModal from './JoinChannelModal'
import UpdateStateModal from './UpdateStateModal'
import CloseChannelButton from './CloseChannelButton'
import WithdrawFundsButton from './WithdrawFundsButton'

class ChannelAccordion extends Component {
  state = {
    activeIndex: null,
    channelsToDisplay: []
  }

  getChannelsToDisplay = (channelType) => {
    const { myChannels } = this.props
    let channelsToDisplay = []
    switch (channelType) {
      case 'open':
        for (let i = 0; i < myChannels.length; i++) {
          const isJoin = (myChannels[i].depositA === '0' || myChannels[i].depositB === '0')
          if (myChannels[i].status === 'open' && isJoin === false) {
            channelsToDisplay.push(myChannels[i])
          }
        }
        break
      case 'join':
        for (let i = 0; i < myChannels.length; i++) {
          const isJoin = (myChannels[i].depositA === '0' || myChannels[i].depositB === '0')
          if (myChannels[i].status === 'open' && isJoin === true) {
            channelsToDisplay.push(myChannels[i])
          }
        }
        break
      default:
        for (let i = 0; i < myChannels.length; i++) {
          if (myChannels[i].status === channelType) {
            channelsToDisplay.push(myChannels[i])
          }
        }
        break
    }
    this.setState({ channelsToDisplay })
  }

  componentWillMount = async () => {
    const { ethcalate, channelType } = this.props
    if (ethcalate) {
      this.getChannelsToDisplay(channelType)
    }
  }

  componentWillReceiveProps = async (nextProps) => {
    // display only the relevant types of channels in accordion
    if (!nextProps) {
      return
    }

    // new type of channels needed
    if (nextProps.channelType !== this.props.channelType) {
      this.getChannelsToDisplay(nextProps.channelType)
    }
  }

  handleRowClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    if (!activeIndex) {
      this.setState({ activeIndex: 0 })
    }
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
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
    const { ethcalate, channelType } = this.props
    const { id, agentB, balanceB } = channel

    return (
      <Container>
        <Grid>
          <Grid.Row centered columns='equal'>
            {(channelType === 'open')
              ? <Grid.Column textAlign='center'>
                <UpdateStateModal channel={channel} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

            {(channelType === 'join')
              ? <Grid.Column textAlign='center'>
                <JoinChannelModal channel={channel} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

            {(channelType === 'challenge')
              ? <Grid.Column textAlign='center'>
                <ChallengeButton />
              </Grid.Column>
              : <div />}

            {(channelType === 'open')
              ? <Grid.Column textAlign='center'>
                <CloseChannelButton channel={channel} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

            {(channelType === 'closed')
              ? <Grid.Column textAlign='center'>
                <WithdrawFundsButton channel={channel} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

          </Grid.Row>
        </Grid>

        <Grid centered>
          <Grid.Row>
            <TransactionModal ethcalate={ethcalate} channelId={id} />
          </Grid.Row>
        </Grid>
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
    const { channelsToDisplay } = this.state
    
    return (
      <div>
        <Container>

          <Accordion fluid styled>
            {channelsToDisplay.map((channel, index) => {
              return this.accordionRow(channel, index)
            })}
          </Accordion>

        </Container>
      </div>
    )
  }
}

export default ChannelAccordion
