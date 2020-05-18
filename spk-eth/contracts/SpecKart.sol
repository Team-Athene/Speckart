pragma solidity ^0.6.8;

library SpecLibrary {
  struct User{
    string userName;
    uint userContact;
    string userGender;
    string userEmail;
    string userAddr;
    uint[] orders;
    bool userStatus;
  }
  struct Item{
    string itemName;
    string itemType;
    uint itemPrice;
    string itemDetails;
    string itemBrand;
    string itemColor;
    string imageId;
    // uint ratingCount;
  }
  struct Order{
    address consumerAddr;
    uint timeStamp;
    string orderDetails;
    uint totalPrice;
    uint status;
  }
  struct SpecModel{
    address payable owner;
    uint P_ID;
    uint O_ID;
    uint[] confirmedOrder;
    uint[] rejectedOrder;
    mapping (address =>User) Consumer;
    mapping (uint =>Item) Product;
    mapping (uint =>Order) MarketOrder;
    // mapping(uint => mapping(uint => string)) prodRating;
    // mapping(uint => uint) prodQuantity;
  }
}

contract SpecVariables {
  using SpecLibrary for SpecLibrary.SpecModel;
  SpecLibrary.SpecModel  SPEC;
}

contract SpecModifiers is SpecVariables {
  modifier onlyAdmin()  {
  require(SPEC.owner == msg.sender,'only owner');
  _;
  }
  modifier notAdmin() {
  require(SPEC.owner != msg.sender,'Admin not allowed');
  _;
  }
  modifier onlyUser() {
    require(SPEC.Consumer[msg.sender].userStatus == true,'only user');
    _;
  }
}

contract SpecRead is SpecModifiers{
  function owner() external view returns(address) {
    return SPEC.owner;
  }
  function totalProductID() external view returns(uint) {
    return SPEC.P_ID;
  }
  function currentOrderID() external view returns(uint) {
    return SPEC.O_ID;
  }
  function consumer() external view returns(
    string memory userName,
    uint userContact,
    string memory userGender,
    string memory userEmail,
    string memory userAddr,
    uint[] memory orders,bool status) {
    return (
      SPEC.Consumer[msg.sender].userName,
      SPEC.Consumer[msg.sender].userContact,
      SPEC.Consumer[msg.sender].userGender,
      SPEC.Consumer[msg.sender].userEmail,
      SPEC.Consumer[msg.sender].userAddr,
      SPEC.Consumer[msg.sender].orders,
      SPEC.Consumer[msg.sender].userStatus
    );
  }
  function product(uint _id) external view returns(
    string memory itemName,
    string memory itemType,
    uint itemPrice,
    string memory itemDetails,
    string memory itemBrand,
    string memory itemColor,
    string memory imageId) {
    return (
      SPEC.Product[_id].itemName,
      SPEC.Product[_id].itemType,
      SPEC.Product[_id].itemPrice,
      SPEC.Product[_id].itemDetails,
      SPEC.Product[_id].itemBrand,
      SPEC.Product[_id].itemColor,
      SPEC.Product[_id].imageId
      // SPEC.Product[_id].ratingCount
    );
  }
  function marketOrder(uint _id) external view returns(
    address consumerAddr,
    uint timeStamp,
    string memory orderDetails,
    uint totalPrice,
    uint status) {
    return (
      SPEC.MarketOrder[_id].consumerAddr,
      SPEC.MarketOrder[_id].timeStamp,
      SPEC.MarketOrder[_id].orderDetails,
      SPEC.MarketOrder[_id].totalPrice,
      SPEC.MarketOrder[_id].status
    );
  }
  // function prodRating(uint _id,uint _nos) external view returns(string memory _rating) {
  //   return SPEC.prodRating[_id][_nos];
  // }
  // function prodQuantity(uint _id) external view returns(uint count) {
  //   return SPEC.prodQuantity[_id];
  // }
  
  function checkUser() external view returns(uint status){
    if(msg.sender == SPEC.owner){
      return 2;
    }
    if(SPEC.Consumer[msg.sender].userStatus){
      return 1;
    }
      return 0;
  }
  event SignUp(address indexed user, string name);
  event addItem(string user, string name,uint product_id);
  event order(address indexed user, uint id);
}

