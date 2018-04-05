import React, { Component } from 'react'
import { Modal, Label, Icon } from 'semantic-ui-react'

class UserSettingsModal extends Component {
  state = {
    phoneNumber: null
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
