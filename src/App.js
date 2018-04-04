/* globals state */
import React, { Component } from 'react'
import DesktopComponent from './js/components/DesktopComponent'

// import Ethcalate from 'ethcalate'
import Ethcalate from './ethcalate-client/src/'
import getWeb3 from './utils/getWeb3'

class App extends Component {
  state = {
    ethcalate: null,
    myChannels: []
  }

  async componentDidMount () {
    try {
      const results = await getWeb3
      await this.instantiateContract(results.web3)
      await this.getMyChannels()
    } catch (e) {
      console.log(e)
    }
  }

  async instantiateContract (web3) {
    const ethcalate = new Ethcalate(
      web3,
      '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf',
      'http://localhost:3000'
    )

    await ethcalate.initContract()
    console.log('ethcalate.account:', ethcalate.web3.eth.accounts[0])

    this.setState({
      ethcalate
    })
    console.log(
      'ethcalate.channelManager.address: ' + ethcalate.channelManager.address
    )
  }

  async getMyChannels () {
    const { ethcalate } = this.state
    const myChannels = await ethcalate.getMyChannels()

    console.log('myChannels: ', myChannels)
    this.setState({
      myChannels
    })
  }

  render () {
    const { ethcalate, myChannels } = this.state

    return (
      <div className='App'>
        <div>
          <DesktopComponent ethcalate={ethcalate} myChannels={myChannels} />
        </div>

      </div>
    )
  }
}

export default App
