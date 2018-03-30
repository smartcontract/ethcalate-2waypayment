import React, { Component } from 'react'
import { Button, Modal, Form, Label, Input } from 'semantic-ui-react'

class NewChannelModal extends Component {
  state = {
    to: null,
    challenge: null,
    deposit: null,
    submittedStake: null,
    submittedParty: null,
    submittedChallengePeriod: null,
    channelManagerAddress: null
  }

  async componentWillReceiveProps (nextProps) {
    if (nextProps.channelManager) {
      try {
        const channelManagerInstance = await nextProps.channelManager.deployed()
        this.setState({ channelManagerAddress: channelManagerInstance.address })
      } catch (e) {
        console.log(e)
      }
    }
  }

  createNewChannel = async () => {
    console.log('createNewChannel')
    const { to, challenge, deposit } = this.state

    const { ethcalate } = this.props

    // create new channel with params
    try {
      console.log('challenge: ', challenge)
      console.log(typeof challenge)
      await ethcalate.openChannel({ to, depositInEth: deposit, challenge })
    } catch (e) {
      console.log(e)
    }
  }

  handleChange = e => {
    const target = e.target
    const name = target.name
    const value = target.value
    this.setState({ [name]: value }, () => {
      console.log(this.state)
    })
  }

  handleSubmit = () => {
    const { newCounterparty, challengePeriod, stake } = this.state
    this.setState({
      submittedParty: newCounterparty,
      submittedChallengePeriod: challengePeriod,
      submittedStake: stake
    })
    this.createNewChannel()
  }

  render () {
    return (
      <Modal
        size='small'
        dimmer='inverted'
        trigger={<Button>Open a New Channel</Button>}
        style={{ position: 'absolute', top: '50%', left: '20%' }}
      >
        <Modal.Header>Enter Channel Information</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Label>Counterparty</Label>
              <Input
                type='text'
                placeholder='Ideally a friend'
                name='to'
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Label>Challenge Period (seconds)</Label>
              <Input
                type='number'
                placeholder='We recommend 86400s (1 day)'
                name='challenge'
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Label>Channel Stake</Label>
              <Input
                type='number'
                placeholder='ETH'
                name='deposit'
                onChange={this.handleChange}
              />
            </Form.Field>
            <Button type='submit' onClick={this.handleSubmit}>
              Open
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

export default NewChannelModal
