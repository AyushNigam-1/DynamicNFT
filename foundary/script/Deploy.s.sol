// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DynamicNFT.sol";

contract Deploy is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting all transactions from the deployer's address.
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract.
        StudyNFT studyNFT = new StudyNFT(1);

        console.log("StudyNFT contract deployed to:", address(studyNFT));

        // Stop broadcasting.
        vm.stopBroadcast();
    }
}
