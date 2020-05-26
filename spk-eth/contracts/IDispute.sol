// SPDX-License-Identifier: SPECKART
pragma solidity ^0.6.8;


interface IDispute {
    function Create(
        uint32 _o_Id,
        uint32 _p_Id,
        uint8 _type,
        bytes32 _comment,
        address _address
    ) external;

    function checkAdmin(address _admin) external view returns (bool);

    function getPID(uint32 _D_ID) external view returns (uint32);

    function getOID(uint32 _D_ID) external view returns (uint32);

    function getDID() external view returns (uint32);

    function getDispute(uint32 _D_ID)
        external
        view
        returns (
            uint32 orderId,
            uint32 productId,
            uint8 creatorType,
            bytes32 comment,
            uint32 bVote,
            uint32 sVote,
            bool isDisputeCleared
        );

    function Vote(
        address payable _addr,
        uint32 _D_ID,
        uint32 _vote,
        uint256 _itemPrice,
        address payable _seller,
        address payable _buyer
    ) external returns (uint8);
}
