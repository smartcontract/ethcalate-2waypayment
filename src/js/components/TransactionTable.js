import React, { Component } from 'react'
import { Table, Container } from 'semantic-ui-react'

class TransactionTable extends Component {

    transactionEntry(_nonce, _bal) {
        let sender = 'senderAddress'
        let recipient = 'recipientAddress'
        return (
            <tr>
                <td>{_nonce}</td>
                <td>{sender}</td>
                <td>{recipient}</td>
                <td>{_bal}</td>
            </tr>
        )
    }

    render() {
        const txEntry = this.transactionEntry(1, '5 ETH')
        
        return (
            <div>
               <Container>
                    <Table className='ui cell striped table'>
                        <thead>
                            <tr><th>Transaction Number</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Value</th>
                        </tr></thead>
                        <tbody>
                            { txEntry }
                            { txEntry }
                        </tbody>
                    </Table>
                </Container>`
            </div>
        )
    }
}

export default TransactionTable;