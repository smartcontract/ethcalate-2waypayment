import React, { Component } from 'react'
import {
  Button,
  Modal,
  Segment,
  Label,
  Input,
  Icon,
  Container
} from 'semantic-ui-react'

class UserSettingsModal extends Component {
  state = {
    phoneNumber: null
  }

  getPhoneNumber () {
    console.log('getPhoneNumber()')
    const { ethcalate } = this.props

    if (ethcalate) {
      console.log(ethcalate.web3.eth.accounts[0])
      // await ethcalate.updatePhone('4082396181')
    }

<<<<<<< HEAD
    render () {
        return (
          <Modal
            size='small'
            dimmer='inverted'
            trigger={
                <Label>
                    <Icon className='cogs' />
                    Settings
                </Label>
            }
            style={{ position: 'absolute', top: '50%', left: '20%' }}
          >
            <Modal.Header>Settings</Modal.Header>
            <Modal.Content>
              <Label>Insert Phone Number Here</Label>
            </Modal.Content>
          </Modal>
        )
      }
=======
    // const account = ethcalate.web3.eth.accounts[0]
    // return account
    return '1234'
  }

  render () {
    return (
      <Modal
        size='small'
        dimmer='inverted'
        trigger={
          <Label>
            <Icon className='cogs' />
            Settings
          </Label>
        }
        style={{ position: 'absolute', top: '50%', left: '20%' }}
      >
        <Modal.Header>Settings</Modal.Header>
        <Modal.Content>
          <Label>{this.getPhoneNumber()}</Label>
        </Modal.Content>
      </Modal>
    )
  }
>>>>>>> afc0769b79084038064af47703828c29edafd9dc
}

export default UserSettingsModal
