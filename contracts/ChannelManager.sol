pragma solidity ^0.4.18;

import "./ECTools.sol";

contract ChannelManager is ECTools {
    event ChannelOpen(
        bytes32 indexed channelId,
        address indexed agentA,
        address indexed agentB,
        uint256 depositA
    );
    event ChannelJoin(
        bytes32 indexed channelId,
        address indexed agentA,
        address indexed agentB,
        uint256 depositA,
        uint256 depositB
    );
    event ChannelChallenge(
        bytes32 indexed channelId,
        uint256 nonce
    );
    event ChannelClose(bytes32 indexed channelId);

    enum ChannelStatus {
        Open,
        Challenge,
        Closed
    }

    struct Channel {
        address agentA;
        address agentB;
        uint depositA; // Deposit of agent A
        uint depositB; // Deposit of agent B
        ChannelStatus status; 
        uint challenge;
        uint nonce;
        uint closeTime;
        uint balanceA; // for challenge
        uint balanceB; // for challenge
    }

    mapping (bytes32 => Channel) public channels;
    mapping (address => mapping(address => bytes32)) public activeIds;

    function openChannel(address to, uint challenge) payable public {
        require(challenge != 0);

        bytes32 id = keccak256(msg.sender, to, now);
        Channel memory channel;
        channel.agentA = msg.sender;
        channel.agentB = to;
        channel.depositA = msg.value;
        channel.status = ChannelStatus.Open;
        channel.challenge = challenge;

        // save to state
        channels[id] = channel;
        // Add it to the lookup table
        activeIds[msg.sender][to] = id;
        ChannelOpen(id, channel.agentA, channel.agentB, channel.depositA);
    }

    function joinChannel(bytes32 id) payable public {
        Channel storage channel = channels[id];

        require(msg.sender == channel.agentB && channel.status == ChannelStatus.Open);
        require(msg.value != 0);
        require(channel.depositB == 0); // no re-up in this version

        channel.depositB = msg.value;

        ChannelJoin(id, channel.agentA, channel.agentB, channel.depositA, channel.depositB);
    }

    function isValidStateUpdate(
        bytes32 channelId,
        uint256 nonce,
        uint256 balanceA,
        uint256 balanceB,
        string sigA,
        string sigB
    ) 
        public
        view
        returns (bool)
    {
        // h = keccack(channelId, nonce, balanceA, balanceB)
        Channel memory channel = channels[channelId];
        require(balanceA + balanceB == channel.depositA + channel.depositB);
        require(channel.status == ChannelStatus.Open || channel.status == ChannelStatus.Challenge);

        // require state info to be signed by both participants
        bytes32 fingerprint = keccak256(channelId, nonce, balanceA, balanceB);
        bool signedByBoth = (
            isSignedBy(fingerprint, sigA, channel.agentA) == true) && (isSignedBy(fingerprint, sigB, channel.agentB) == true
        );
        require(signedByBoth == true);
        // return if true
        return true;
    }

    function updateState(
        bytes32 channelId,
        uint256 nonce,
        uint256 balanceA,
        uint256 balanceB,
        string sigA,
        string sigB
    ) 
        public
    {
        Channel storage channel = channels[channelId];

        // sanity checks
        require(msg.sender == channel.agentA || msg.sender == channel.agentB); // comes from agent
        require(channel.status != ChannelStatus.Closed); // channel open or challenge status
        require(isValidStateUpdate(channelId, nonce, balanceA, balanceB, sigA, sigB) == true); // valid signatures from both parties
        require(nonce > channel.nonce); // need a higher sequence update

        // set state variables
        channel.balanceA = balanceA;
        channel.balanceB = balanceB;
        channel.nonce = nonce;
    }

    function startChallenge(
        bytes32 channelId,
        uint256 nonce,
        uint256 balanceA,
        uint256 balanceB,
        string sigA,
        string sigB
    ) 
        public
    {
        Channel storage channel = channels[channelId];

        // update to valid state
        updateState(channelId, nonce, balanceA, balanceB, sigA, sigB);

        // update channel status
        channel.status = ChannelStatus.Challenge;
        channel.closeTime = now + channel.challenge;
        
        ChannelChallenge(channelId, nonce);
    }

    function closeChannel(
        bytes32 channelId
    )
        public
    {
        Channel memory channel = channels[channelId];

        // request must come from agents
        require(msg.sender == channel.agentA || msg.sender == channel.agentB);

        // channel must be in challenge and challenge period over
        require(channel.status == ChannelStatus.Challenge);
        require(now > channel.closeTime);

        // if true, then use final state to close channel
        channel.agentA.transfer(channel.balanceA);
        channel.agentB.transfer(channel.balanceB);

        delete channels[channelId];
        delete activeIds[channel.agentA][channel.agentB];

        ChannelClose(channelId);
    }

    function getChannel(bytes32 id) public view returns(
        address,
        address,
        uint,
        uint,
        uint,
        uint,
        uint,
        uint,
        uint,
        uint
    ) {
        Channel memory channel = channels[id];
        return (
            channel.agentA,
            channel.agentB,
            channel.depositA,
            channel.depositB,
            uint(channel.status),
            channel.challenge,
            channel.nonce,
            channel.closeTime,
            channel.balanceA,
            channel.balanceB
        );
    }
}