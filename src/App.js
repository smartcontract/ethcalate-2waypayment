/* globals state */

// import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import ChannelManagerContract from '../build/contracts/ChannelManager.json'

import React, { Component } from 'react'
import DesktopComponent from './js/components/DesktopComponent'

import getWeb3 from './utils/getWeb3'

// import './css/oswald.css'
// import './css/open-sans.css'
// import './css/pure-min.css'
// import './App.css'

// import "semantic-ui-css/semantic.css"

class App extends Component {
  state = {
    storageValue: 0,
    web3: null
  }

  async componentWillMount () {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    try {
      const results = await getWeb3
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
    } catch (e) {
      console.log('Error finding web3.')
    }
  }

  instantiateContract () {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const channelManager = contract(ChannelManagerContract)
    channelManager.setProvider(this.state.web3.currentProvider)

    // const simpleStorage = contract(SimpleStorageContract)
    // simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts(async (error, accounts) => {
      if (error) {
        console.log(error)
        return
      }

      console.log(accounts)
      const channelManagerInstance = await channelManager.deployed()
      console.log(channelManagerInstance.address)

      // let simpleStorageInstance = await simpleStorage.deployed()
      // await simpleStorageInstance.set(5, {from: accounts[0]})
      // let value = await simpleStorageInstance.get.call(accounts[0])
      // this.setState({ storageValue: value.c[0] })
    })
  }

  render () {
    return (
      <div className='App'>

        <div>
          <DesktopComponent />
        </div>

      </div>
    )
  }
}

export default App
