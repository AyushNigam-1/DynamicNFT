// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {StudyNFTUpgradeable} from "../src/NFT.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address backendSigner = vm.envAddress("BACKEND_SIGNER"); // trusted backend
        uint256 initialHoursPerLevel = 10; // example value

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy implementation
        StudyNFTUpgradeable impl = new StudyNFTUpgradeable();

        // 2. Deploy ProxyAdmin
        ProxyAdmin proxyAdmin = new ProxyAdmin(msg.sender);

        // 3. Encode initializer call
        bytes memory data = abi.encodeWithSelector(
            StudyNFTUpgradeable.initialize.selector,
            initialHoursPerLevel,
            backendSigner
        );

        // 4. Deploy Transparent Proxy
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(impl),
            address(proxyAdmin),
            data
        );

        vm.stopBroadcast();

        console.log("Implementation deployed at:", address(impl));
        console.log("Proxy deployed at:", address(proxy));
        console.log("ProxyAdmin deployed at:", address(proxyAdmin));
    }
}
