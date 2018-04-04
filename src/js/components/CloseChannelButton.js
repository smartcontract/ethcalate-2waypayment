import React, { Component } from 'react'
import { Container, Header, Grid, Accordion, Button } from 'semantic-ui-react'

class CloseChannelButton extends Component {

    handleJoinChannelClick () {
        return
    }

    render() {
        return (
            <Button onClick={this.handleJoinChannelClick}>Close Selected Channel</Button>
        )
    }

}

export default CloseChannelButton