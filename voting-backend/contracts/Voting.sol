// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public admin;
    mapping(address => bool) public voters;
    bool public votingStarted;
    bool public votingEnded;

    constructor(string[] memory candidateNames) {
        admin = msg.sender;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0
            }));
        }
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    function startVoting() public onlyAdmin {
        // Allow restarting even if previously ended
        votingStarted = true;
        votingEnded = false; // FIX: Ensure this is reset to allow voting again
    }

    function endVoting() public onlyAdmin {
        require(votingStarted, "Voting not started");
        votingEnded = true;
        votingStarted = false; // Mark as closed
    }

    function vote(uint256 candidateIndex) public {
        require(votingStarted, "Voting has not started");
        require(!votingEnded, "Voting has ended");
        require(!voters[msg.sender], "You have already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");

        voters[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 index) public view returns (string memory, uint256) {
        require(index < candidates.length, "Invalid index");
        return (candidates[index].name, candidates[index].voteCount);
    }
}
