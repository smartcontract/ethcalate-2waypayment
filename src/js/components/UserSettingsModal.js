import React, { Component } from 'react'
import { Button, Modal, Label, Input, Icon, Form } from 'semantic-ui-react'

class UserSettingsModal extends Component {
  state = {
    name: null,
    address: null,
    phoneNumber: null,
    modalOpen: false
  }

  async getDetails () {
    const { ethcalate } = this.props

    if (ethcalate) {
      let response = await ethcalate.getMyDetails()
      this.setState({
        name: response.user.name,
        address: ethcalate.web3.eth.accounts[0],
        phoneNumber: response.user.number
      })
    }
  }

  async updateDetails (name, phoneNumber) {
    const { ethcalate } = this.props
    if (ethcalate) {
      try {
        await ethcalate.updateName(name)
        if (phoneNumber) {
          await ethcalate.updatePhone(phoneNumber)
        }
      } catch (e) {
        return e
      }
    }
  }

  handleOpen = () => {
    this.getDetails()
    this.setState({ modalOpen: true })
  }

  handleClose = () => {
    // close modal
    this.setState({ modalOpen: false })
  }

  handleSubmit = async () => {
    const { name, phoneNumber } = this.state
    let response = await this.updateDetails(name, phoneNumber)
    if (response) {
      console.log({ response })
    } else {
      this.setState({
        name,
        phoneNumber
      })
    }

    this.handleClose()
  }

  render () {
    return (
      <Modal
        size='small'
        dimmer='inverted'
        open={this.state.modalOpen}
        onClose={this.handleClose}
        trigger={
          <Button onClick={this.handleOpen}>
            <Icon className='cogs' />
            Settings
          </Button>
        }
        style={{ position: 'absolute', top: '90%', right: '20%' }}
      >
        <Modal.Header>Settings</Modal.Header>
        <Modal.Content>
          <Label>{this.state.address}</Label>
          <Label>{this.state.name}</Label>
          <Label>{this.state.phoneNumber}</Label>
          <Form>
            <Form.Field>
              <Label>Update Nickname</Label>
              <Input
                type='text'
                placeholder='Pick a unique nickname'
                name='name'
              />
            </Form.Field>

            <Form.Field>
              <Label>Phone number</Label>
              <Input
                type='text'
                placeholder='(000)000-0000'
                name='phoneNumber'
              />
            </Form.Field>

            <Button type='submit' onClick={this.handleSubmit}>
              Update
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

export default UserSettingsModal
