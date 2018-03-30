import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

class CloseButton extends Component {
  state = {}

  render () {
    const isChannelSelected = false

    return (
      <div>
        <Button disabled={!isChannelSelected}>Close Selected Channel</Button>
      </div>
    )
  }
}

export default CloseButton
