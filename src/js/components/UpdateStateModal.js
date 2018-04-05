import React, { Component } from 'react'
import { Button, Modal, Form, Label, Input } from 'semantic-ui-react'

class UpdateStateModal extends Component {
  state = {
    amountToSend: 0
  }

  handleSubmit = async () => {
    const { ethcalate, channel } = this.props
    const { amountToSend } = this.state
    let { id, agentA, agentB, balanceA, balanceB } = channel

    if (ethcalate.web3.eth.accounts[0] === agentA) {
      balanceA =
        parseFloat(ethcalate.web3.fromWei(balanceA, 'ether')) -
        parseFloat(amountToSend)
      balanceB =
        parseFloat(ethcalate.web3.fromWei(balanceB, 'ether')) +
        parseFloat(amountToSend)
    } else if (ethcalate.web3.eth.accounts[0] === agentB) {
      balanceA =
        parseFloat(ethcalate.web3.fromWei(balanceA, 'ether')) +
        parseFloat(amountToSend)
      balanceB =
        parseFloat(ethcalate.web3.fromWei(balanceB, 'ether')) -
        parseFloat(amountToSend)
    }
    try {
      await ethcalate.updateState({
        channelId: id,
        balanceA: ethcalate.web3.toWei(balanceA, 'ether'),
        balanceB: ethcalate.web3.toWei(balanceB, 'ether')
      })
    } catch (e) {
      console.log(e)
    }
  }
  render () {
    return (
      <Modal
        size='small'
        dimmer='inverted'
        trigger={<Button>Send Money Shot</Button>}
        style={{ position: 'absolute', top: '50%', left: '20%' }}
      >
        <Modal.Header>Send Your Money Shot</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Label>Amount</Label>
              <Input
                type='number'
                placeholder='ETH'
                name='amountToSend'
                onChange={e => this.setState({ amountToSend: e.target.value })}
                step='0.0001'
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

export default UpdateStateModal
