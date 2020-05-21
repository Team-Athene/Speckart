pragma solidity ^0.6.8;

library SpecEnums {
    enum UserType {noUser, buyer, seller}
    enum status {onSale, ordered, confirmed, rejected, shipped, delivered, onDispute, cancelled}
}

library SpecLibrary {
    using SpecEnums for SpecEnums.UserType;
    using SpecEnums for SpecEnums.status;
  struct User{
    string userName;
    uint256 userContact;
    string userGender;
    string userEmail;
    string userAddr;
    uint256[] orders;
    SpecEnums.UserType userType;
  }
  struct Item{
    string itemName;
    string itemType;
    uint256 itemPrice;
    string itemDetails;
    string itemBrand;
    string itemColor;
    string imageId;
    SpecEnums.status status;
    uint256 availableCount;
    // uint256 ratingCount;
    uint256 disputePrice;
    // address payable buyer;
    address payable seller;
    // bool isOrdered;
    // bool isConfirmed;
    // bool isRejected;
    // bool isDispute;
    // bool isShipped;
    // bool confirmDelivery;
  }
  struct Order{
    address BuyerAddr;
    uint256 timeStamp;
    string orderDetails;
    uint256 totalPrice;
    mapping( uint256 => uint256 ) prodCount;
    mapping( uint256 => bool ) isOrdered;
    mapping( uint256 => bool ) isConfirmed;
    mapping( uint256 => bool ) isRejected;
    mapping( uint256 => bool ) isDispute;
    mapping( uint256 => bool ) isShipped;
    mapping( uint256 => bool ) confirmDelivery;
    mapping( uint256 => bool ) isCancelled;
  }
    struct DisputeStruct {
        uint256 productId;
        string comment;
        uint256 bVote;
        uint256 sVote;
        uint256 count;
        mapping(uint256 => mapping(uint256 => address payable)) votedAdmin;
        bool isDisputeCleared;
    }
  struct SpecModel{
    // address payable owner;
    uint256 P_ID;
    uint256 D_ID;
    uint256 O_ID;
    
    address[] admins;
    uint256 MIN_TIME;
    uint256 MAX_TIME;
    /********************************/
    uint256[] confirmedOrder;
    uint256[] rejectedOrder;
    
    /********************************/
    mapping (address => User) Users;
    // mapping (address =>User) Buyer;
    mapping (uint256 => Item) Product;
    mapping (uint256 => Order) MarketOrder;
    mapping(uint256 => DisputeStruct) Dispute;
    mapping(address => mapping(uint256 => bool)) isVoted;
    // mapping(uint256 => mapping(uint256 => string)) prodRating;
    // mapping(uint256 => uint256) prodQuantity;
    /********************************/
    mapping(address => uint256[]) productList;
    
    /********************************/
  }
}

contract SpecVariables {
  using SpecLibrary for SpecLibrary.SpecModel;
  SpecLibrary.SpecModel  SPEC;
}

