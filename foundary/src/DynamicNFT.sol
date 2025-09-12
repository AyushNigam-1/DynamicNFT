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
        uint256 totalHours;
        uint256 level;
        uint256 lastUpdated;
        uint256 tokenid;
    }

    // This mapping links a user's address to their NFT's unique token ID.
    // mapping(address => uint256) public userToTokenId;
    mapping(address => StudyStats) public studyStats;

    // HOURS_PER_LEVEL is now a state variable, not a constant
    uint256 public HOURS_PER_LEVEL;

    event StudyMilestone(uint256 indexed tokenId, uint256 totalHours, uint256 newLevel);

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

    /// @notice A single function to either mint a new NFT or update an existing one
    function updateStudyTime(address to, uint256 hoursToAdd) external onlyOwner {
        require(hoursToAdd > 0, "Must add positive hours");

        // uint256 tokenId = userToTokenId[to];
        uint256 tokenId = studyStats[to].tokenid ;
        StudyStats storage stats;

        // Check if the user already has a token
        if (tokenId == 0) {
            // Mint a new token
            _nextTokenId++;
            _safeMint(to, _nextTokenId);
            tokenId = _nextTokenId;
            
            // Initialize new study stats
            studyStats[to] = StudyStats({
                totalHours: 0,
                level: 0, // Set to 0 to ensure the first update correctly calculates level 1
                lastUpdated: block.timestamp,
                tokenid: _nextTokenId
            });
            stats = studyStats[to];
        } else {
            // Get the existing study stats
            stats = studyStats[to];
        }

        // Add the new hours
        stats.totalHours += hoursToAdd;

        // Calculate new level
        uint256 newLevel = (stats.totalHours / HOURS_PER_LEVEL) + 1;
        if (newLevel > stats.level) {
            stats.level = newLevel;
        }

        stats.lastUpdated = block.timestamp;

        emit StudyMilestone(tokenId, stats.totalHours, stats.level);
    }

    /// @dev Generate metadata JSON dynamically
    function _generateTokenURI(address to , uint256 tokenId) private view returns (string memory) {
        StudyStats memory stats = studyStats[to];

        string memory levelStr = stats.level.toString();
        string memory hoursStr = stats.totalHours.toString();

        string memory json = string(abi.encodePacked(
            '{"name": "Study NFT #', tokenId.toString(), '",',
            '"description": "A dynamic NFT that evolves as the student studies.",',
            '"image": "https://cdna.artstation.com/p/assets/images/images/054/698/976/large/hyodoru-fedor-lesnickov-cybo.jpg?1665146929",',
            '"attributes": [',
                '{"trait_type": "Total Study Hours", "value": ', hoursStr, '},',
                '{"trait_type": "Level", "value": ', levelStr, '}',
            ']}'
        ));

        string memory encodedJson = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", encodedJson));
    }

    /// @notice Override tokenURI to always serve dynamic metadata
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
         require(ownerOf(tokenId) != address(0), "ERC721: URI query for nonexistent token");
         return _generateTokenURI(ownerOf(tokenId) ,tokenId);
    }
}
