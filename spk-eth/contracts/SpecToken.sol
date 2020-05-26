// SPDX-License-Identifier: SPECKART
pragma solidity ^0.6.8;
import "./ISpecToken.sol";
import "./SafeMath.sol";


contract SpecToken is ISpecToken {
    using SafeMath for uint256;
    mapping(address => uint256) balanceOf;
    string name;
    string symbol;
    uint8 decimals;
    uint256 totalSupply;
    uint256 tokenPrice;
    address owner;
    address self;
    event Transfer(address indexed from, address indexed to, uint256 count);
    event Burn(address indexed from, uint256 count);

    constructor() public {
        owner = msg.sender;
        self = address(this);
        balanceOf[owner] = 0;
        totalSupply = 0;
        name = "SpecToken";
        symbol = "SPC";
        decimals = 2;
        tokenPrice = 0.000005 ether;
    }

    function balance(address _addr) external override view returns (uint256) {
        return balanceOf[_addr];
    }

    function specPrice() external override view returns (uint256) {
        return tokenPrice;
    }

    function transfer(
        address _to,
        uint256 _count,
        address _addr
    ) external override returns (bool success) {
        require(_count > 0, "Value must be greater than zero");
        require(_to != address(0), "Use burn() instead");
        require(balanceOf[_addr] >= _count, "insufficient funds");
        balanceOf[_addr] = balanceOf[_addr].sub(_count);
        balanceOf[_to] = balanceOf[_to].add(_count);
        emit Transfer(_addr, _to, _count);
        return true;
    }

    function mint(address _to, uint256 _count) internal returns (bool success) {
        require(_to != address(0), "Use burn() instead");
        totalSupply = totalSupply.add(_count);
        balanceOf[_to] = balanceOf[_to].add(_count);
        emit Transfer(address(0), _to, _count);
        return true;
    }

    function burn(uint256 _count, address _addr)
        external
        override
        returns (bool success)
    {
        require(_count > 0, "Value must be greater than zero");
        require(balanceOf[_addr] >= _count, "insufficient funds");
        balanceOf[_addr] = balanceOf[_addr].sub(_count);
        totalSupply = totalSupply.sub(_count);
        emit Burn(_addr, _count);
        return true;
    }

    fallback() external payable {
        revert();
    }

    receive() external payable {
        revert();
    }

    function buyToken(uint256 _count, address _addr) external override {
        mint(_addr, _count);
        emit Transfer(address(0), _addr, _count);
    }

    function sendTokens(uint256 _count, address _addr) external override {
        balanceOf[self] = balanceOf[self].add(_count);
        balanceOf[_addr] = balanceOf[_addr].sub(_count);
    }

    function collectTokens(uint256 _count, address _addr) external override {
        balanceOf[self] = balanceOf[self].sub(_count);
        balanceOf[_addr] = balanceOf[_addr].add(_count);
    }

    function spkDetail()
        external
        override
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
        )
    {
        return (
            name,
            symbol,
            decimals,
            totalSupply,
            tokenPrice,
            owner,
            self,
            self.balance,
            balanceOf[self]
        );
    }
}
