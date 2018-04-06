import React, { Component } from 'react'
import { Table, Modal, Button } from 'semantic-ui-react'

class TransactionModal extends Component {
  state = {
    transactions: []
  }

  fetchTransactions = async channelId => {
    const { ethcalate } = this.props
    let transactions = await ethcalate.getTransactions(channelId)
    transactions = transactions.map(t => {
      t.balanceA = t.balanceA
        ? parseFloat(ethcalate.web3.fromWei(t.balanceA, 'ether')).toFixed(4)
        : 0
      t.balanceB = t.balanceB
        ? parseFloat(ethcalate.web3.fromWei(t.balanceB, 'ether')).toFixed(4)
        : 0
      return t
    })
    this.setState({ transactions })
  }

  transactionEntry ({ balanceA, balanceB, nonce }) {
    return (
      <tr key={nonce}>
        <td>{nonce}</td>
        <td>{balanceA}</td>
        <td>{balanceB}</td>
      </tr>
    )
  }

  render () {
    const { channelId } = this.props
    const { transactions } = this.state
    return (
      <Modal
        size='small'
        dimmer='inverted'
        trigger={<Button>View Transactions</Button>}
        style={{ position: 'absolute', top: '50%', left: '20%' }}
        onOpen={() => this.fetchTransactions(channelId)}
      >
        <Modal.Header>Transactions</Modal.Header>
        <Modal.Content scrolling>
          <Table className='ui cell striped table'>
            <thead>
              <tr>
                <th>Transaction Number</th>
                <th>My Balance</th>
                <th>Their Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => {
                return this.transactionEntry(t)
              })}
            </tbody>
          </Table>
        </Modal.Content>
      </Modal>
    )
  }
}

export default TransactionModal
