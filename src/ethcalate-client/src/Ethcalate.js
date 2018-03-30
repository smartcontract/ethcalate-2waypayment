const axios = require('axios')
const check = require('check-types')
const getWeb3 = require('../web3')
const contract = require('truffle-contract')
const abi = require('ethereumjs-abi')
const artifacts = require('../../../build/contracts/ChannelManager.json')

module.exports = class Ethcalate {
  constructor (contractAddress, apiUrl) {
    this.contractAddress = contractAddress
    if (apiUrl) {
      this.apiUrl = apiUrl
    } else {
      this.apiUrl = 'http://localhost:3000'
    }
  }

  async initContract () {
    // init web3
    const result = await getWeb3
    this.web3 = result.web3
    this.account = this.web3.eth.accounts[0]

    // init channel manager
    const ChannelManager = contract(artifacts)
    ChannelManager.setProvider(this.web3.currentProvider)
    ChannelManager.defaults({ from: this.web3.eth.accounts[0] })

    // init instance
    let channelManager
    if (this.contractAddress) {
      channelManager = await ChannelManager.at(this.contractAddress)
    } else {
      channelManager = await ChannelManager.deployed()
    }
    this.channelManager = channelManager
  }

  async openChannel ({ to, depositInEth, challenge }) {
    if (!this.channelManager) {
      throw new Error('Please call initContract()')
    }
    check.assert.string(to, 'No counterparty address provided')
    check.assert.string(depositInEth, 'No initial deposit provided')
    check.assert.string(challenge, 'No challenge timer provided')

    const result = await this.channelManager.openChannel(to, challenge, {
      from: this.account,
      value: this.web3.toWei(depositInEth, 'ether')
    })
    console.log(result)
    return result
  }

  async joinChannel ({ channelId, depositInEth }) {
    if (!this.channelManager) {
      throw new Error('Please call initContract()')
    }
    check.assert.string(channelId, 'No channelId provided')
    check.assert.string(depositInEth, 'No initial deposit provided')

    const result = await this.channelManager.joinChannel(channelId, {
      from: this.web3.eth.accounts[0],
      value: this.web3.toWei(depositInEth, 'ether')
    })
    return result
  }

  async signTx ({ channelId, nonce, balanceA, balanceB }) {
    console.log(
      'channelId, nonce, balanceA, balanceB: ',
      channelId,
      nonce,
      balanceA,
      balanceB
    )
    // fingerprint = keccak256(channelId, nonce, balanceA, balanceB)
    let hash = abi
      .soliditySHA3(
        ['bytes32', 'uint256', 'uint256', 'uint256'],
        [channelId, nonce, balanceA, balanceB]
      )
      .toString('hex')
    hash = `0x${hash}`
    console.log('hash: ', hash)
    console.log('signer: ', this.web3.eth.accounts[0])
    const sig = new Promise((resolve, reject) => {
      this.web3.eth.sign(this.web3.eth.accounts[0], hash, (error, result) => {
        if (error) {
          reject(error)
        } else {
          console.log('result: ', result)
          resolve(result)
        }
      })
    })
    return sig
  }

  async updateState ({
    channelId,
    nonce,
    balanceA,
    balanceB,
    isAgentA // bool, if false, is AgentB
  }) {
    if (!this.channelManager) {
      throw new Error('Please call initContract()')
    }

    const sig = await this.signTx({ channelId, nonce, balanceA, balanceB })

    // set variables based on who signed it
    const sigA = isAgentA ? sig : ''
    const sigB = !isAgentA ? sig : ''
    const requireSigA = isAgentA
    const requireSigB = !isAgentA

    const response = await axios.post(`${this.apiUrl}/state`, {
      channelId,
      nonce,
      balanceA,
      balanceB,
      sigA,
      sigB,
      requireSigA,
      requireSigB
    })
    console.log('response: ', response)
    return response.data
  }

  async updatePhone (phone) {
    check.assert.string(phone, 'No phone number provided')
    const response = await axios.post(`${this.apiUrl}/updatePhone`, {
      address: this.account,
      phone: phone
    })
    return response.data
  }

  async getChannelStatus (channelID) {
    check.assert.string(channelID, 'No channelID provided')
    const response = await axios.post(`${this.apiUrl}/getChannelStatus`, {
      channelID
    })
    return response.data
  }

  async getUpdates (channelID, nonce) {
    check.assert.string(channelID, 'No phone number provided')
    if (!nonce) {
      nonce = 0
    }
    const statusResponse = await axios.post(`${this.apiUrl}/getChannelStatus`, {
      channelID
    })
    if (statusResponse.data.status !== 'open') {
      console.log('Status: ' + statusResponse.data.status)
    }

    const response = await axios.get(`${this.apiUrl}/state`, {
      channelID,
      nonce
    })
    return { data: response.data, status: statusResponse.data.status }
  }

  async getMyChannels () {
    const response = await axios.get(
      `${this.apiUrl}/channel?address=${this.account}`
    )
    if (response.data) {
      return response.data.channels.map(channel => {
        channel.depositA = this.web3.fromWei(channel.depositA, 'ether')
        channel.depositB = this.web3.fromWei(channel.depositB, 'ether')

        // if balances dont exist from stateUpdate, balance = deposit
        channel.balanceA = channel.balanceA
          ? channel.balanceA
          : channel.depositA
        channel.balanceB = channel.balanceB
          ? channel.balanceB
          : channel.depositB
        return channel
      })
    } else {
      return []
    }
  }

  async getChannelID (counterparty) {
    check.assert.string(counterparty, 'No counterparty account provided')
    const response = await axios.post(`${this.apiUrl}/getChannelID`, {
      address1: this.account,
      address2: counterparty
    })
    return response.data
  }
}
