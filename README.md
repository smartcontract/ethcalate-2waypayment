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

TO DO

## Contributing

We welcome any contributions and feedback to our code! 

To make a contribution, please first open a github issue with a description of the changes that need to be made. Then, submit a pull request referencing the issue.

All pull requests must be based off the master branch.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Spankchain's General State Channels Repo: https://github.com/nginnever/general-state-channels
* Jehan Tremback's Universal State Channels Repo: https://github.com/jtremback/universal-state-channels
