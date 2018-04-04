import React, { Component } from 'react'
import { Button, Modal, Form, Label, Input, Message } from 'semantic-ui-react'

class NewChannelModal extends Component {
  state = {
    to: null,
    challenge: null,
    deposit: null,
    submittedStake: null,
    submittedParty: null,
    submittedChallengePeriod: null,
    modalOpen: false,
    fieldError: null,
    fieldWarning: null
  }

  async componentWillReceiveProps (nextProps) {}

  async createNewChannel () {
    const { to, challenge, deposit } = this.state
    const { ethcalate } = this.props

    const depositInWei = ethcalate.web3.toWei(deposit, 'ether')
    console.log('to, challenge, depositInWei: ', to, challenge, depositInWei)
    // create new channel with params
    try {
      await ethcalate.openChannel({ to, depositInWei, challenge })
    } catch (e) {
      console.log(e)
    }
  }

  handleOpen = () => {
    this.setState({ modalOpen: true })
  }

  handleClose = () => {
    // close modal
    this.setState({ modalOpen: false })
  }

  handleChange = e => {
    const target = e.target
    const name = target.name
    const value = target.value
    this.setState({ [name]: value })
  }

  handleSubmit = () => {
    const { to, challenge } = this.state

    // must have counterparty entered
    if (!to) {
      this.setState({ fieldError: true })
      return
    }

    // warning if challenge period is less than 1 hour
    if (challenge < 3600) {
      this.setState({ fieldWarning: true })
    }

    this.createNewChannel()
  }

  render () {
    return (
      <Modal
        size='small'
        dimmer='inverted'
        open={this.state.modalOpen}
        onClose={this.handleClose}
        trigger={<Button onClick={this.handleOpen}>Open a New Channel</Button>}
        style={{ position: 'absolute', top: '50%', left: '20%' }}
      >
        <Modal.Header>Enter Channel Information</Modal.Header>
        <Modal.Content>
          <Form warning={this.state.fieldWarning}>

            <Form.Field error={this.state.fieldError}>
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
              <Message
                warning
                header='Thats a short challenge period!'
                content='Seems like your challenge period is less than an hour, you sure?'
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
