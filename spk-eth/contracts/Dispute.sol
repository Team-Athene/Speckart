// SPDX-License-Identifier: SPECKART
pragma solidity ^0.6.8;
import "./ISpecToken.sol";
import "./SafeMath.sol";
import "./IDispute.sol";


contract DisputeContract is IDispute {
    using SafeMath for uint256;
    struct DisputeStruct {
        uint32 orderId;
        uint32 productId;
        uint8 creatorType;
        bytes32 comment;
        uint32 bVote;
        uint32 sVote;
        uint32 count;
        mapping(uint32 => mapping(uint32 => address payable)) votedAdmin;
        bool isDisputeCleared;
    }
    address[] admins;
    address TOKEN;
    uint32 D_ID;
    mapping(uint32 => DisputeStruct) Dispute;
    mapping(address => mapping(uint32 => bool)) isVoted;

    modifier onlyAdmin() {
        require(checkAdmin(msg.sender) == true, "Not An Admin");
        _;
    }

    constructor(address[] memory _admins, address _token) public {
        // require(_admins.length.mod(2) != 0, "Number of admins should be Odd");
        admins = _admins;
        D_ID = 1000;
        TOKEN = _token;
    }

    function isVotedCheck(address _addr, uint32 _D_ID)
        internal
        view
        returns (bool)
    {
        return (isVoted[_addr][_D_ID]);
    }

    function Create(
        uint32 _o_Id,
        uint32 _p_Id,
        uint8 _type,
        bytes32 _comment,
        address _address
    ) external override {
        require(checkAdmin(_address) == false, "An Admin");
        D_ID++;
        Dispute[D_ID].productId = _p_Id;
        Dispute[D_ID].orderId = _o_Id;
        Dispute[D_ID].creatorType = _type;
        Dispute[D_ID].comment = _comment;
    }

    function Vote(
        address payable _addr,
        uint32 _D_ID,
        uint32 _vote,
        uint256 _itemPrice,
        address payable _seller,
        address payable _buyer
    ) external override returns (uint8) {
        require(checkAdmin(_addr) == true, "Not An Admin");
        require(isVoted[_addr][_D_ID] == false, "Admin has already Voted");
        require(
            Dispute[_D_ID].isDisputeCleared == false,
            "Dispute Already Cleared"
        );
        require(Dispute[_D_ID].count <= admins.length, "Maximum Vote Reached");

        if (_vote == 1) {
            Dispute[_D_ID].sVote++;
        } else if (_vote == 2) {
            Dispute[_D_ID].bVote++;
        }
        Dispute[_D_ID].count++;
        Dispute[_D_ID].votedAdmin[Dispute[_D_ID].count][_vote] = _addr;
        isVoted[_addr][_D_ID] = true;
        uint8 winner;
        if (Dispute[_D_ID].count == admins.length) {
            if (Dispute[_D_ID].bVote > Dispute[_D_ID].sVote) {
                // buyer wins
                ISpecToken(TOKEN).collectTokens(
                    _itemPrice.add(_itemPrice.div(100)),
                    _buyer
                );
                PayAdmin(_D_ID, 2, _itemPrice.div(100));
                winner = 1;
            } else {
                // seller wins
                ISpecToken(TOKEN).collectTokens(
                    _itemPrice.add(_itemPrice.div(100)),
                    _seller
                );

                PayAdmin(_D_ID, 1, _itemPrice.div(100));
                winner = 2;
            }
            Dispute[_D_ID].isDisputeCleared = true;
        }
        return winner;
    }

    function PayAdmin(
        uint32 _D_ID,
        uint8 _vote,
        uint256 _disputePrice
    ) internal {
        uint256 count;
        if (_vote == 2) {
            count = Dispute[_D_ID].bVote;
        }
        if (_vote == 1) {
            count = Dispute[_D_ID].sVote;
        }
        for (uint32 i = 1; i <= admins.length; i++) {
            if (Dispute[_D_ID].votedAdmin[i][_vote] != address(0)) {
                ISpecToken(TOKEN).collectTokens(
                    (_disputePrice.div(count)),
                    Dispute[_D_ID].votedAdmin[i][_vote]
                );
            }
        }
    }
    
    function checkAdmin(address _admin) public override view returns (bool) {
        for (uint256 i = 0; i < admins.length; i++) {
            if (_admin == admins[i]) {
                return true;
            }
        }
        return false;
    }

    function getPID(uint32 _D_ID) external override view returns (uint32) {
        return Dispute[_D_ID].productId;
    }

    function getOID(uint32 _D_ID) external override view returns (uint32) {
        return Dispute[_D_ID].orderId;
    }

    function getDID() external override view returns (uint32) {
        return D_ID;
    }

    function getDispute(uint32 _D_ID)
        external
        override
        view
        returns (
            uint32 orderId,
            uint32 productId,
            uint8 creatorType,
            bytes32 comment,
            uint32 bVote,
            uint32 sVote,
            bool isDisputeCleared
        )
    {
        return (
            Dispute[_D_ID].orderId,
            Dispute[_D_ID].productId,
            Dispute[_D_ID].creatorType,
            Dispute[_D_ID].comment,
            Dispute[_D_ID].bVote,
            Dispute[_D_ID].sVote,
            Dispute[_D_ID].isDisputeCleared
        );
    }

}