library SafeMath {
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a, "SafeMath: addition overflow");
    return c;
  }
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    return sub(a, b, "SafeMath: subtraction overflow");
  }
  function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    require(b <= a, errorMessage);
    uint256 c = a - b;
    return c;
  }

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    require(c / a == b, "SafeMath: multiplication overflow");
    return c;
  }
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    return div(a, b, "SafeMath: division by zero");
  }
  function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    require(b > 0, errorMessage);
    uint256 c = a / b;
    return c;
  }
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    return mod(a, b, "SafeMath: modulo by zero");
  }
  function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    require(b != 0, errorMessage);
    return a % b;
  }
}

contract SpecTokenModifiers {
  mapping (address => uint256) public balanceOf;
	mapping (address => uint256) public freezeOf;
  mapping (address => mapping (address => uint256)) public allowance;

  modifier isGreaterThanZero(uint256 _value) {
    require(_value > 0, "Value must be greater than zero");
    _;
  }
  modifier isValidAddress(address _add) {
    require(_add != address(0),"Use burn() instead");
    _;
  }
  modifier isSufficientBalance(uint256 _value,address _add) {
    require(balanceOf[_add] >= _value,"insufficient funds");
    _;
  }
}

contract SpecToken is SpecTokenModifiers {
  using SafeMath for uint256;
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;
  uint public tokenPrice;
	address payable  owner;
	address payable self ;
  event Transfer(address indexed from, address indexed to, uint256 count);
  event Burn(address indexed from, uint256 count);
constructor() public {
	owner = msg.sender;  // Contract owner address
	self = address(this);
  balanceOf[owner] = 0;  // Give the creator all initial tokens
  totalSupply = 0;  // Update total supply
  name = "SpecToken";  // Set the name for display purposes
  symbol = "SPC";  // Set the symbol for display purposes
  decimals = 2;  // Amount of decimals for display purposes
  tokenPrice = 0.000005 ether;
}
function transfer(address _to, uint256 _count) public
  isGreaterThanZero(_count)
  isValidAddress(_to)
  isSufficientBalance(_count,msg.sender)
  returns (bool success){
    balanceOf[msg.sender] = balanceOf[msg.sender].sub(_count); 
    balanceOf[_to] = balanceOf[_to].add(_count);
    emit Transfer(msg.sender, _to, _count); 
    return true;
}
function approve(address _spender, uint256 _count) public
  isGreaterThanZero(_count) 
  returns (bool success) {
    allowance[msg.sender][_spender] = _count;
    return true;
}
function transferFrom(address _from, address _to, uint256 _count) public
  isGreaterThanZero(_count)
  isValidAddress(_to)
  isSufficientBalance(_count,_from)
  returns (bool success) {
    require(_count <= allowance[_from][msg.sender],"Transfer not allowed from this contract");   // Check allowance
    balanceOf[_from] = balanceOf[_from].sub(_count);   // Subtract from the sender
    balanceOf[_to] = balanceOf[_to].add(_count);   // Add the same to the recipient
    allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_count);
    emit Transfer(_from, _to, _count);
    return true;
}
function mint(address _to, uint256 _count) public
  isValidAddress(_to)
  returns (bool success) {
    totalSupply = totalSupply.add(_count);
    balanceOf[_to] = balanceOf[_to].add(_count);
    emit Transfer(address(0), _to, _count);
    return true;
}
function burn(uint256 _count) public
  isGreaterThanZero(_count)
  isSufficientBalance(_count,msg.sender)
  returns (bool success) {
    balanceOf[msg.sender] = balanceOf[msg.sender].sub(_count);  // Subtract from the sender
    totalSupply = totalSupply.sub(_count);  // Updates totalSupply
    emit Burn(msg.sender, _count);
    return true;
}
function withdrawEther(uint _count) internal {
  burn(_count);
  uint ethAmount = _count * 0.000005 ether;
  msg.sender.transfer(ethAmount);
}

fallback() external payable {
	uint count = msg.value/tokenPrice;
    uint balance = msg.value - count*tokenPrice;
    mint(msg.sender,count);
    msg.sender.transfer(balance);
}
receive() external payable {
	revert();
}
function buyToken(uint _count) internal  {
  mint(msg.sender,_count);
  emit Transfer(address(0), msg.sender, _count);
} 
function sendTokens(uint256 _count) internal {
  balanceOf[self] = balanceOf[self].add(_count);
  balanceOf[msg.sender] = balanceOf[msg.sender].sub(_count);
}
function collectTokens(uint256 _count) internal{
  balanceOf[self] = balanceOf[self].sub(_count);
  balanceOf[msg.sender] = balanceOf[msg.sender].add(_count);
}
function sentTokensToUser(address _user, uint256 _count) internal {
  balanceOf[self] = balanceOf[self].sub(_count);
  balanceOf[_user] = balanceOf[_user].add(_count);
}
function spkDetails()external view returns (
  string memory tokenName,
  string memory tokenSymbol,
  uint8 tokenDecimals,
  uint256 tokenTotalSupply,
  uint specTokenPrice,
  address tokenOwner,
  address specTokenAddress,
  uint etherBal,
  uint256 tokenBalance){
    return (name,symbol,decimals,totalSupply,tokenPrice,owner,self,self.balance,balanceOf[self]);
}
}

