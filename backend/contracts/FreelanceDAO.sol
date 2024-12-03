// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceDAO {
    struct Project {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        string name;
        string description;
        uint256 deadline;
        bool isCompleted;
        bool isDisputed;
        bool isAccepted;
    }

    struct Profile {
        string name;
        string bio;
        string avatar;
    }

    mapping(uint256 => Project) public projects;
    uint256 public nextProjectId;

    mapping(address => uint256) public reputation;
    mapping(address => Profile) public profiles;

    mapping(uint256 => mapping(address => bool)) public votes;
    mapping(uint256 => uint256) public disputeVotes;
    mapping(uint256 => uint256) public totalVotes;

    event ProjectCreated(uint256 projectId, address client, address freelancer);
    event TermsAccepted(uint256 projectId);
    event ProjectCompleted(uint256 projectId);
    event DisputeRaised(uint256 projectId);
    event DisputeResolved(uint256 projectId, bool voteForFreelancer);
    event ProfileUpdated(address user, string name, string bio, string avatar);

    // Modified createProject function
    function createProject(
        string memory name,
        string memory description,
        uint256 amount
    ) public {
        projects[nextProjectId] = Project({
            id: nextProjectId,
            client: address(0), // Initially no client
            freelancer: msg.sender, // Auto-fill freelancer as the creator
            amount: amount,
            name: name,
            description: description,
            deadline: 0,
            isCompleted: false,
            isDisputed: false,
            isAccepted: false
        });
        emit ProjectCreated(nextProjectId, address(0), msg.sender);
        nextProjectId++;
    }

    // Modified acceptTerms function
    function acceptTerms(uint256 projectId) public payable {
        Project storage project = projects[projectId];
        require(project.client == address(0), "Project already accepted");
        require(msg.value == project.amount, "Must send the exact amount");
        project.client = msg.sender;
        project.isAccepted = true;
        emit TermsAccepted(projectId);
    }

    function markAsCompleted(uint256 projectId) public {
        Project storage project = projects[projectId];
        require(msg.sender == project.freelancer, "Only freelancer can mark");
        require(project.isAccepted, "Terms not accepted");
        require(!project.isCompleted, "Project already completed");
        require(block.timestamp <= project.deadline, "Deadline passed");
        project.isCompleted = true;
        emit ProjectCompleted(projectId);
    }

    function confirmCompletion(uint256 projectId) public {
        Project storage project = projects[projectId];
        require(msg.sender == project.client, "Only client can confirm");
        require(project.isCompleted, "Project not marked as complete");
        payable(project.freelancer).transfer(project.amount);
    }

    function raiseDispute(uint256 projectId) public {
        Project storage project = projects[projectId];
        require(
            msg.sender == project.client || msg.sender == project.freelancer,
            "Only client or freelancer can raise dispute"
        );
        require(!project.isCompleted, "Cannot dispute a completed project");
        project.isDisputed = true;
        emit DisputeRaised(projectId);
    }

    function voteOnDispute(uint256 projectId, bool voteForFreelancer) public {
        require(projects[projectId].isDisputed, "No dispute for this project");
        require(!votes[projectId][msg.sender], "Already voted");
        votes[projectId][msg.sender] = true;
        totalVotes[projectId]++;
        if (voteForFreelancer) {
            disputeVotes[projectId]++;
        }
        if (totalVotes[projectId] >= 3) {
            // Example quorum
            resolveDispute(
                projectId,
                disputeVotes[projectId] > (totalVotes[projectId] / 2)
            );
            emit DisputeResolved(
                projectId,
                disputeVotes[projectId] > (totalVotes[projectId] / 2)
            );
        }
    }

    function resolveDispute(
        uint256 projectId,
        bool voteForFreelancer
    ) internal {
        Project storage project = projects[projectId];
        if (voteForFreelancer) {
            payable(project.freelancer).transfer(project.amount);
        } else {
            payable(project.client).transfer(project.amount);
        }
        project.isDisputed = false;
        emit DisputeResolved(projectId, voteForFreelancer);
    }

    // Profile Management
    function createOrUpdateProfile(
        string memory name,
        string memory bio,
        string memory avatar
    ) public {
        profiles[msg.sender] = Profile(name, bio, avatar);
        emit ProfileUpdated(msg.sender, name, bio, avatar);
    }

    function getProfile(address user) public view returns (Profile memory) {
        return profiles[user];
    }
}
