// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

import './mnist/plonk_vk.sol';

contract Leaderboard {
    struct Player {
        uint256 score;
        address addr;
    }

    mapping (uint => Player) public topScores;

    UltraVerifier verifier;

    constructor(address _verifier) {
        for (uint i = 0; i < 10; i++) {
            // 784 is the maximum possible score
            topScores[i] = Player(784, address(0));
        }

        verifier = UltraVerifier(_verifier);
    }

    function updateScore(bytes calldata _proof, bytes32[] calldata _publicInputs, uint256 digit, uint256 score) public {
        address sender = msg.sender;

        uint256 currentTopScore = topScores[digit].score;

        require(score < currentTopScore, "Score is not less than the current top score");

        require(verifier.verify(_proof, _publicInputs), "Proof is not valid");

        topScores[digit] = Player(score, sender);
    }
}