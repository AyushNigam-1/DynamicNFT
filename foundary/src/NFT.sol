// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title StudyNFTUpgradeable
/// @dev Upgradeable dynamic NFT with verifiable off-chain logging
contract StudyNFTUpgradeable is Initializable, ERC721URIStorageUpgradeable, OwnableUpgradeable {
    using Strings for uint256;
    using MessageHashUtils for bytes32;

    uint256 private _nextTokenId;

    struct StudyStats {
        uint256 totalHours;
        uint256 tokenId;
        uint256 level;
    }

    mapping(address => StudyStats) public studyStats;

    uint256 public hoursPerLevel;

    /// @notice Address of trusted signer (backend)
    address public signer;

    event Minted(address indexed to, uint256 indexed tokenId);
    event StudyLogged(address indexed user, uint256 totalHours, uint256 level);

    /// @notice Initializer for upgradeable contract
    function initialize(uint256 initialHoursPerLevel, address backendSigner) public initializer {
        __ERC721_init("StudyNFT", "STUDY");
        __ERC721URIStorage_init();
        __Ownable_init(msg.sender);

        require(initialHoursPerLevel > 0, "Initial hours must be positive");
        require(backendSigner != address(0), "Invalid signer");
        hoursPerLevel = initialHoursPerLevel;
        signer = backendSigner;
    }

    /// @notice Update the trusted backend signer
    function setSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Invalid signer");
        signer = newSigner;
    }

    /// @notice Mint a new NFT for a user
    function mint(address to) external  {
        _nextTokenId++;
        uint256 newItemId = _nextTokenId;

        _safeMint(to, newItemId);

        studyStats[to] = StudyStats({
            totalHours: 0,
            tokenId: newItemId,
            level: 1
        });

        emit Minted(to, newItemId);
    }

        /// @notice Update study progress with backend-signed data
        /// @param user User address
        /// @param totalHours Total study hours from backend
        /// @param newLevel New calculated level from backend
        /// @param signature Backend signature proving authenticity
    function logStudySigned(
        address user,
        uint256 totalHours,
        uint256 newLevel,
        bytes memory signature
    ) external {
        // require(studyStats[user].tokenId > 0, "User does not have an NFT yet");

        // Hash the structured data
        bytes32 messageHash = keccak256(
            abi.encodePacked(user, totalHours, newLevel, address(this))
        );

        // EIP-191 prefix (via MessageHashUtils)
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        // Recover signer
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
        require(recoveredSigner == owner(), "Invalid signature");

        // Update stats
        StudyStats storage stats = studyStats[user];
        stats.totalHours = totalHours;
        stats.level = newLevel;

        emit StudyLogged(user, totalHours, newLevel);
    }


    /// @notice Returns the current level of a user
    function getLevel(address user) public view returns (uint256) {
        require(studyStats[user].tokenId > 0, "User does not have an NFT yet");
        return studyStats[user].level;
    }

    /// @dev Dynamic tokenURI based on level
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721: URI query for nonexistent token");

        address ownerAddr = ownerOf(tokenId);
        uint256 level = getLevel(ownerAddr);

        string memory imageLink = string(
            abi.encodePacked(
                "https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeibjq6ut5gtzfvjxsrf336h3q5sjko56mzhpiloa2b7j6mufg6h2kq/level-",
                level.toString(),
                ".svg"
            )
        );

        string memory json = string(
            abi.encodePacked(
                '{"name": "Study NFT #', tokenId.toString(), '",',
                '"description": "An evolving NFT representing study progress.",',
                '"image": "', imageLink, '",',
                '"attributes": [',
                    '{"trait_type": "Level", "value": ', level.toString(), '}',
                ']}'
            )
        );

        string memory base64Json = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }
}
