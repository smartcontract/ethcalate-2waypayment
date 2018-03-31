# ethcalate-2waypayment

Ethcalate creates containerized state channels for dapps. This repo contains a basic bidirectional payment channel contract and a test decentralized application, MoneyShot. 2waypayment is currently being used in the Ethcalate platform MVP but will eventually be refactored into a more generalized channel manager with counterfactually instantiated interpreters.

This repository is primarily for community feedback and to set up our tutorial dapp once that is completed. To use the full Ethcalate MVP platform, we highly recommend connecting to our server hub and pre-deployed contracts by cloning the Ethcalate-client repo or downloading the corresponding npm package.

## Background on State Channels

State channels are an off-chain (layer 2) scaling solution for blockchains. In the simplest case, two agents, Alice and Bob, can send payments to each other while minimizing gas costs and transaction confirmation times. This is called a payment channel, and works similarly to existing implementations such as the Lightning Network on the Bitcoin blockchain and microRaiden on Ethereum.

Using a payment channel requires Alice and Bob to both agree to lock up some funds in a smart contract. These funds act as the working capital and each party's "stake" is the maximum amount that they can pay to the counterparty.

After locking funds, Alice and Bob move their interactions off chain. Whenever Alice wants to send a transaction to Bob (or vice versa), Alice generates an update to the balance, signs it using her private key and sends it to Bob. Bob can then choose to accept the balance update or not, usually by accounting for the new balance in his own signed balance updates in the future.

Note that while Alice and Bob are passing signed updates back and forth, the staked funds remain where they are on chain. To finalize the balance updates and unlock their funds, Alice and Bob have to close the channel. This is done with a balance update that is signed by both parties. Note: since the sender of a transaction is always signing, the receiver of a transaction can choose to close the channel at any time just by signing that update themselves. This dramatically reduces UX complexity, since the receiver does not have to sign every single balance update, just the one which they want to close with.

If all it takes is a double signed message to close the channel, what stops Bob or Alice from attempting to close the channel with an old message? To deal with this sort of dispute, each signed message contains an incrementing value called a nonce where transactions with higher nonces are more recent. When a channel close process is initiated, the channel enters into a "challenge" state, where either party can continue to submit double signed balance updates (if they have a higher nonce) for a period of time. This negates the efficacy of trying to close the channel with an old balance.

## ChannelManager.sol Explanation

ChannelManager.sol is the primary instantiator contract for new bidirectional channels. The testnet contract is deployed to Rinkeby at

```0x35cc32f52e4fa612c8e13ec270be61403196d4d9```

### openChannel()
Inputs: `address to, uint challenge` 
Modifiers: `payable public`
Output:
Notes:
`openChannel` can be called by any address to create a new channel. For now, the function takes the "from" address from `msg.sender`, though this will be generalized later to any signing party. Note: the stake/deposit for the channel creator (address 1) is sent when calling the function. The stake/deposit for the counterparty (address 2) is sent in the `joinChannel()` function below.

`challenge` represents the amount of time that the challenge period will run for.

`openChannel` generates a `channelID` when it is called and emits an event, `ChannelOpen(id, channel.agentA, channel.agentB, channel.depositA)`

### joinChannel()
Inputs: `bytes32 id` (this is channelID)
Modifiers: `payable public`
Output:
Notes:
`joinChannel` allows the counterparty, address 2, to stake funds into the channel to allow it to be bidirectional. When the function is called, it emits an event `ChannelJoin(id, channel.agentA, channel.agentB, channel.depositA, channel.depositB)`

### isValidStateUpdate()
Inputs: `bytes32 channelId, uint256 nonce, uint256 balanceA, uint256 balanceB, string sigA, string sigB, bool requireSigA, bool requireSigB`
Modifiers: `public view`
Output: `bool`
Notes:
Helper that can be used internally and externally to check a signed state update.

### updateState()
Inputs: `bytes32 channelId, uint256 nonce, uint256 balanceA, uint256 balanceB, string sigA, string sigB`
Modifiers: `public`
Output:
Notes:
`updateState` updates state using `isValidStateUpdate()`. If the channel is not being closed, this can be used to "checkpoint" the channel

### startChallenge()
Inputs: `bytes32 channelID, uint256 nonce, uint256 balanceA, uint256 balanceB, string sigA, string sigB`
Modifiers: `public`
Output:
Notes:
Initiates the challenge period prior to closing the channel. `startChallenge()` must be called explicitly for now. When the challenge period begins, the challenge timeout will be set to current block time + the challenge time specified in `openChallenge`.

Emits an event ` ChannelChallenge(channelId, nonce);`

### closeChannel()
Inputs: `bytes32 channelId`
Modifiers: `public`
Output:
Notes:
Closes the channel after the timeout period ends. Must be called to close the channel (by one of the two members of the channel). Close channel just deletes the channel from the listed channels, so it's just good practice for cleanup.

### getChannel()
Inputs: `bytes32 id`
Modifiers: `public view`
Output: `address, address, uint, uint, uint, uint, uint, uint, uint, uint`
Notes:
Basic getter for channel info. Returns addresses of participants, depositA, depositB, channel status (open, challenge, close), nonce, closeTime, balanceA, balanceB

## Contributing

We welcome any contributions and feedback to our code! 

To make a contribution, please first open a github issue with a description of the changes that need to be made. Then, submit a pull request referencing the issue.

All pull requests must be based off the master branch.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Spankchain's General State Channels Repo: https://github.com/nginnever/general-state-channels
* Jehan Tremback's Universal State Channels Repo: https://github.com/jtremback/universal-state-channels
