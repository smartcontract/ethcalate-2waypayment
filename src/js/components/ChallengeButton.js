import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

class ChallengeButton extends Component {
  handleJoinChannelClick () {}

  render () {
    return (
      <Button onClick={this.handleJoinChannelClick}>Submit Evidence</Button>
    )
  }
}

export default ChallengeButton
