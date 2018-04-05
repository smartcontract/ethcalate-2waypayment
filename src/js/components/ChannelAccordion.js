import React, { Component } from 'react'
<<<<<<< HEAD
import { Container, Header, Grid, Accordion, Button, Tab, Item } from 'semantic-ui-react'
=======
import { Container, Header, Grid, Accordion } from 'semantic-ui-react'
>>>>>>> 56106b84ccc11e474899e157ed8fcdbd693885e8

import TransactionTable from './TransactionTable'
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

  getChannelsToDisplay = (type, myChannels) => {
    // filter channels based on channel type arg

    // update the channelsToDisplay state variable
    this.setState({
      channelsToDisplay: myChannels
    })
  }

  componentWillReceiveProps = (nextProps) => {
    // display only the relevant types of channels in accordion
    if (!nextProps)
      return
    
    if (nextProps !== this.props) {
      const { type, myChannels } = nextProps
      this.getChannelsToDisplay(type, myChannels)
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
    this.props.callbackFromParent(newIndex)
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
    const { id, agentB, balanceB, status } = channel

    let allowJoin = true
    if (ethcalate && ethcalate.web3) {
      allowJoin =
        agentB === ethcalate.web3.eth.accounts[0] && parseFloat(balanceB) === 0
    }

    let allowDispute = false

    return (
      <Container>
        <Grid centered columns='equal'>
          <Grid.Row>

            <Grid.Column>
              <UpdateStateModal channel={channel} ethcalate={ethcalate} />
            </Grid.Column>

            {allowJoin
              ? <Grid.Column>
                <JoinChannelModal channelId={id} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

            {allowDispute
              ? <Grid.Column>
                <ChallengeButton />
              </Grid.Column>
              : <div />}

            {status === 'open'
              ? <Grid.Column>
                <CloseChannelButton channelId={id} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

            {status === 'challenge'
              ? <Grid.Column>
                <WithdrawFundsButton channelId={id} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

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
<<<<<<< HEAD

        <Grid centered>
          <Grid.Row columns='equal'>
            <Grid.Column />
          </Grid.Row>
        </Grid>
=======
>>>>>>> 56106b84ccc11e474899e157ed8fcdbd693885e8
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
<<<<<<< HEAD
    const { activeIndex, channelsToDisplay } = this.state
    const { myChannels, channelType } = this.props

    // console.log('myChannels:', myChannels)
    // console.log('channelsToDisplay:', channelsToDisplay)
=======
    const { myChannels } = this.props
>>>>>>> 56106b84ccc11e474899e157ed8fcdbd693885e8

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
