import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

class CloseChannelButton extends Component {
  handleCloseChannelClick = async () => {
    const { ethcalate, channelId } = this.props
    try {
      await ethcalate.startChallengePeriod(channelId)
    } catch (e) {
      console.log(e)
    }
  }

  render () {
    return (
      <Button onClick={this.handleCloseChannelClick}>
        Start Close Channel
      </Button>
    )
  }
}

export default CloseChannelButton
