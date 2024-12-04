// SPDX-License-Identifier: MIT
// pragma solidity >=0.7.3;
pragma solidity ^0.8.0;

contract UserProfile {
    struct Profile {
        string name;
        string bio;
        string avatar;
    }

    mapping(address => Profile) public profiles;

    function createOrUpdateProfile(
        string memory name,
        string memory bio,
        string memory avatar
    ) public {
        profiles[msg.sender] = Profile(name, bio, avatar);
    }

    function getProfile(address user) public view returns (Profile memory) {
        return profiles[user];
    }
}
