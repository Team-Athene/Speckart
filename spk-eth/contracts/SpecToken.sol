pragma solidity ^0.6.8;
import './ISpecToken.sol';
import './SafeMath.sol';

contract SpecToken is ISpecToken{
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

    function transfer(address _to, uint256 _count)
        external override
        returns (bool success)
    {
        require(_count > 0, "Value must be greater than zero");
        require(_to != address(0), "Use burn() instead");
        require(balanceOf[msg.sender] >= _count, "insufficient funds");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_count);
        balanceOf[_to] = balanceOf[_to].add(_count);
        emit Transfer(msg.sender, _to, _count);
        return true;
    }

    function mint(address _to, uint256 _count)
        internal
        returns (bool success)
    {
        require(_to != address(0), "Use burn() instead");
        totalSupply = totalSupply.add(_count);
        balanceOf[_to] = balanceOf[_to].add(_count);
        emit Transfer(address(0), _to, _count);
        return true;
    }

    function burn(uint256 _count)
        external override
        returns (bool success)
    {
        require(_count > 0, "Value must be greater than zero");
        require(balanceOf[msg.sender] >= _count, "insufficient funds");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_count);
        totalSupply = totalSupply.sub(_count);
        emit Burn(msg.sender, _count);
        return true;
    }

    fallback() external payable {
        uint256 count = msg.value / tokenPrice;
        uint256 bal = msg.value - count * tokenPrice;
        mint(msg.sender, count);
        msg.sender.transfer(bal);
    }

    receive() external payable {
        revert();
    }

    function buyToken(uint256 _count) external override {
        mint(msg.sender, _count);
        emit Transfer(address(0), msg.sender, _count);
    }

    function sendTokens(uint256 _count) external override {
        balanceOf[self] = balanceOf[self].add(_count);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_count);
    }

    function collectTokens(uint256 _count) external override {
        balanceOf[self] = balanceOf[self].sub(_count);
        balanceOf[msg.sender] = balanceOf[msg.sender].add(_count);
    }

    function sentTokensToUser(address _user, uint256 _count) external override {
        balanceOf[self] = balanceOf[self].sub(_count);
        balanceOf[_user] = balanceOf[_user].add(_count);
    }
    
    function spkDetails()
        external override
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

