import React, { Component } from 'react'
import { Container, Header, Grid, Accordion } from 'semantic-ui-react'
import TransactionTable from './TransactionTable';

class ChannelAccordion extends Component {
    state = { activeIndex: 0 }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render () {
        const { activeIndex } = this.state
        
        return (
            <div>
               <Container>
                    <Header
                        as='h3'
                        textAlign='center'
                        content='Your Channels'
                        style={{
                            fontSize: '1.5em',
                            fontWeight: 'normal',
                            marginBottom: '1em',
                            marginTop: '2em'
                        }}
                    />

                    <Accordion fluid styled>
                        <Accordion.Title active={activeIndex===0} index={0} onClick={this.handleClick}>
                            <Grid centered celled>
                                <Grid.Row columns='equal'>
                                    <Grid.Column>Counterparty</Grid.Column>
                                    <Grid.Column>Balance</Grid.Column>
                                    <Grid.Column>Status</Grid.Column>
                                    <Grid.Column>Nonce</Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex===0}>
                            <TransactionTable />
                        </Accordion.Content>

                        <Accordion.Title active={activeIndex===1} index={1} onClick={this.handleClick}>
                            <Grid centered celled>
                                <Grid.Row columns='equal'>
                                    <Grid.Column>Counterparty</Grid.Column>
                                    <Grid.Column>Balance</Grid.Column>
                                    <Grid.Column>Status</Grid.Column>
                                    <Grid.Column>Nonce</Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex===1}>
                            <TransactionTable />
                        </Accordion.Content>
                    
                    </Accordion>
                </Container>
            </div>
        )
    }
}

export default ChannelAccordion;