import React, { Component } from 'react'
import ChannelManager from '../build/contracts/ChannelManager.json'
import getWeb3 from './utils/getWeb3'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      address: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  async instantiateContract() {
    const contract = require('truffle-contract')
    const channelManager = contract(ChannelManager)
    channelManager.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      const instance = await channelManager.deployed();
      address = instance.address;
    })
  }

  render() {
    return (
      <div className="App">
        {address}
      </div>
    );
  }
}

export default App
