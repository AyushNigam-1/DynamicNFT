// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title StudyNFT
 * @dev A dynamic NFT that evolves based on study hours logged.
 */
contract StudyNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;

    struct StudyStats {
        uint256 level;
        uint256 tokenid;
    }

    // This mapping links a user's address to their NFT's unique token ID.
    // mapping(address => uint256) public userToTokenId;
    mapping(address => StudyStats) public studyStats;

    // HOURS_PER_LEVEL is now a state variable, not a constant
    uint256 public HOURS_PER_LEVEL;

    event Minted(address indexed to, uint256 indexed tokenId);
    event StudyMilestone( uint256 totalHours, uint256 newLevel);

    // The constructor now accepts the initial value for HOURS_PER_LEVEL
    constructor(uint256 initialHoursPerLevel) ERC721("StudyNFT", "STUDY") Ownable(msg.sender) {
        require(initialHoursPerLevel > 0, "Initial hours must be positive");
        HOURS_PER_LEVEL = initialHoursPerLevel;
    }

    /// @notice Owner can update the hours required per level
    function setHoursPerLevel(uint256 newHoursPerLevel) external onlyOwner {
        require(newHoursPerLevel > 0, "Hours per level must be positive");
        HOURS_PER_LEVEL = newHoursPerLevel;
    }

    function mint(address to) external onlyOwner {
        _nextTokenId++;
        uint256 newItemId = _nextTokenId;

        // Mint the token to the recipient.
        _safeMint(to, newItemId);
        
        // Initialize new study stats for the token.
        studyStats[to] = StudyStats({
            level: 1,
            tokenid: newItemId
        });
        
        emit Minted(to, newItemId);
    }

    /// @notice Updates the study stats of an existing NFT.
    function setStudyLevel(address user , uint256 newLevel) external onlyOwner {
        require(studyStats[user].tokenid > 0, "User does not have an NFT yet.");
        
        StudyStats storage stats = studyStats[user];
        
        stats.level = newLevel;

    }
    function getStudyLevel(address user) public view returns (uint256) {
        require(studyStats[user].tokenid > 0, "User does not have an NFT yet.");
        return studyStats[user].level;
    }
    /// @dev Overrides the tokenURI function to provide dynamic metadata.
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721: URI query for nonexistent token");
        
        StudyStats memory stats = studyStats[ownerOf(tokenId)];
        
        string memory imageLink = string(
                abi.encodePacked(
                    "https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeibjq6ut5gtzfvjxsrf336h3q5sjko56mzhpiloa2b7j6mufg6h2kq/level-",
                    stats.level.toString(),
                    ".svg"
                )
            );

        string memory json = string(
            abi.encodePacked(
                '{"name": "Study NFT #', tokenId.toString(), '",',
                '"description": "An evolving NFT representing study progress.",',
                '"image": "', imageLink, '",',
                '"attributes": [',
                    '{"trait_type": "Level", "value": ', stats.level.toString(), '}',
                ']}'
            )
        );

        
        // We'll use a placeholder image and a Base64-encoded JSON string for simplicity.
        string memory base64Json = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }
}
