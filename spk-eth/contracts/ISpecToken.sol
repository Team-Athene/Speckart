// SPDX-License-Identifier: SPECKART
pragma solidity ^0.6.8;


interface ISpecToken {
    function balance(address _addr) external view returns (uint256);

    function specPrice() external view returns (uint256);

    function transfer(
        address _to,
        uint256 _count,
        address _addr
    ) external returns (bool success);

    function buyToken(uint256 _count, address _addr) external;

    function sendTokens(uint256 _count, address _addr) external;

    function collectTokens(uint256 _count, address _addr) external;

    function burn(uint256 _count, address _addr)
        external
        returns (bool success);

    // function sentTokensToUser(address _user, uint256 _count) external;
    function spkDetail()
        external
        view
        returns (
            string memory tokenName,
            string memory tokenSymbol,
            uint8 tokenDecimals,
            uint256 tokenTotalSupply,
            uint256 specTokenPrice,
            address tokenOwner,
            address specTokenAddress,
            uint256 etherBal,
            uint256 tokenBalance
        );
}
