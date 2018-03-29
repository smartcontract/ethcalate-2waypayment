import React, { Component } from 'react'
import { Button, Modal, Form, Label, Input, Header } from 'semantic-ui-react'


class NewChannelModal extends Component{
    state = {
        newCounterparty: null,
        challengePeriod: null,
        stake: null,
        submittedStake: null,
        submittedParty: null,
        submittedChallengePeriod: null,
        channelManagerAddress: null
    }

    async componentWillReceiveProps (nextProps) {
        if (nextProps.channelManager) {
            try {
                const channelManagerInstance = await nextProps.channelManager.deployed()
                this.setState({ channelManagerAddress: channelManagerInstance.address })
            } catch(e) {
                console.log(e)
            }
        }
    }

    createNewChannel = async () => {
        console.log('createNewChannel')
        const {
            newCounterparty,
            challengePeriod,
            stake,
            channelManagerAddress
        } = this.state

        const {
            web3,
            web3detected,
            accountAddress,
            channelManager
        } = this.props        

        const channelManagerInstance = await channelManager.deployed()
        // create new channel with params
        //const amount = web3.toWei(stake, "ether")
        channelManagerInstance.openChannel(newCounterparty, challengePeriod, web3.toWei(stake, "ether"))
    }

    handleChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        this.setState({ [name] : value })
    }

    handleSubmit = () => {
        const { newCounterparty, challengePeriod, stake } = this.state
        this.setState({ submittedParty: newCounterparty, submittedChallengePeriod: challengePeriod, submittedStake: stake })
        this.createNewChannel()
    }

    render() {
        const {
            web3,
            web3detected,
            accountAddress,
            channelManager
        } = this.props

        // const {
        //     newCounterparty,
        //     challengePeriod,
        //     stake
        // } = this.state

        return (
            <Modal small inverted trigger={<Button>Open a New Channel</Button>} style={{position:'absolute', top:'50%', left:'20%'}}>
                <Modal.Header>Enter Channel Information</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <Label>Counterparty</Label>
                            <Input type='text' placeholder='Ideally a friend' name='newCounterparty' onChange={this.handleChange}></Input>
                        </Form.Field>
                        <Form.Field>
                            <Label>Challenge Period (seconds)</Label>
                            <Input type='number' placeholder='We recommend 86400s (1 day)' name='challengePeriod' onChange={this.handleChange}></Input>
                        </Form.Field>
                        <Form.Field>
                            <Label>Channel Stake</Label>
                            <Input type='number' placeholder='ETH' name='stake' onChange={this.handleChange}></Input>
                        </Form.Field>
                        <Button verticalAlign='center' type='submit' onClick={this.handleSubmit}>Open</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

export default NewChannelModal