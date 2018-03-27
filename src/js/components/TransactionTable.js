import React, { Component } from 'react'
import { Container, Header, Table } from 'semantic-ui-react'

class TransactionTable extends Component {
    render () {
        return (
            <div>
    `           <Container>
                    <Header
                        as='h3'
                        textAlign='center'
                        content='Your Channels'
                        style={{
                            fontSize: '1.5em',
                            fontWeight: 'normal',
                            marginBottom: 0,
                            marginTop: '2em'
                        }}
                    />
                    <Table className='ui cell striped table'>
                        <thead>
                            <tr><th>Counterparty</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th>Current Nonce</th>
                        </tr></thead>
                        <tbody>
                            <tr>
                                <td>Channel Counterparty Address Here 1</td>
                                <td>Channel Balance for participant  1</td>
                                <td>Status of the channel 1</td>
                                <td>Latest Channel Nonce Here 1</td>
                            </tr>
                            <tr>
                                <td>Channel Counterparty Address Here 2</td>
                                <td>Channel Balance for participant 2</td>
                                <td>Status of the channel 2</td>
                                <td>Latest Channel Nonce Here 2</td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>`
            </div>
        )
    }
}

export default TransactionTable;