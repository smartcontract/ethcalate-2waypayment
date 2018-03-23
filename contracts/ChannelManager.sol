pragma solidity ^0.4.18;

contract ChannelManager {
    struct Channel {
        address agentA;
        address agentB;
        address token;
        uint depositA; // Deposit of agent A
        uint depositB; // Deposit of agent B
        bool openA; // True if A->B is open
        bool openB; // True if B->A is open
        uint challenge;
        uint nonce;
        uint closeTime;
        uint valueBtoA; // for challenge
        uint valueAtoB; // for challenge
    }

    Channel public channel;

    function openChannel(address to, uint challenge) payable public {
        channel.agentA = msg.sender;
        channel.agentB = to;
        channel.depositA = msg.value;
        channel.openA = true;
        channel.openB = true;
        channel.challenge = challenge;
    }

    function addDeposit() payable public {
        if (channel.agentA == msg.sender && channel.openA == true) {
            channel.depositA += msg.value;
        } else if (channel.agentB == msg.sender && channel.openB == true) {
            channel.depositB += msg.value;
        } else {
            assert(false);
        }
    }

    function closeChannel(bytes32[4] h, uint8 v, uint256 value, uint256 nonce) public {
        // h[0]    Channel id
        // h[1]    Hash of (id, value)
        // h[2]    r of signature
        // h[3]    s of signature
        require(msg.sender == channel.agentA || msg.sender != channel.agentB);

        // Get the message signer and construct a proof
        address signer = ecrecover(h[1], v, h[2], h[3]);
        bytes32 proof = keccak256(h[0], value);

        // Make sure the hash provided is of the channel id and the amount sent
        // Ensure the proof matches, send the value, send the remainder, and delete the channel
        require(proof == h[1]);

        if (msg.sender == channel.agentA && signer == channel.agentB) {
            if (channel.challenge == 0) {
                // If there's no challenge period, close out the channel immediately.

                // Close out the B->A side of the channel
                require(value <= channel.depositB);
                channel.agentA.transfer(channel.depositB - value);

                // Close this side of the channel
                channel.openB = false;
                // Close the other side if no deposit was ever made
                if (channel.depositA == 0) {
                    channel.openA = false;
                }
            } else {
                // Copy the data to the state and allow challenges

                channel.nonce = nonce;
                channel.valueBtoA = value;
                channel.closeTime = now;
            }
        } else if (msg.sender == channel.agentB && signer == channel.agentA) {
            if (channel.challenge == 0) {
                // If there's no challenge period, close out the channel immediately.

                // Close out the A->B side of the channel
                require(value <= channel.depositA);
                channel.agentB.transfer(channel.depositA - value);

                // Close this side of the channel
                channel.openA = false;
                // Close the other side if no deposit was ever made
                if (channel.depositB == 0) {
                    channel.openB = false;
                }
            } else {
                // Copy the data to the state and allow challenges

                channel.nonce = nonce;
                channel.valueAtoB = value;
                channel.closeTime = now;
            }
        }

        // If both sides of the channel are closed, delete the channel
        if (channel.openA == false && channel.openB == false) {
            // Close the channel
            delete channel;
        }
    }

    function challenge(bytes32[4] h, uint8 v, uint256 value, uint256 nonce) public {
        // Make sure we're still in the challenge period
        require(channel.closeTime + channel.challenge > now);

        // Make sure the nonce is higher
        require(nonce >= channel.nonce);

        require(msg.sender == channel.agentA || msg.sender == channel.agentB);

        address signer = ecrecover(h[1], v, h[2], h[3]);
        bytes32 proof = keccak256(h[0], value);

        require(proof == h[1]);

        if (msg.sender == channel.agentA && signer == channel.agentB) {
            channel.nonce = nonce;
            channel.valueBtoA = value;
            channel.closeTime = now;
        } else if (msg.sender == channel.agentB && signer == channel.agentA) {
            channel.nonce = nonce;
            channel.valueAtoB = value;
            channel.closeTime = now;
        }
    }
}