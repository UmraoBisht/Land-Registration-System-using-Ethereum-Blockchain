// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistrySystem{
    struct Land {
        uint256 land_id;
        bool is_govt_approved;
        string ipfsHash; // Hashes of land documents stored off-chain (e.g., IPFS)
        address current_owner;
        address[] previous_owners;
        uint256 created_at;
        uint256 area; // Area in square meters
        string location;
    }

    struct TransferRequestTrack {
        uint256 created_at;
        address previous_owner;
        address new_owner;
        uint256 land_id;
        bool owner_approved;
        bool govt_approved;
        uint256 area; // Area in square meters
        string location;
    }

    address private owner;
    address private adminAddress;
    uint256[] private landIds;
    mapping(uint256 => Land) private lands;
    mapping(address => TransferRequestTrack[]) private userTransferRequests;
    mapping(address => uint256[]) private userLandIds; // Keep track of land IDs owned by each use

    event LandOwnershipTransferred(
        uint256 indexed landId,
        address[] previousOwners,
        address newOwner
    );
    event LandCreated(uint256 indexed landId, address newOwner);

    uint256 public totalLands;

    modifier onlyAdmin() {
        require(
            msg.sender == adminAddress,
            "Only admins can perform this action"
        );
        _;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can perform this action"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        adminAddress = msg.sender;
    }

    function registerLand(
        uint256 landId,
        uint256 area,
        string memory location,
        string memory ipfsHash
    ) public {
        require(
            lands[landId].land_id != landId,
            "Land with this ID already exists"
        );

        lands[landId] = Land({
            land_id: landId,
            is_govt_approved: false,
            ipfsHash: ipfsHash,
            area: area, // Area in square meters
            location: location,
            current_owner: msg.sender,
            previous_owners: new address[](0),
            created_at: block.timestamp
        });
        userLandIds[msg.sender].push(landId);
        landIds.push(landId);
        emit LandCreated(landId, msg.sender);
    }

    function getLand(uint256 landId) public view returns (Land memory) {
        require(
            lands[landId].land_id == landId,
            "Land with this ID does not exist"
        );

        return
            Land({
                land_id: landId,
                is_govt_approved: lands[landId].is_govt_approved,
                ipfsHash: lands[landId].ipfsHash,
                area: lands[landId].area, // Area in square meters
                location: lands[landId].location,
                current_owner: lands[landId].current_owner,
                previous_owners: lands[landId].previous_owners,
                created_at: lands[landId].created_at
            });
    }
    function updateLand(uint256 landId, string memory newIpfsHash1) public {
        require(
            lands[landId].land_id == landId,
            "Land with this ID does not exist"
        );
        require(
            msg.sender == lands[landId].current_owner,
            "Only land owner can update land"
        );
        lands[landId].ipfsHash = newIpfsHash1;
    }
    function deleteLand(uint256 landId) public {
        require(
            msg.sender == lands[landId].current_owner,
            "Only owner can delete land"
        );
        require(lands[landId].land_id != 0, "Land with this ID does not exist");
        deleteTransferRequestsForLand(landId);
        delete lands[landId];
        for (uint256 i = 0; i < landIds.length; i++) {
            if (landIds[i] == landId) {
                landIds[i] = landIds[landIds.length - 1];
                landIds.pop();
                break;
            }
        }
    }

    function deleteTransferRequestsForLand(uint256 landId) public {
        require(
            msg.sender == lands[landId].current_owner,
            "Only owner can delete land"
        );
        require(lands[landId].land_id != 0, "Land with this ID does not exist");
        TransferRequestTrack[] storage userTransfers = userTransferRequests[
            lands[landId].current_owner
        ];
        for (uint256 i = 0; i < userTransfers.length; i++) {
            if (userTransfers[i].land_id == landId) {
                // Remove the transfer request from the array
                userTransfers[i] = userTransfers[userTransfers.length - 1];
                userTransfers.pop();
                break;
            }
        }
    }

    function getNonApprovedLands()
        public
        view
        onlyAdmin
        returns (Land[] memory)
    {
        uint256 nonApprovedCount = 0;
        for (uint256 i = 0; i < landIds.length; i++) {
            if (!lands[landIds[i]].is_govt_approved) {
                nonApprovedCount++;
            }
        }

        Land[] memory nonApprovedLands = new Land[](nonApprovedCount);
        uint256 index = 0;
        for (uint256 i = 0; i < landIds.length; i++) {
            if (!lands[landIds[i]].is_govt_approved) {
                nonApprovedLands[index] = getLand(landIds[i]);
                index++;
            }
        }
        return nonApprovedLands;
    }

    function approveLand(uint256 _landId) public onlyAdmin {
        if (!lands[_landId].is_govt_approved) {
            lands[_landId].is_govt_approved = true;
        } else {
            revert("Land already approved by government");
        }
    }

    function createTransferRequest(uint256 landId, address newOwner) public {
        Land storage land = lands[landId];
        require(
            land.current_owner == msg.sender,
            "Only the current owner can transfer ownership"
        );

        TransferRequestTrack[] storage userTransfers = userTransferRequests[
            msg.sender
        ];
        bool existingRequest = false;
        for (uint256 i = 0; i < userTransfers.length; i++) {
            if (
                userTransfers[i].land_id == landId &&
                !userTransfers[i].govt_approved
            ) {
                existingRequest = true;
                break;
            }
        }
        require(
            !existingRequest,
            "There is already a pending transfer request for this land"
        );

        userTransferRequests[msg.sender].push(
            TransferRequestTrack({
                land_id: landId,
                previous_owner: lands[landId].current_owner,
                new_owner: newOwner,
                owner_approved: true,
                govt_approved: lands[landId].is_govt_approved,
                area: lands[landId].area,
                location: lands[landId].location,
                created_at: block.timestamp
            })
        );
    }

    struct UserRejectedTransferRequest {
        uint256 landId;
        string reason;
    }

    mapping(address => UserRejectedTransferRequest[])
        private userRejectedTransferRequests;

    function rejectTransferRequest(
        uint256 landId,
        address currentOwner,
        string memory reason
    ) public onlyAdmin {
        require(
            lands[landId].land_id == landId,
            "Land with this ID does not exist"
        );

        userRejectedTransferRequests[currentOwner].push(
            UserRejectedTransferRequest(landId, reason)
        );

        TransferRequestTrack[] storage userTransfers = userTransferRequests[
            currentOwner
        ];
        for (uint256 i = 0; i < userTransfers.length; i++) {
            if (
                userTransfers[i].land_id == landId &&
                userTransfers[i].owner_approved &&
                !userTransfers[i].govt_approved
            ) {
                userTransfers[i] = userTransfers[userTransfers.length - 1];
                userTransfers.pop();
                break;
            }
        }
    }

    function getRejectedTransferLandForUser()
        public
        view
        returns (UserRejectedTransferRequest[] memory)
    {
        return userRejectedTransferRequests[msg.sender];
    }

    function getAllTransferRequest()
        public
        view
        onlyAdmin
        returns (TransferRequestTrack[] memory)
    {
        uint256 totalRequests = 0;
        for (uint256 i = 0; i < landIds.length; i++) {
            uint256 landId = landIds[i];
            totalRequests += userTransferRequests[lands[landId].current_owner]
                .length;
        }
        TransferRequestTrack[] memory allRequests = new TransferRequestTrack[](
            totalRequests
        );
        uint256 index = 0;
        for (uint256 i = 0; i < landIds.length; i++) {
            uint256 landId = landIds[i];
            TransferRequestTrack[] memory requests = userTransferRequests[
                lands[landId].current_owner
            ];
            for (uint256 j = 0; j < requests.length; j++) {
                allRequests[index] = requests[j];
                index++;
            }
        }
        return allRequests;
    }

    function getAllTransferRequests()
        public
        view
        onlyAdmin
        returns (TransferRequestTrack[] memory)
    {
        uint256 totalRequests;
        for (uint256 i = 0; i < landIds.length; i++) {
            totalRequests += userTransferRequests[
                lands[landIds[i]].current_owner
            ].length;
        }

        TransferRequestTrack[] memory allRequests = new TransferRequestTrack[](
            totalRequests
        );
        uint256 index = 0;
        for (uint256 i = 0; i < landIds.length; i++) {
            address currentOwner = lands[landIds[i]].current_owner;
            TransferRequestTrack[] storage requests = userTransferRequests[
                currentOwner
            ];
            for (uint256 j = 0; j < requests.length; j++) {
                allRequests[index] = TransferRequestTrack({
                    created_at: requests[j].created_at,
                    previous_owner: requests[j].previous_owner,
                    new_owner: requests[j].new_owner,
                    land_id: requests[j].land_id,
                    owner_approved: requests[j].owner_approved,
                    govt_approved: requests[j].govt_approved,
                    area: requests[j].area,
                    location: requests[j].location
                });
                index++;
            }
        }
        return allRequests;
    }

    function approveTransferRequest(
        uint256 landId,
        address currentOwner
    ) public onlyAdmin returns (bool) {
        Land storage land = lands[landId];
        require(land.land_id == landId, "This land doesn't exist");
        require(
            land.is_govt_approved == true,
            "This land ownership has not been approved"
        );

        TransferRequestTrack[] storage userTransfers = userTransferRequests[
            currentOwner
        ];
        for (uint256 i = 0; i < userTransfers.length; i++) {
            if (
                userTransfers[i].land_id == landId &&
                userTransfers[i].owner_approved == true &&
                userTransfers[i].govt_approved == true
            ) {
                userTransfers[i].govt_approved = true;
                land.previous_owners.push(land.current_owner);
                _detachLandFromAddress(landId, land.current_owner);
                land.current_owner = userTransfers[i].new_owner;
                userLandIds[userTransfers[i].new_owner].push(landId);
                emit LandOwnershipTransferred(
                    landId,
                    lands[landId].previous_owners,
                    currentOwner
                );
                userTransfers[i] = userTransfers[userTransfers.length - 1];
                userTransfers.pop();

                return true;
            }
        }
        return false;
    }

    function getLandOwners(
        uint256 landId
    )
        public
        view
        returns (address currentOwner, address[] memory previousOwners)
    {
        currentOwner = lands[landId].current_owner;
        previousOwners = lands[landId].previous_owners;
    }

    function getOwnedLands() public view returns (Land[] memory) {
        uint256 landCount = userLandIds[msg.sender].length;
        uint256 ownedCount = 0;
        for (uint256 i = 0; i < landCount; i++) {
            uint256 landId = userLandIds[msg.sender][i];
            if (msg.sender == lands[landId].current_owner) {
                ownedCount++;
            }
        }
        Land[] memory ownedLands = new Land[](ownedCount);
        uint256 index = 0;
        for (uint256 i = 0; i < landCount; i++) {
            uint256 landId = userLandIds[msg.sender][i];
            if (msg.sender == lands[landId].current_owner) {
                ownedLands[index] = getLand(landId);
                index++;
            }
        }

        return ownedLands;
    }

    function getAllLands() public view onlyAdmin returns (Land[] memory) {
        Land[] memory result = new Land[](landIds.length);
        for (uint256 i; i < landIds.length; i++) {
            result[i] = getLand(landIds[i]);
        }
        return result;
    }

    function getTransferredLands()
        public
        view
        returns (TransferRequestTrack[] memory)
    {
        TransferRequestTrack[] memory response = userTransferRequests[
            msg.sender
        ];

        return response;
    }

    function getAddressTransferredLands(
        address req
    ) public view onlyAdmin returns (TransferRequestTrack[] memory) {
        TransferRequestTrack[] memory response = userTransferRequests[req];

        return response;
    }

    function _detachLandFromAddress(
        uint256 landId,
        address pastOwner
    ) internal {
        uint256 landCount = userLandIds[msg.sender].length;
        for (uint256 i = 0; i < landCount; i++) {
            if (userLandIds[pastOwner][i] == landId) {
                userLandIds[pastOwner][i] = userLandIds[pastOwner][
                    landCount - 1
                ];
                userLandIds[pastOwner].pop();
            }
        }
    }
}