contract SpecKart is SpecRead, SpecToken{
  constructor () public {
    SPEC.P_ID = 100;
    SPEC.O_ID = 1000;
    SPEC.owner = msg.sender;
  }
  function userSignUp(string calldata _userName, uint _userContact,
    string calldata _userGender, string calldata _userEmail,
    string calldata _userAddr) external notAdmin {
      SPEC.Consumer[msg.sender].userName = _userName;
      SPEC.Consumer[msg.sender].userContact = _userContact;
      SPEC.Consumer[msg.sender].userGender = _userGender;
      SPEC.Consumer[msg.sender].userEmail = _userEmail;
      SPEC.Consumer[msg.sender].userAddr = _userAddr;
      SPEC.Consumer[msg.sender].userStatus = true;
      emit SignUp(msg.sender, _userName);
  }

  function addProduct(string calldata _itemName,
   string calldata _itemType,
    uint _itemPrice,
     string calldata _itemDetails,
     string calldata _itemBrand,
     string calldata _itemColor,
      string calldata _imageId) external onlyAdmin{
      SPEC.Product[SPEC.P_ID].itemName = _itemName;
      SPEC.Product[SPEC.P_ID].itemType = _itemType;
      SPEC.Product[SPEC.P_ID].itemPrice = _itemPrice;
      SPEC.Product[SPEC.P_ID].itemDetails = _itemDetails;
      SPEC.Product[SPEC.P_ID].itemBrand = _itemBrand;
      SPEC.Product[SPEC.P_ID].itemColor = _itemColor;
      SPEC.Product[SPEC.P_ID].imageId = _imageId;
      // SPEC.Product[SPEC.P_ID].ratingCount = 0;
      SPEC.P_ID++;
      emit addItem(_itemName, _itemType,SPEC.P_ID);
  }
  function createOrder(string calldata _orderDetails, uint _totalPrice) external onlyUser{
      SPEC.MarketOrder[SPEC.O_ID].consumerAddr = msg.sender;
      SPEC.MarketOrder[SPEC.O_ID].timeStamp = now;
      SPEC.MarketOrder[SPEC.O_ID].orderDetails = _orderDetails;
      SPEC.MarketOrder[SPEC.O_ID].totalPrice = _totalPrice;
      SPEC.MarketOrder[SPEC.O_ID].status = 0;
      SPEC.Consumer[msg.sender].orders.push(SPEC.O_ID);
      SPEC.O_ID++;
      sendTokens(_totalPrice);
      emit order(msg.sender, SPEC.O_ID);
  }
  function confirmOrder(uint _oId) external onlyAdmin{
    SPEC.MarketOrder[_oId].status = 1;
    SPEC.confirmedOrder.push(_oId);
    collectTokens(SPEC.MarketOrder[_oId].totalPrice);
    emit order(msg.sender, _oId);
  }
  function cancelOrder(uint _oId) external onlyUser{
    require(SPEC.MarketOrder[_oId].consumerAddr == msg.sender, "Invalid User");
    SPEC.MarketOrder[_oId].status = 3;
    collectTokens(SPEC.MarketOrder[_oId].totalPrice);
    emit order(msg.sender, _oId);
  }
  function rejectOrder(uint _oId) external onlyAdmin{
    SPEC.MarketOrder[_oId].status = 2;
    SPEC.rejectedOrder.push(_oId);
    sentTokensToUser(SPEC.MarketOrder[_oId].consumerAddr,SPEC.MarketOrder[_oId].totalPrice);
    emit order(msg.sender, _oId);
  }
  function purchaseToken() external payable{
    uint count = (msg.value).div(tokenPrice);
    uint balance = (msg.value).sub(count.mul(tokenPrice));
    msg.sender.transfer(balance);
    buyToken(count);
  }
  function sellToken(uint _count) external {
    uint amount = _count.mul(tokenPrice);
    msg.sender.transfer(amount);
    burn(_count);
  }
}