contract SpecRead is SpecVariables{
  modifier onlyAdmin()  {
        require(checkAdmin(msg.sender) == true, "Not An Admin");
  _;
  }
//   modifier notAdmin() {
//   require(SPEC.owner != msg.sender,'Admin not allowed');
//   _;
//   }
  modifier onlySeller() {
    require(uint256(SPEC.Users[msg.sender].userType) == 2,'only seller');
    _;
  }
  modifier onlyBuyer() {
    require(uint256(SPEC.Users[msg.sender].userType) == 1,'only buyer');
    _;
  }
  modifier newUser()  {
        require(checkUser() == 0, "Not An Admin");
  _;
  }
//   function owner() external view returns(address) {
//     return SPEC.owner;
//   }
  function totalProductID() external view returns(uint256) {
    return SPEC.P_ID;
  }
  function totalDisputeID() external view returns(uint256) {
    return SPEC.D_ID;
  }
  function currentOrderID() external view returns(uint256) {
    return SPEC.O_ID;
  }
  function userDetails() external view returns(
    string memory userName,
    uint256 userContact,
    string memory userGender,
    string memory userEmail,
    string memory userAddr,
    uint256[] memory orders, uint256 userType) {
    return (
      SPEC.Users[msg.sender].userName,
      SPEC.Users[msg.sender].userContact,
      SPEC.Users[msg.sender].userGender,
      SPEC.Users[msg.sender].userEmail,
      SPEC.Users[msg.sender].userAddr,
      SPEC.Users[msg.sender].orders,
      uint256(SPEC.Users[msg.sender].userType)
    );
  }
  function product1(uint256 _id) public view returns(
    string memory itemName,
    uint256 itemPrice,
    string memory imageId,
    uint256 itemCount,
    uint256 status) {
    return (
      SPEC.Product[_id].itemName,
      SPEC.Product[_id].itemPrice,
      SPEC.Product[_id].imageId,
      // SPEC.Product[_id].ratingCount
      SPEC.Product[_id].availableCount,
      uint256(SPEC.Product[_id].status));
  }
  function product2(uint256 _id) public view returns(
    string memory itemColor,
    uint256 disputePrice,
    string memory itemType,
    string memory itemDetails,
    string memory itemBrand) {
    return (
      SPEC.Product[_id].itemColor,
      SPEC.Product[_id].disputePrice,
      SPEC.Product[_id].itemType,
      SPEC.Product[_id].itemDetails,
      SPEC.Product[_id].itemBrand);
  }
//   function productOrder(uint256 _id) external view returns(
//     // address[] memory buyer_seller,
//     // address memory seller,
//     bool isOrdered,
//     bool isConfirmed,
//     bool isRejected,
//     bool isDispute,
//     bool isShipped,
//     bool confirmDelivery) {
//     return (
//     //   [SPEC.Product[_id].buyer,
//     //   SPEC.Product[_id].seller],
//       SPEC.Product[_id].isOrdered,
//       SPEC.Product[_id].isConfirmed,
//       SPEC.Product[_id].isRejected,
//       SPEC.Product[_id].isDispute,
//       SPEC.Product[_id].isShipped,
//       SPEC.Product[_id].confirmDelivery
//       // SPEC.Product[_id].ratingCount
//     );
//   }
  function marketOrder(uint256 _id) external view returns(
    address BuyerAddr,
    uint256 timeStamp,
    string memory orderDetails,
    uint256 totalPrice) {
    return (
      SPEC.MarketOrder[_id].BuyerAddr,
      SPEC.MarketOrder[_id].timeStamp,
      SPEC.MarketOrder[_id].orderDetails,
      SPEC.MarketOrder[_id].totalPrice
    );
  }  
  function productOrder(uint256 _o_id, uint256 _p_id) external view returns(
    // address[] memory buyer_seller,
    // address memory seller,
    bool isOrdered,
    bool isConfirmed,
    bool isRejected,
    bool isDispute,
    bool isShipped,
    bool confirmDelivery) {
    return (
    //   [SPEC.Product[_id].buyer,
    //   SPEC.Product[_id].seller],
    SPEC.MarketOrder[_o_id].isOrdered[_p_id],
      SPEC.MarketOrder[_o_id].isConfirmed[_p_id],
      SPEC.MarketOrder[_o_id].isRejected[_p_id],
      SPEC.MarketOrder[_o_id].isDispute[_p_id],
      SPEC.MarketOrder[_o_id].isShipped[_p_id],
      SPEC.MarketOrder[_o_id].confirmDelivery[_p_id]
      // SPEC.Product[_id].ratingCount
    );
  }
  // function prodRating(uint256 _id,uint256 _nos) external view returns(string memory _rating) {
  //   return SPEC.prodRating[_id][_nos];
  // }
  // function prodQuantity(uint256 _id) external view returns(uint256 count) {
  //   return SPEC.prodQuantity[_id];
  // }
  
  function checkUser() public view returns(uint256 status){
    if(checkAdmin(msg.sender) == true){
      return 3;
    }
    if(uint256(SPEC.Users[msg.sender].userType) == 2){
      return 2;
    } else if(uint256(SPEC.Users[msg.sender].userType) == 1){
      return 1;
    }
      return 0;
  }
function checkAdmin(address _admin) internal view returns (bool) {
        for (uint256 i = 0; i < SPEC.admins.length; i++) {
            if (_admin == SPEC.admins[i]) {
                return true;
            }
        }
        return false;
    }
  event SignUp(address indexed user, string name);
  event addItem(string user, string name,uint256 product_id);
  event order(address indexed user, uint256 id);
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

contract SpecToken {
  using SafeMath for uint256;  
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
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;
  uint256 public tokenPrice;
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
function withdrawEther(uint256 _count) internal {
  burn(_count);
  uint256 ethAmount = _count * 0.000005 ether;
  msg.sender.transfer(ethAmount);
}

fallback() external payable {
	uint256 count = msg.value/tokenPrice;
    uint256 balance = msg.value - count*tokenPrice;
    mint(msg.sender,count);
    msg.sender.transfer(balance);
}
receive() external payable {
	revert();
}
function buyToken(uint256 _count) internal  {
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
  uint256 specTokenPrice,
  address tokenOwner,
  address specTokenAddress,
  uint256 etherBal,
  uint256 tokenBalance){
    return (name,symbol,decimals,totalSupply,tokenPrice,owner,self,self.balance,balanceOf[self]);
}
}

contract SpecKart is SpecRead, SpecToken{
  constructor () public {
    SPEC.P_ID = 100;
    SPEC.D_ID = 1000;
    SPEC.O_ID = 10000;
    // SPEC.owner = msg.sender;
  }
  function userSignUp(string calldata _userName, uint256 _userContact,
    string calldata _userGender, string calldata _userEmail,
    string calldata _userAddr, uint256 _type) external newUser() {
      SPEC.Users[msg.sender].userName = _userName;
      SPEC.Users[msg.sender].userContact = _userContact;
      SPEC.Users[msg.sender].userGender = _userGender;
      SPEC.Users[msg.sender].userEmail = _userEmail;
      SPEC.Users[msg.sender].userAddr = _userAddr;
      SPEC.Users[msg.sender].userType = SpecEnums.UserType(_type);
      emit SignUp(msg.sender, _userName);
  }

  function addProduct(string calldata _itemName,
   string calldata _itemType,
    uint256 _itemPrice,
    uint256 _availableCount,
     string calldata _itemDetails,
     string calldata _itemBrand,
     string calldata _itemColor,
      string calldata _imageId) external onlySeller{
      require(balanceOf[msg.sender] >= _itemPrice.div(100), "Insufficient Dispute value");
      SPEC.Product[SPEC.P_ID].itemName = _itemName;
      SPEC.Product[SPEC.P_ID].itemType = _itemType;
      SPEC.Product[SPEC.P_ID].itemPrice = _itemPrice;
      SPEC.Product[SPEC.P_ID].itemDetails = _itemDetails;
      SPEC.Product[SPEC.P_ID].itemBrand = _itemBrand;
      SPEC.Product[SPEC.P_ID].availableCount = _availableCount;
      SPEC.Product[SPEC.P_ID].itemColor = _itemColor;
      SPEC.Product[SPEC.P_ID].imageId = _imageId;
      SPEC.Product[SPEC.P_ID].seller = msg.sender;
      SPEC.Product[SPEC.P_ID].disputePrice = _itemPrice.div(100);
      SPEC.Product[SPEC.P_ID].status = SpecEnums.status(0);
      transfer(self, SPEC.Product[SPEC.P_ID].disputePrice.mul(_availableCount));
      SPEC.P_ID++;
      emit addItem(_itemName, _itemType,SPEC.P_ID);
  }
  
  function createOrder(string calldata _orderDetails, uint256[] calldata _prodIds, uint256[] calldata _prodCounts, uint256 _totalPrice) external onlyBuyer{
      for(uint32 i = 0; i< _prodIds.length; i++) {
      require(SPEC.MarketOrder[SPEC.O_ID].isOrdered[_prodIds[i]] == false, "Product Already Ordered");
        require(SPEC.MarketOrder[SPEC.O_ID].isDispute[_prodIds[i]] == false, "Product is on Dispute");
        require(SPEC.Product[_prodIds[i]].availableCount >= _prodCounts[i], "Insufficient quantity of products to purchase");
        require(
            balanceOf[msg.sender] >= SPEC.Product[_prodIds[i]].disputePrice.add(SPEC.Product[_prodIds[i]].itemPrice),
            "Insufficient Ethereum"
        );
      }
      uint disputeTotal = 0;
      for(uint32 i = 0; i< _prodIds.length; i++) {
        // SPEC.Product[_prodIds[i]].buyer = msg.sender;
        disputeTotal += SPEC.Product[_prodIds[i]].disputePrice;
        SPEC.Product[_prodIds[i]].availableCount -= _prodCounts[i];
        // SPEC.Product[_prodIds[i]].isOrdered = true;
        SPEC.MarketOrder[SPEC.O_ID].isOrdered[_prodIds[i]] = true;
      }
      
      SPEC.MarketOrder[SPEC.O_ID].BuyerAddr = msg.sender;
      SPEC.MarketOrder[SPEC.O_ID].timeStamp = now;
      SPEC.MarketOrder[SPEC.O_ID].orderDetails = _orderDetails;
      SPEC.MarketOrder[SPEC.O_ID].totalPrice = _totalPrice;
      SPEC.Users[msg.sender].orders.push(SPEC.O_ID);
      SPEC.O_ID++;
      sendTokens(_totalPrice.add(disputeTotal));
      emit order(msg.sender, SPEC.O_ID);
  }
  function confirmOrder(uint256 _o_Id, uint256 _p_Id) external onlySeller{
      require(SPEC.Product[_p_Id].seller ==msg.sender);
      require(SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true && SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == false  
      && SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false && SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == false  
      && SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false && SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false
      && SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false);
      SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] = true;
      // collectTokens(SPEC.MarketOrder[_oId].totalPrice);
      emit order(msg.sender, _o_Id);
  }
  function rejectOrder(uint256 _o_Id, uint256 _p_Id) external onlySeller{
      require(SPEC.Product[_p_Id].seller ==msg.sender);
      require(SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true && SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == false  
      && SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false && SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == false  
      && SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false && SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false
      && SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false);
      SPEC.MarketOrder[_o_Id].isRejected[_p_Id] = true;
      sentTokensToUser(SPEC.MarketOrder[_o_Id].BuyerAddr, SPEC.Product[_p_Id].itemPrice.add(SPEC.Product[_p_Id].disputePrice));
      SPEC.Product[_p_Id].availableCount += SPEC.MarketOrder[_o_Id].prodCount[_p_Id];
      emit order(msg.sender, _o_Id);
  }
  function shipOrder(uint256 _o_Id, uint256 _p_Id) external onlySeller{
      require(SPEC.Product[_p_Id].seller ==msg.sender);
      require(SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true && SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == true 
      && SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == false  && SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false 
      && SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false  && SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false
      && SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false);
      SPEC.MarketOrder[_o_Id].isShipped[_p_Id] = true;
      // collectTokens(SPEC.MarketOrder[_oId].totalPrice);
      emit order(msg.sender, _o_Id);
  }
  function confirmDelivery(uint256 _o_Id, uint256 _p_Id) external onlyBuyer{
      require(SPEC.MarketOrder[_o_Id].BuyerAddr == msg.sender);
      require(SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true && SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == true 
      && SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false && SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == true   
      && SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false && SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false
      && SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false);
      SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] = true;
      sentTokensToUser(SPEC.Product[_p_Id].seller, SPEC.Product[_p_Id].itemPrice.add(SPEC.Product[_p_Id].disputePrice));
      emit order(msg.sender, _o_Id);
  }
  
  function cancelOrder(uint256 _o_Id, uint256 _p_Id) external onlyBuyer{
    require(SPEC.MarketOrder[_o_Id].BuyerAddr == msg.sender, "Invalid User");
    SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] = true;
    collectTokens(SPEC.Product[_p_Id].itemPrice.add(SPEC.Product[_p_Id].disputePrice));
    SPEC.Product[_p_Id].availableCount += SPEC.MarketOrder[_o_Id].prodCount[_p_Id];
    emit order(msg.sender, _o_Id);
  }
  
