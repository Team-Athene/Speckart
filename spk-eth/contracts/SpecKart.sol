pragma solidity ^0.6.8;


library SpecEnums {
    enum UserType {noUser, buyer, seller}
}


library SpecLibrary {
    using SpecEnums for SpecEnums.UserType;
    struct User {
        bytes32 userName;
        uint256 userContact;
        uint8 userGender;
        bytes32 userEmail;
        string userAddr;
        uint256[] orders;
        SpecEnums.UserType userType;
    }
    struct Item {
        bytes32 itemName;
        uint8 itemType;
        uint256 itemPrice;
        bytes32 itemDetails;
        bytes32 itemBrand;
        uint8 itemColor;
        bytes32 imageId;
        uint256 availableCount;
        uint256 disputePrice;
        address payable seller;
    }
    struct Order {
        address BuyerAddr;
        uint256 timeStamp;
        string orderDetails;
        uint256 totalPrice;
        mapping(uint256 => uint256) prodCount;
        mapping(uint256 => bool) isOrdered;
        mapping(uint256 => bool) isConfirmed;
        mapping(uint256 => bool) isRejected;
        mapping(uint256 => bool) isDispute;
        mapping(uint256 => bool) isShipped;
        mapping(uint256 => bool) confirmDelivery;
        mapping(uint256 => bool) isCancelled;
    }
    struct DisputeStruct {
        uint256 productId;
        bytes32 comment;
        uint256 bVote;
        uint256 sVote;
        uint256 count;
        mapping(uint256 => mapping(uint256 => address payable)) votedAdmin;
        bool isDisputeCleared;
    }

    struct SpecModel {
        uint256 P_ID;
        uint256 D_ID;
        uint256 O_ID;
        address[] admins;
        mapping(address => User) Users;
        mapping(uint256 => Item) Product;
        mapping(uint256 => Order) MarketOrder;
        mapping(uint256 => DisputeStruct) Dispute;
        mapping(address => mapping(uint256 => bool)) isVoted;
        mapping(address => uint256[]) orderList;
        mapping(address => mapping(uint256 => uint256[])) prodList;
    }
}


contract SpecVariables {
    using SpecLibrary for SpecLibrary.SpecModel;
    SpecLibrary.SpecModel SPEC;
}


