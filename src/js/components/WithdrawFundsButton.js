import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

class WithdrawFundsButton extends Component {
  handleWithdrawFundsClick = async () => {
    const { ethcalate, channelId } = this.props
    try {
      await ethcalate.closeChannel(channelId)
    } catch (e) {
      console.log(e)
    }
  }

  render () {
    return (
      <Button onClick={this.handleWithdrawFundsClick}>
        Withdraw Funds
      </Button>
    )
  }
}

export default WithdrawFundsButton
