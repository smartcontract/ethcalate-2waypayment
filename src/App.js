import React, { Component } from 'react'
import DesktopComponent from './js/components/DesktopComponent'

// import Ethcalate from 'ethcalate'
import Ethcalate from './ethcalate-client/src/'
import getWeb3 from './utils/getWeb3'

class App extends Component {
  state = {
    ethcalate: null,
    myChannels: [],
    fetching: true
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
      '0x4e72770760c011647d4873f60a3cf6cdea896cd8',
      'http://localhost:3000'
    )

    await ethcalate.initContract()
    console.log('ethcalate.web3.eth.accounts[0]:', ethcalate.web3.eth.accounts[0])

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

    console.log('App:myChannels: ', myChannels)
    this.setState({
      myChannels: myChannels,
      fetching: false
    })
  }

  render () {
    const { ethcalate, myChannels, fetching } = this.state

    return (
      <div className='App'>
        <div>
          <DesktopComponent 
            ethcalate={ethcalate} 
            myChannels={myChannels} 
            fetching={fetching}
          />
        </div>

      </div>
    )
  }
}

export default App
