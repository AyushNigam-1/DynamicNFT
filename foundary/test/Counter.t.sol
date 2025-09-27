// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/NFT.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
contract StudyNFTUpgradeableTest is Test {
    StudyNFTUpgradeable nft;
    using MessageHashUtils for bytes32;

    address owner = address(0xABCD);
    address backendSigner = vm.addr(1); // deterministic private key
    uint256 backendPrivKey = 1;         // must match vm.addr(1)
    address user = address(0xBEEF);

    function setUp() public {
        vm.startPrank(owner);
        nft = new StudyNFTUpgradeable();
        nft.initialize(10, backendSigner);
        vm.stopPrank();
    }

    function testMint() public {
        vm.prank(owner);
        nft.mint(user);

        // Verify studyStats initialized
        (uint256 totalHours, uint256 tokenId, uint256 level) = nft.studyStats(user);
        assertEq(totalHours, 0);
        assertEq(level, 0);
        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(1), user);
    }

    function testLogStudySigned() public {
        // Mint first
        vm.prank(owner);
        nft.mint(user);

        // Prepare data
        uint256 totalHours = 50;
        uint256 newLevel = 5;

        bytes32 messageHash = keccak256(
            abi.encodePacked(user, totalHours, newLevel, address(nft))
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        // Sign with backendPrivKey
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(backendPrivKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Call logStudySigned
        nft.logStudySigned(user, totalHours, newLevel, signature);

        (uint256 recordedHours,, uint256 recordedLevel) = nft.studyStats(user);
        assertEq(recordedHours, 50);
        assertEq(recordedLevel, 5);
    }

    function testLogStudyFailsWithBadSignature() public {
        vm.prank(owner);
        nft.mint(user);

        uint256 totalHours = 20;
        uint256 newLevel = 2;

        // Use wrong signer key
        uint256 wrongPrivKey = 2;
        bytes32 messageHash = keccak256(
            abi.encodePacked(user, totalHours, newLevel, address(nft))
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(wrongPrivKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.expectRevert("Invalid signature");
        nft.logStudySigned(user, totalHours, newLevel, signature);
    }

    function testTokenURIChangesWithLevel() public {
        vm.prank(owner);
        nft.mint(user);

        // Prepare signature to set level = 3
        uint256 totalHours = 30;
        uint256 newLevel = 3;
        bytes32 messageHash = keccak256(
            abi.encodePacked(user, totalHours, newLevel, address(nft))
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(backendPrivKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        nft.logStudySigned(user, totalHours, newLevel, signature);

        string memory uri = nft.tokenURI(1);
        assertTrue(bytes(uri).length > 0);
        assertTrue(
            bytes(uri).length > 100, // crude check: should be base64 json
            "Token URI should return encoded metadata"
        );
    }
}
