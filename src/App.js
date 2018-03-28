/* globals state */

import React, { Component } from 'react'
import ChannelManagerContract from '../build/contracts/ChannelManager.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

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

    // Get accounts.
    this.state.web3.eth.getAccounts(async (error, accounts) => {
      if (error) {
        console.log(error)
        return
      }
      console.log(accounts)
      const channelManagerInstance = await channelManager.deployed()
      console.log(channelManagerInstance.address)
    })
  }

  render () {
    return (
      <div className='App'>
        <nav className='navbar pure-menu pure-menu-horizontal'>
          <a href='#' className='pure-menu-heading pure-menu-link'>
            Truffle Box
          </a>
        </nav>

        <main className='container'>
          <div className='pure-g'>
            <div className='pure-u-1-1'>
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>
                If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).
              </p>
              <p>
                Try changing the value stored on
                {' '}
                <strong>line 59</strong>
                {' '}
                of App.js.
              </p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default App
