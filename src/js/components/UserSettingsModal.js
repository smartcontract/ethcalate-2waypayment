import React, { Component } from 'react'
import { Button, Modal, Segment, Label, Input, Icon, Container } from 'semantic-ui-react'

class UserSettingsModal extends Component {
    state = {
        phoneNumber: null
    }

    async getPhoneNumber () {
        console.log('getPhoneNumber()')
        const { ethcalate } = this.props

        if (ethcalate) {
            console.log(ethcalate.web3.eth.accounts[0])
            // await ethcalate.updatePhone('4082396181')

        }

        //const account = ethcalate.web3.eth.accounts[0]
        //return account
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
}

export default UserSettingsModal