contract SpecRead is SpecVariables {
    modifier onlyAdmin() {
        require(checkAdmin(msg.sender) == true, "Not An Admin");
        _;
    }
    modifier onlySeller() {
        require(uint256(SPEC.Users[msg.sender].userType) == 2, "only seller");
        _;
    }
    modifier onlyBuyer() {
        require(uint256(SPEC.Users[msg.sender].userType) == 1, "only buyer");
        _;
    }
    modifier newUser() {
        require(checkUser() == 0, "Not An Admin");
        _;
    }

    function totalProductID() external view returns (uint256) {
        return SPEC.P_ID;
    }

    function totalDisputeID() external view returns (uint256) {
        return SPEC.D_ID;
    }

    function currentOrderID() external view returns (uint256) {
        return SPEC.O_ID;
    }

    function orders(address _seller)
        external
        view
        returns (uint256[] memory orderId)
    {
        return (SPEC.orderList[_seller]);
    }

    function productsList(address _seller, uint256 _o_id)
        external
        view
        returns (uint256[] memory prodId)
    {
        return (SPEC.prodList[_seller][_o_id]);
    }

    function product1(uint256 _id)
        public
        view
        returns (
            bytes32 itemName,
            uint256 itemPrice,
            bytes32 imageId,
            uint256 availableCount
        )
    {
        return (
            SPEC.Product[_id].itemName,
            SPEC.Product[_id].itemPrice,
            SPEC.Product[_id].imageId,
            SPEC.Product[_id].availableCount
        );
    }

    function product2(uint256 _id)
        public
        view
        returns (
            uint8 itemColor,
            uint256 disputePrice,
            uint8 itemType,
            bytes32 itemDetails,
            bytes32 itemBrand
        )
    {
        return (
            SPEC.Product[_id].itemColor,
            SPEC.Product[_id].disputePrice,
            SPEC.Product[_id].itemType,
            SPEC.Product[_id].itemDetails,
            SPEC.Product[_id].itemBrand
        );
    }

    function userOrderDetails(address _addr)
        external
        view
        returns (
            bytes32 userName,
            uint256 userContact,
            bytes32 userEmail,
            string memory userAddr
        )
    {
        return (
            SPEC.Users[_addr].userName,
            SPEC.Users[_addr].userContact,
            SPEC.Users[_addr].userEmail,
            SPEC.Users[_addr].userAddr
        );
    }

    function userDetails()
        external
        view
        returns (
            bytes32 userName,
            uint256 userContact,
            uint8 userGender,
            bytes32 userEmail,
            string memory userAddr,
            uint256[] memory orders,
            uint8 userType
        )
    {
        return (
            SPEC.Users[msg.sender].userName,
            SPEC.Users[msg.sender].userContact,
            SPEC.Users[msg.sender].userGender,
            SPEC.Users[msg.sender].userEmail,
            SPEC.Users[msg.sender].userAddr,
            SPEC.Users[msg.sender].orders,
            uint8(SPEC.Users[msg.sender].userType)
        );
    }

    function marketOrder(uint256 _id)
        external
        view
        returns (
            address BuyerAddr,
            uint256 timeStamp,
            string memory orderDetails,
            uint256 totalPrice
        )
    {
        return (
            SPEC.MarketOrder[_id].BuyerAddr,
            SPEC.MarketOrder[_id].timeStamp,
            SPEC.MarketOrder[_id].orderDetails,
            SPEC.MarketOrder[_id].totalPrice
        );
    }

    function productOrder(uint256 _o_id, uint256 _p_id)
        external
        view
        returns (
            bool isConfirmed,
            bool isRejected,
            bool isDispute,
            bool isShipped,
            bool isCancelled,
            bool confirmDelivery
        )
    {
        return (
            SPEC.MarketOrder[_o_id].isConfirmed[_p_id],
            SPEC.MarketOrder[_o_id].isRejected[_p_id],
            SPEC.MarketOrder[_o_id].isDispute[_p_id],
            SPEC.MarketOrder[_o_id].isShipped[_p_id],
            SPEC.MarketOrder[_o_id].isCancelled[_p_id],
            SPEC.MarketOrder[_o_id].confirmDelivery[_p_id]
        );
    }

    function checkUser() public view returns (uint256 status) {
        if (checkAdmin(msg.sender) == true) {
            return 3;
        }
        if (uint256(SPEC.Users[msg.sender].userType) == 2) {
            return 2;
        } else if (uint256(SPEC.Users[msg.sender].userType) == 1) {
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

    event SignUp(address indexed user, bytes32 name);
    event addItem(bytes32 user, bytes32 name, uint256 product_id);
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

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
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

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}


contract SpecToken {
    using SafeMath for uint256;
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public freezeOf;
    mapping(address => mapping(address => uint256)) public allowance;

    modifier isGreaterThanZero(uint256 _value) {
        require(_value > 0, "Value must be greater than zero");
        _;
    }
    modifier isValidAddress(address _add) {
        require(_add != address(0), "Use burn() instead");
        _;
    }
    modifier isSufficientBalance(uint256 _value, address _add) {
        require(balanceOf[_add] >= _value, "insufficient funds");
        _;
    }
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public tokenPrice;
    address payable owner;
    address payable self;
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

    function transfer(address _to, uint256 _count)
        public
        isGreaterThanZero(_count)
        isValidAddress(_to)
        isSufficientBalance(_count, msg.sender)
        returns (bool success)
    {
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_count);
        balanceOf[_to] = balanceOf[_to].add(_count);
        emit Transfer(msg.sender, _to, _count);
        return true;
    }

    function mint(address _to, uint256 _count)
        public
        isValidAddress(_to)
        returns (bool success)
    {
        totalSupply = totalSupply.add(_count);
        balanceOf[_to] = balanceOf[_to].add(_count);
        emit Transfer(address(0), _to, _count);
        return true;
    }

    function burn(uint256 _count)
        public
        isGreaterThanZero(_count)
        isSufficientBalance(_count, msg.sender)
        returns (bool success)
    {
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_count);
        totalSupply = totalSupply.sub(_count);
        emit Burn(msg.sender, _count);
        return true;
    }

    function withdrawEther(uint256 _count) internal {
        burn(_count);
        uint256 ethAmount = _count * 0.000005 ether;
        msg.sender.transfer(ethAmount);
    }

    fallback() external payable {
        uint256 count = msg.value / tokenPrice;
        uint256 balance = msg.value - count * tokenPrice;
        mint(msg.sender, count);
        msg.sender.transfer(balance);
    }

    receive() external payable {
        revert();
    }

    function buyToken(uint256 _count) internal {
        mint(msg.sender, _count);
        emit Transfer(address(0), msg.sender, _count);
    }

    function sendTokens(uint256 _count) internal {
        balanceOf[self] = balanceOf[self].add(_count);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_count);
    }

    function collectTokens(uint256 _count) internal {
        balanceOf[self] = balanceOf[self].sub(_count);
        balanceOf[msg.sender] = balanceOf[msg.sender].add(_count);
    }

    function sentTokensToUser(address _user, uint256 _count) internal {
        balanceOf[self] = balanceOf[self].sub(_count);
        balanceOf[_user] = balanceOf[_user].add(_count);
    }

    function spkDetails()
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


