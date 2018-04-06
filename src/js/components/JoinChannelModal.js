import React, { Component } from 'react'
import { Button, Modal, Label, Form, Input } from 'semantic-ui-react'

class JoinChannelModal extends Component {
  state = {
    deposit: 0
  }

  handleSubmit = async () => {
    const { ethcalate, channel } = this.props
    const { deposit } = this.state
    const depositInWei = ethcalate.web3.toWei(deposit)
    const channelId = channel.id
    try {
      await ethcalate.joinChannel({ channelId, depositInWei })
    } catch (e) {
      console.log(e)
    }
  }

  render () {
    return (
      <Modal
        size='small'
        dimmer='inverted'
        trigger={<Button disabled={this.props.disabled}>Join Channel</Button>}
        style={{ position: 'absolute', top: '50%', left: '20%' }}
      >
        <Modal.Header>Join Channel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Label>Deposit</Label>
              <Input
                type='number'
                placeholder='ETH'
                name='deposit'
                onChange={e => this.setState({ deposit: e.target.value })}
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

export default JoinChannelModal
