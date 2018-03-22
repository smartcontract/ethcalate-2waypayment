pragma solidity ^0.4.18;

contract ChannelManager {
    struct Channel {
        address agentA;
        address agentB;
        address token;
        uint depositA;       // Deposit of agent A
        uint depositB;       // Deposit of agent B
        bool openA;          // True if A->B is open
        bool openB;          // True if B->A is open
    }

    Channel public channel;

    function openChannel(address to) payable public {
        channel.agentA = msg.sender;
        channel.agentB = to;
        channel.depositA = msg.value;
        channel.openA = true;
        channel.openB = true;
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

    function closeChannel(bytes32[4] h, uint8 v, uint256 value) public {
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
            require(value <= channel.depositB);
            channel.agentA.transfer(channel.depositB);
        }
    }

    function closeChannel(bytes32 h, uint8 v, bytes32 r, bytes32 s, uint value1, uint value2) public {
		address signer;
		bytes32 proof;

		// get signer from signature
		signer = ecrecover(h, v, r, s);

		// signature is invalid, throw
		require(signer == channel.member1 || signer == channel.member2);

		proof = keccak256(this, value1, value2);

		// signature is valid but doesn't match the data provided
		require(proof == h);

		if (channel.signatures[proof] == 0)
			channel.signatures[proof] = signer;
		else if (channel.signatures[proof] != signer) {
			// channel completed, both signatures provided
            channel.member1.transfer(value1);
            channel.member2.transfer(value1);
			delete channel;
		}

	}

}