//   function ConfirmDelivery(uint256 _P_ID) external {
//         require(uint256(user[msg.sender].userType) == 1, "Invalid User");
//         require(product[_P_ID].buyer == msg.sender, "Must be a Buyer");
//         require(product[_P_ID].isShipped == true, "Product is Not Shipped");
//         product[_P_ID].seller.transfer(product[_P_ID].amount);
//         product[_P_ID].buyer.transfer(product[_P_ID].disputePrice.div(2));
//         product[_P_ID].seller.transfer(product[_P_ID].disputePrice.div(2));
//         product[_P_ID].amount = 0;
//         product[_P_ID].disputePrice = 0;
//         product[_P_ID].confirmDelivery = true;
//     }

//     function ClaimAmount(uint256 _P_ID) external {
//         require(uint256(user[msg.sender].userType) == 1, "Invalid User");
//         require(
//             now > MAX_TIME + product[_P_ID].orderTime,
//             "after 60 days only"
//         );
//         require(product[_P_ID].buyer == msg.sender, "Must be a Buyer");
//         require(product[_P_ID].isDispute == false, "The Product is on Dispute");
//         product[_P_ID].buyer.transfer(product[_P_ID].amount);
//         product[_P_ID].buyer.transfer(product[_P_ID].disputePrice.div(2));
//         product[_P_ID].amount = 0;
//         product[_P_ID].orderTime = 0;
//         product[_P_ID].disputePrice = product[_P_ID].disputePrice.div(2);
//         product[_P_ID].buyer = address(0);
//         product[_P_ID].isOrdered = false;
//         product[_P_ID].isShipped = false;
//     }

