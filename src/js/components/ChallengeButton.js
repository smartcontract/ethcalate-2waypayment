import React, { Component } from 'react'
import { Container, Header, Grid, Accordion, Button } from 'semantic-ui-react'

class ChallengeButton extends Component {

    handleJoinChannelClick () {
        return
    }

    render() {
        return (
            <Button onClick={this.handleJoinChannelClick}>Submit Evidence</Button>
        )
    }

}

export default ChallengeButton