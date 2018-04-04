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

class UpdateStateModal extends Component {
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
          <Label>Here is where stuff goes</Label>
        </Modal.Content>
      </Modal>
    )
  }
}

export default UpdateStateModal