//     function DisputeCreation(uint256 _P_ID, string calldata _comment) external {
//         require(
//             now > MIN_TIME + product[_P_ID].orderTime &&
//                 (now < MAX_TIME + product[_P_ID].orderTime),
//             "inbetween 30 to 60 days only"
//         );
//         require(uint256(user[msg.sender].userType) == 2, "Invalid User");
//         require(product[_P_ID].seller == msg.sender, "Must be a Seller");
//         require(
//             product[_P_ID].isDispute == false &&
//                 product[_P_ID].isShipped == true &&
//                 product[_P_ID].confirmDelivery == false,
//             "Product is either not Shipped or already Confirmed"
//         );
//         D_ID++;
//         dispute[D_ID].productId = _P_ID;
//         dispute[D_ID].comment = _comment;
//         product[_P_ID].isDispute = true;
//     }

//     function DisputeVoting(uint256 _D_ID, uint256 _vote) external {
//         require(indexOf(admins, msg.sender) != uint256(-1), "Not An Admin");
//         require(isVoted[msg.sender][_D_ID] == false, "Admin has already Voted");
//         require(
//             dispute[_D_ID].isDisputeCleared == false,
//             "Dispute Already Cleared"
//         );
//         require(dispute[_D_ID].count <= admins.length, "Maximum Vote Reached");
//         if (_vote == 2) {
//             dispute[_D_ID].bVote++;
//         }
//         if (_vote == 1) {
//             dispute[_D_ID].sVote++;
//         }
//         dispute[_D_ID].count++;
//         dispute[_D_ID].votedAdmin[dispute[_D_ID].count][_vote] = msg.sender;
//         isVoted[msg.sender][_D_ID] = true;
//         if (dispute[_D_ID].count == admins.length) {
//             if (dispute[_D_ID].bVote > dispute[_D_ID].sVote) {
//                 // buyer wins
//                 product[dispute[_D_ID].productId].buyer.transfer(
//                     product[dispute[_D_ID].productId].amount
//                 );
//                 product[dispute[_D_ID].productId].buyer.transfer(
//                     product[dispute[_D_ID].productId].disputePrice.div(2)
//                 );
//                 product[dispute[_D_ID].productId]
//                     .disputePrice = product[dispute[_D_ID].productId]
//                     .disputePrice
//                     .div(2);
//                 product[dispute[_D_ID].productId].buyer = address(0);
//                 product[dispute[_D_ID].productId].isShipped = false;
//                 product[dispute[_D_ID].productId].orderTime = 0;
//                 PayAdmin(_D_ID, 2);
//             } else {
//                 // seller wins
//                 product[dispute[_D_ID].productId].seller.transfer(
//                     product[dispute[_D_ID].productId].amount
//                 );
//                 product[dispute[_D_ID].productId].seller.transfer(
//                     product[dispute[_D_ID].productId].disputePrice.div(2)
//                 );
//                 product[dispute[_D_ID].productId]
//                     .disputePrice = product[dispute[_D_ID].productId]
//                     .disputePrice
//                     .div(2);
//                 product[dispute[_D_ID].productId].confirmDelivery = true;
//                 PayAdmin(_D_ID, 1);
//             }
//             product[dispute[_D_ID].productId].amount = 0;
//             product[dispute[_D_ID].productId].disputePrice = 0;
//             dispute[_D_ID].isDisputeCleared = true;
//         }
//     }

//     function PayAdmin(uint256 _D_ID, uint256 _vote) internal {
//         uint256 count;
//         if (_vote == 2) {
//             count = dispute[_D_ID].bVote;
//         }
//         if (_vote == 1) {
//             count = dispute[_D_ID].sVote;
//         }
//         for (uint256 i = 1; i <= admins.length; i++) {
//             if (dispute[_D_ID].votedAdmin[i][_vote] != address(0)) {
//                 dispute[_D_ID].votedAdmin[i][_vote].transfer(
//                     product[dispute[_D_ID].productId].disputePrice.div(count)
//                 );
//             }
//         }
//     }
    
//     function isVotedCheck(address _addr, uint256 _D_ID)
//         external
//         view
//         returns (bool)
//     {
//         return (isVoted[_addr][_D_ID]);
//     }
    
  function purchaseToken() external payable{
    uint256 count = (msg.value).div(tokenPrice);
    uint256 balance = (msg.value).sub(count.mul(tokenPrice));
    msg.sender.transfer(balance);
    buyToken(count);
  }
  function sellToken(uint256 _count) external {
    uint256 amount = _count.mul(tokenPrice);
    msg.sender.transfer(amount);
    burn(_count);
  }
}
