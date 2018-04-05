import React, { Component } from 'react'
import { Container, Header, Grid, Accordion } from 'semantic-ui-react'

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

  setStateAsync = (state) => {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    })
  }

  getChannelsToDisplay = async (type) => {
    // console.log('getChannelsToDisplay()')
    const { ethcalate, myChannels } = this.props
    const channelsToDisplay = await ethcalate.getMyChannels(type)
    this.setStateAsync({ channelsToDisplay })
    // console.log('channelsToDisplay:',channelsToDisplay)
  }

  componentWillMount = async () => {
    // called before render()



    // console.log('ChannelAccordion:componentWillMount')
    const { ethcalate, myChannels, channelType } = this.props
    if (ethcalate) {
      const channelsToDisplay = await ethcalate.getMyChannels(channelType)
      this.setStateAsync({ channelsToDisplay })
    }
  }

  componentWillReceiveProps = async (nextProps) => {
    // display only the relevant types of channels in accordion
    if (!nextProps) {
      return
    }
    
    // new type of channels needed
    if (nextProps.channelType !== this.props.channelType) {
      // console.log('componentWillReceiveProps:', nextProps.channelType)
      const channelsToDisplay = await this.getChannelsToDisplay(nextProps.channelType)
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
    const { ethcalate, type } = this.props
    const { id, agentB, balanceB } = channel

    return (
      <Container>
        <Grid>
          <Grid.Row centered columns='equal'>

            {(type === 'open')
              ? <Grid.Column textAlign='center'>
                <UpdateStateModal channelId={id} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

            {(type === 'join')
              ? <Grid.Column textAlign='center'>
                <JoinChannelModal channelId={id} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

            {(type === 'challenge')
              ? <Grid.Column textAlign='center'>
                <ChallengeButton />
              </Grid.Column>
              : <div />}

            {(type === 'open')
              ? <Grid.Column textAlign='center'>
                <CloseChannelButton channelId={id} ethcalate={ethcalate} />
              </Grid.Column>
              : <div />}

            {(type === 'closed')
              ? <Grid.Column textAlign='center'>
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
            <TransactionTable channel={channel} ethcalate={ethcalate}/>
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
    const { activeIndex, channelsToDisplay } = this.state
    const { myChannels, channelType } = this.props

    // console.log('ChannelAccordion:channelType:', channelType)
    // console.log('ChannelAccordion:myChannels:', myChannels)
    // console.log('ChannelAccordion:channelsToDisplay:', channelsToDisplay)

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
