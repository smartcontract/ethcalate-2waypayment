/* globals artifacts */
const ChannelManager = artifacts.require('./ChannelManager.sol')

module.exports = function (deployer) {
  deployer.deploy(ChannelManager)
}
