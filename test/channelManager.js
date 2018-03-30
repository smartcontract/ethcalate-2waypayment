/* globals artifacts, contract, web3, it, assert */

const abi = require('ethereumjs-abi')
const BigNumber = require('bignumber.js')

const ChannelManager = artifacts.require('./ChannelManager.sol')
const ECTools = artifacts.require('./ECTools.sol')

function createTxHashToSign (activeId, nonce, balanceA, balanceB) {
  // fingerprint = keccak256(channelId, nonce, balanceA, balanceB)
  let hash = abi
    .soliditySHA3(
      ['bytes32', 'uint256', 'uint256', 'uint256'],
      [activeId, nonce, balanceA, balanceB]
    )
    .toString('hex')
  hash = `0x${hash}`
  return hash
}

contract('ChannelManager', async accounts => {
  it.only('should run a random test', async () => {
    const channelManager = await ChannelManager.deployed()
    const ecTools = await ECTools.deployed()
    const signer = await ecTools.recoverSigner(
      '0x392273c2a059fd1dffa02c93c5614b191c4180cd46eba53a0a76d66c387a9f89',
      '0x8e94f5c8cae1d2d0d4bb0b7e455f2ff9fc7dbb63f9d6f02fe03e652f64a3ee9738f9ad31bd6d8feb94f5a2ad63b7f0e889f1ce7d385d32ccb41416ab3606a1111b'
    )
    console.log(signer)
  })

  const AGENT_A = accounts[0]
  const AGENT_B = accounts[1]
  const DEPOSIT_A = web3.toWei(10, 'ether')
  const DEPOSIT_B = web3.toWei(20, 'ether')
  const CHALLENGE_PERIOD = 5
  const CHANNEL_STATUS = {
    OPEN: 0,
    CHALLENGE: 1,
    CLOSED: 2
  }

  it('should open a channel', async () => {
    const channelManager = await ChannelManager.deployed()
    await channelManager.openChannel(AGENT_B, CHALLENGE_PERIOD, {
      value: DEPOSIT_A,
      from: AGENT_A
    })

    const activeId = await channelManager.activeIds.call(AGENT_A, AGENT_B)
    const channel = await channelManager.getChannel(activeId)
    assert.equal(AGENT_A, channel[0])
    assert.equal(AGENT_B, channel[1])
    assert.equal(DEPOSIT_A, channel[2].toNumber())
  })

  it('should let channel be joined', async () => {
    const channelManager = await ChannelManager.deployed()
    const activeId = await channelManager.activeIds.call(AGENT_A, AGENT_B)
    await channelManager.joinChannel(activeId, {
      from: AGENT_B,
      value: DEPOSIT_B
    })
    const channel = await channelManager.getChannel(activeId)
    assert.equal(DEPOSIT_B, channel[3].toNumber())
  })

  it('should recognize a valid double signed transaction', async () => {
    const FROMATOB = web3.toWei(1, 'ether')
    const NONCE = 1

    const channelManager = await ChannelManager.deployed()
    const activeId = await channelManager.activeIds.call(AGENT_A, AGENT_B)

    this.balanceA = new BigNumber(DEPOSIT_A).minus(new BigNumber(FROMATOB))
    this.balanceB = new BigNumber(DEPOSIT_B).plus(new BigNumber(FROMATOB))

    const hash = createTxHashToSign(
      activeId,
      NONCE,
      this.balanceA.toString(),
      this.balanceB.toString()
    )

    const sigA = web3.eth.sign(AGENT_A, hash)
    const sigB = web3.eth.sign(AGENT_B, hash)
    const isValid = await channelManager.isValidStateUpdate.call(
      activeId,
      NONCE,
      this.balanceA.toString(),
      this.balanceB.toString(),
      sigA,
      sigB,
      true,
      true
    )

    assert.equal(isValid, true)
  })

  it('should recognize a valid single signed transaction from agentA', async () => {
    const FROMATOB = web3.toWei(0.5, 'ether')
    const NONCE = 1

    const channelManager = await ChannelManager.deployed()
    const activeId = await channelManager.activeIds.call(AGENT_A, AGENT_B)

    const balanceA = new BigNumber(this.balanceA).minus(new BigNumber(FROMATOB))
    const balanceB = new BigNumber(this.balanceB).plus(new BigNumber(FROMATOB))

    const hash = createTxHashToSign(
      activeId,
      NONCE,
      balanceA.toString(),
      balanceB.toString()
    )

    const sigA = web3.eth.sign(AGENT_A, hash)
    const isValid = await channelManager.isValidStateUpdate.call(
      activeId,
      NONCE,
      balanceA.toString(),
      balanceB.toString(),
      sigA,
      '',
      true,
      false
    )

    assert.equal(isValid, true)
  })

  it('should recognize a valid single signed transaction from agentB', async () => {
    const FROMATOB = web3.toWei(0.5, 'ether')
    const NONCE = 1

    const channelManager = await ChannelManager.deployed()
    const activeId = await channelManager.activeIds.call(AGENT_A, AGENT_B)

    const balanceA = new BigNumber(this.balanceA).minus(new BigNumber(FROMATOB))
    const balanceB = new BigNumber(this.balanceB).plus(new BigNumber(FROMATOB))

    const hash = createTxHashToSign(
      activeId,
      NONCE,
      balanceA.toString(),
      balanceB.toString()
    )

    const sigB = web3.eth.sign(AGENT_B, hash)
    const isValid = await channelManager.isValidStateUpdate.call(
      activeId,
      NONCE,
      balanceA.toString(),
      balanceB.toString(),
      '',
      sigB,
      false,
      true
    )

    assert.equal(isValid, true)
  })

  it('should start challenge period and accept state updates', async () => {
    const FROMBTOA = web3.toWei(3, 'ether')
    const NONCE = 2

    const channelManager = await ChannelManager.deployed()
    const activeId = await channelManager.activeIds.call(AGENT_A, AGENT_B)

    let balanceA = new BigNumber(this.balanceA).plus(new BigNumber(FROMBTOA))
    let balanceB = new BigNumber(this.balanceB).minus(new BigNumber(FROMBTOA))

    let hash = createTxHashToSign(
      activeId,
      NONCE,
      balanceA.toString(),
      balanceB.toString()
    )

    let sigA = web3.eth.sign(AGENT_A, hash)
    let sigB = web3.eth.sign(AGENT_B, hash)

    // start challenge with latest double signed tx hash
    await channelManager.startChallenge(
      activeId,
      NONCE,
      balanceA.toString(),
      balanceB.toString(),
      sigA,
      sigB,
      { from: AGENT_B }
    )

    let channel = await channelManager.getChannel(activeId)

    assert.equal(channel[4].toNumber(), CHANNEL_STATUS.CHALLENGE) // status

    // check on chain state updates
    assert.equal(channel[6].toNumber(), NONCE) // nonce
    assert.equal(channel[8].toString(), balanceA.toString())
    assert.equal(channel[9].toString(), balanceB.toString())

    /// /////////////////////////////////////////////
    // new tx during challenge period is still valid
    /// /////////////////////////////////////////////

    balanceA = new BigNumber(this.balanceA).plus(new BigNumber(FROMBTOA))
    balanceB = new BigNumber(this.balanceB).minus(new BigNumber(FROMBTOA))

    hash = createTxHashToSign(
      activeId,
      NONCE + 1,
      balanceA.toString(),
      balanceB.toString()
    )

    sigA = web3.eth.sign(AGENT_A, hash)
    sigB = web3.eth.sign(AGENT_B, hash)

    await channelManager.updateState(
      activeId,
      NONCE + 1, // update with higher nonce
      balanceA.toString(),
      balanceB.toString(),
      sigA,
      sigB,
      { from: AGENT_A }
    )

    channel = await channelManager.getChannel(activeId)
    // check on chain state updates
    assert.equal(channel[6].toNumber(), NONCE + 1) // nonce
    assert.equal(channel[8].toString(), balanceA.toString())
    assert.equal(channel[9].toString(), balanceB.toString())

    // finish challenge period
    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, CHALLENGE_PERIOD * 1000)
    })
  })

  it('should close channel after challenge period', async () => {
    const channelManager = await ChannelManager.deployed()
    const activeId = await channelManager.activeIds.call(AGENT_A, AGENT_B)

    const startingBalanceA = web3.eth.getBalance(AGENT_A)
    const startingBalanceB = web3.eth.getBalance(AGENT_B)

    const channel = await channelManager.getChannel(activeId)

    await channelManager.closeChannel(activeId, {
      from: AGENT_B
    })

    const endingBalanceA = web3.eth.getBalance(AGENT_A)
    const endingBalanceB = web3.eth.getBalance(AGENT_B)

    const differenceA = web3.fromWei(
      endingBalanceA.toNumber() - startingBalanceA.toNumber(),
      'ether'
    )
    console.log('differenceA: ', differenceA)

    const differenceB = web3.fromWei(
      endingBalanceB.toNumber() - startingBalanceB.toNumber(),
      'ether'
    )
    console.log('differenceB: ', differenceB)

    // round up to account for gas costs
    assert.equal(
      web3.toWei(Math.ceil(differenceA), 'ether'),
      channel[8].toNumber()
    )

    assert.equal(
      web3.toWei(Math.ceil(differenceB), 'ether'),
      channel[9].toNumber()
    )
  })
})
