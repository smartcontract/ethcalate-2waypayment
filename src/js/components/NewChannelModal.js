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
        // Get accounts.
        nextProps.web3.eth.getAccounts(async (error, accounts) => {
            if (error) {
                console.log(error)
                return
            }

            console.log(accounts)
            const channelManagerInstance = await nextProps.channelManager.deployed()
            console.log(channelManagerInstance.address)
            this.setState({ channelManagerAddress: channelManagerInstance.address })
        })
    }

    createNewChannel = async () => {
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

        // get accounts
        const channelManagerInstance = await channelManager.deployed()
        // create new channel with params
        channelManagerInstance.openChannel.call(newCounterparty, challengePeriod, stake, { from: accountAddress })

    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = () => {
        const { newCounterparty, challengePeriod, stake } = this.state
        this.setState({ submittedParty: newCounterparty, submittedChallengePeriod: challengePeriod, submittedStake: stake })
        this.createNewChannel()
    }

    render() {
        // const {
        //     web3,
        //     web3detected,
        //     accountAddress,
        //     channelManager
        // } = this.props

        // const {
        //     newCounterparty,
        //     challengePeriod,
        //     stake
        // } = this.state

        return (
            <Modal small inverted trigger={<Button>Open a New Channel</Button>} style={{position:'absolute', top:'50%', left:'20%'}}>
                <Modal.Header>Enter New Channel Details</Modal.Header>
                <Modal.Content content>
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
                        <Button verticalAlign='center' type='submit'>Open</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

export default NewChannelModal