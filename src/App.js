/* globals state */
//import { Drizzle, generateStore } from 'drizzle'

import ChannelManagerContract from '../build/contracts/ChannelManager.json'

import React, { Component } from 'react'
import DesktopComponent from './js/components/DesktopComponent'

import getWeb3 from './utils/getWeb3'

// setup drizzle for react components
// const options = {
//   contracts: [
//     ChannelManagerContract
//   ]
// }
// const drizzleStore = generateStore(this.props.options)
// const drizzle = new Drizzle(this.props.options, drizzleStore)

class App extends Component {
  state = {
    web3: null
  }

  async componentWillMount () {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    try {
      const results = await getWeb3
      this.setState({
        web3: results.web3,
        web3detected: 'true',
        accountAddress: results.web3.eth.accounts[0]
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
    channelManager.defaults({ from: this.state.web3.eth.accounts[0]})
    this.setState({
      channelManager : channelManager
    })

    // const simpleStorage = contract(SimpleStorageContract)
    // simpleStorage.setProvider(this.state.web3.currentProvider)

    // // Get accounts.
    // this.state.web3.eth.getAccounts(async (error, accounts) => {
    //   if (error) {
    //     console.log(error)
    //     return
    //   }

    //   console.log(accounts)
    //   const channelManagerInstance = await channelManager.deployed()
    //   this.setState({
    //     channelManagerInstance : channelManagerInstance,
    //     channelManagerAddress : channelManagerInstance.address
    //   })
    //   console.log(channelManagerInstance.address)
    // })
  }

  render () {
    const {
      web3,
      web3detected,
      accountAddress,
      channelManager
    } = this.state


    return (
      <div className='App'>
                
        <div>
          <DesktopComponent 
            web3={web3} 
            web3detected={web3detected}
            accountAddress={accountAddress}
            channelManager={channelManager}
          />
        </div>
      
      </div>
    )
  }
}

export default App
