/* globals artifacts, contract, web3, it, assert */

const abi = require('ethereumjs-abi')

const ChannelManager = artifacts.require('./ChannelManager.sol')

contract('ChannelManager', async accounts => {
  const AGENT_A = accounts[0]
  const AGENT_B = accounts[1]
  const DEPOSIT_A = web3.toWei(1, 'ether')
  const DEPOSIT_B = web3.toWei(2, 'ether')

  it('should open a channel', async () => {
    const channelManager = await ChannelManager.deployed()
    await channelManager.openChannel(AGENT_B, 10, {
      value: DEPOSIT_A,
      from: AGENT_A
    })

    const activeId = await channelManager.active_ids.call(AGENT_A, AGENT_B)
    const channel = await channelManager.getChannel(activeId)
    assert.equal(AGENT_A, channel[0])
    assert.equal(AGENT_B, channel[1])
    assert.equal(DEPOSIT_A, channel[2].toNumber())
  })

  it('should let channel be joined', async () => {
    const channelManager = await ChannelManager.deployed()
    const activeId = await channelManager.active_ids.call(AGENT_A, AGENT_B)
    await channelManager.joinChannel(activeId, {
      from: AGENT_B,
      value: DEPOSIT_B
    })
    const channel = await channelManager.getChannel(activeId)
    assert.equal(DEPOSIT_B, channel[3].toNumber())
  })

  it('should recognize a valid double signed transaction', async () => {
    const FROMATOB = web3.toWei(0.5, 'ether')
    const NONCE = 1

    const channelManager = await ChannelManager.deployed()
    const activeId = await channelManager.active_ids.call(AGENT_A, AGENT_B)

    // do math in ether to be nice to JS
    let balanceA =
      web3.fromWei(DEPOSIT_A, 'ether') - web3.fromWei(FROMATOB, 'ether')
    balanceA = web3.toWei(balanceA, 'ether')

    // parse floats or else JS concatenates as strings...
    let balanceB =
      parseFloat(web3.fromWei(DEPOSIT_B, 'ether')) +
      parseFloat(web3.fromWei(FROMATOB, 'ether'))

    balanceB = web3.toWei(balanceB, 'ether')

    // fingerprint = keccak256(channelId, nonce, balanceA, balanceB)
    let hash = abi
      .soliditySHA3(
        ['bytes32', 'uint256', 'uint256', 'uint256'],
        [activeId, NONCE, balanceA, balanceB]
      )
      .toString('hex')
    hash = `0x${hash}`

    const sigA = web3.eth.sign(AGENT_A, hash)
    const sigB = web3.eth.sign(AGENT_B, hash)
    const isValid = await channelManager.isValidStateUpdate.call(
      activeId,
      NONCE,
      balanceA,
      balanceB,
      sigA,
      sigB
    )

    assert.equal(isValid, true)
  })
})
