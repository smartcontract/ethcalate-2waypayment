import React, { Component } from 'react'
import { Table, Container } from 'semantic-ui-react'

class TransactionTable extends Component {
  transactionEntry (_sender, _recipient, _nonce, _bal) {
    return (
      <tr>
        <td>{_nonce}</td>
        <td>{_sender}</td>
        <td>{_recipient}</td>
        <td>{_bal}</td>
      </tr>
    )
  }

  render () {
    return (
      <div>
        <Container>
          <Table className='ui cell striped table'>
            <thead>
              <tr>
                <th>Transaction Number</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody />
          </Table>
        </Container>
      </div>
    )
  }
}

export default TransactionTable