contract SpecKart is SpecRead, SpecToken {
    constructor() public {
        SPEC.P_ID = 100;
        SPEC.D_ID = 1000;
        SPEC.O_ID = 10000;
    }

    function userSignUp(
        bytes32 _userName,
        uint256 _userContact,
        uint8 _userGender,
        bytes32 _userEmail,
        string calldata _userAddr,
        uint8 _type
    ) external newUser() {
        SPEC.Users[msg.sender].userName = _userName;
        SPEC.Users[msg.sender].userContact = _userContact;
        SPEC.Users[msg.sender].userGender = _userGender;
        SPEC.Users[msg.sender].userEmail = _userEmail;
        SPEC.Users[msg.sender].userAddr = _userAddr;
        SPEC.Users[msg.sender].userType = SpecEnums.UserType(_type);
        emit SignUp(msg.sender, _userName);
    }

    function addProduct(
        bytes32 _itemName,
        uint8 _itemType,
        uint256 _itemPrice,
        uint256 _availableCount,
        bytes32 _itemDetails,
        bytes32 _itemBrand,
        uint8 _itemColor,
        bytes32 _imageId
    ) external onlySeller {
        require(
            balanceOf[msg.sender] >= _itemPrice,
            "Insufficient Dispute value"
        );
        SPEC.Product[SPEC.P_ID].itemName = _itemName;
        SPEC.Product[SPEC.P_ID].itemType = _itemType;
        SPEC.Product[SPEC.P_ID].itemPrice = _itemPrice.mul(100);
        SPEC.Product[SPEC.P_ID].itemDetails = _itemDetails;
        SPEC.Product[SPEC.P_ID].itemBrand = _itemBrand;
        SPEC.Product[SPEC.P_ID].availableCount = _availableCount;
        SPEC.Product[SPEC.P_ID].itemColor = _itemColor;
        SPEC.Product[SPEC.P_ID].imageId = _imageId;
        SPEC.Product[SPEC.P_ID].seller = msg.sender;
        SPEC.Product[SPEC.P_ID].disputePrice = _itemPrice.div(100);
        transfer(
            self,
            SPEC.Product[SPEC.P_ID].disputePrice.mul(_availableCount)
        );
        SPEC.P_ID++;
        emit addItem(_itemName, _itemBrand, SPEC.P_ID);
    }

    function createOrder(
        string calldata _orderDetails,
        uint256[] calldata _prodIds,
        uint256[] calldata _prodCounts,
        uint256 _totalPrice
    ) external onlyBuyer {
        for (uint32 i = 0; i < _prodIds.length; i++) {
            require(
                SPEC.MarketOrder[SPEC.O_ID].isOrdered[_prodIds[i]] == false,
                "Product Already Ordered"
            );
            require(
                SPEC.MarketOrder[SPEC.O_ID].isDispute[_prodIds[i]] == false,
                "Product is on Dispute"
            );
            require(
                SPEC.Product[_prodIds[i]].availableCount >= _prodCounts[i],
                "Insufficient quantity of products to purchase"
            );
            require(
                balanceOf[msg.sender] >=
                    SPEC.Product[_prodIds[i]].disputePrice.add(
                        SPEC.Product[_prodIds[i]].itemPrice
                    ),
                "Insufficient Ethereum"
            );
        }
        uint256 disputeTotal = 0;
        for (uint32 i = 0; i < _prodIds.length; i++) {
            SPEC.orderList[SPEC.Product[_prodIds[i]].seller].push(SPEC.O_ID);
            SPEC.prodList[SPEC.Product[_prodIds[i]].seller][SPEC.O_ID].push(
                _prodIds[i]
            );
            disputeTotal += SPEC.Product[_prodIds[i]].disputePrice;
            SPEC.Product[_prodIds[i]].availableCount -= _prodCounts[i];
            SPEC.MarketOrder[SPEC.O_ID].isOrdered[_prodIds[i]] = true;
        }

        SPEC.MarketOrder[SPEC.O_ID].BuyerAddr = msg.sender;
        SPEC.MarketOrder[SPEC.O_ID].timeStamp = now;
        SPEC.MarketOrder[SPEC.O_ID].orderDetails = _orderDetails;
        SPEC.MarketOrder[SPEC.O_ID].totalPrice = _totalPrice * 100;
        SPEC.Users[msg.sender].orders.push(SPEC.O_ID);
        SPEC.O_ID++;
        sendTokens(_totalPrice.add(disputeTotal));
        emit order(msg.sender, SPEC.O_ID);
    }

    function confirmOrder(uint256 _o_Id, uint256 _p_Id) external onlySeller {
        require(SPEC.Product[_p_Id].seller == msg.sender);
        require(
            SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false
        );
        SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] = true;
        emit order(msg.sender, _o_Id);
    }

    function rejectOrder(uint256 _o_Id, uint256 _p_Id) external onlySeller {
        require(SPEC.Product[_p_Id].seller == msg.sender);
        require(
            SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false
        );
        SPEC.MarketOrder[_o_Id].isRejected[_p_Id] = true;
        sentTokensToUser(
            SPEC.MarketOrder[_o_Id].BuyerAddr,
            SPEC.Product[_p_Id].itemPrice.add(SPEC.Product[_p_Id].disputePrice)
        );
        SPEC.Product[_p_Id].availableCount += SPEC.MarketOrder[_o_Id]
            .prodCount[_p_Id];
        emit order(msg.sender, _o_Id);
    }

    function shipOrder(uint256 _o_Id, uint256 _p_Id) external onlySeller {
        require(SPEC.Product[_p_Id].seller == msg.sender);
        require(
            SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false
        );
        SPEC.MarketOrder[_o_Id].isShipped[_p_Id] = true;
        emit order(msg.sender, _o_Id);
    }

    function confirmDelivery(uint256 _o_Id, uint256 _p_Id) external onlyBuyer {
        require(SPEC.MarketOrder[_o_Id].BuyerAddr == msg.sender);
        require(
            SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false
        );
        SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] = true;
        sentTokensToUser(
            SPEC.Product[_p_Id].seller,
            SPEC.Product[_p_Id].itemPrice.add(SPEC.Product[_p_Id].disputePrice)
        );
        emit order(msg.sender, _o_Id);
    }

    function cancelOrder(uint256 _o_Id, uint256 _p_Id) external onlyBuyer {
        require(
            SPEC.MarketOrder[_o_Id].BuyerAddr == msg.sender,
            "Invalid User"
        );
        SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] = true;
        collectTokens(
            SPEC.Product[_p_Id].itemPrice.add(SPEC.Product[_p_Id].disputePrice)
        );
        SPEC.Product[_p_Id].availableCount += SPEC.MarketOrder[_o_Id]
            .prodCount[_p_Id];
        emit order(msg.sender, _o_Id);
    }

    function purchaseToken() external payable {
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
