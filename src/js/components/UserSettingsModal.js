import React, { Component } from 'react'
import { Modal, Label, Icon } from 'semantic-ui-react'

class UserSettingsModal extends Component {
<<<<<<< HEAD
    state = {
        phoneNumber: null
    }

    getPhoneNumber () {
        console.log('getPhoneNumber()')
        const { ethcalate } = this.props
=======
  state = {
    phoneNumber: null
  }

  getPhoneNumber () {
    return '1234'
  }
>>>>>>> 56106b84ccc11e474899e157ed8fcdbd693885e8

        if (ethcalate) {
        console.log(ethcalate.web3.eth.accounts[0])
        // await ethcalate.updatePhone('4082396181')
        }
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
                <Label>Insert Phone Number Here</Label>
            </Modal.Content>
            </Modal>
        )
    }
}

export default UserSettingsModal
