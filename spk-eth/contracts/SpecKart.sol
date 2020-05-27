// SPDX-License-Identifier: SPECKART
pragma solidity ^0.6.8;
import "./SafeMath.sol";
import "./IDispute.sol";
import "./ISpecToken.sol";
import "./SpecLibrary.sol";


contract SpecRead {
    using SpecLibrary for SpecLibrary.SpecModel;
    SpecLibrary.SpecModel SPEC;

    modifier onlySeller() {
        require(uint256(SPEC.Users[msg.sender].userType) == 2, "only seller");
        _;
    }
    modifier onlyBuyer() {
        require(uint256(SPEC.Users[msg.sender].userType) == 1, "only buyer");
        _;
    }

    function totalProductID() external view returns (uint256) {
        return SPEC.P_ID;
    }

    function currentOrderID() external view returns (uint256) {
        return SPEC.O_ID;
    }

    function Orders(address _seller)
        external
        view
        returns (uint32[] memory orderId)
    {
        return (SPEC.orderList[_seller]);
    }

    function productsList(address _seller, uint32 _o_id)
        external
        view
        returns (uint32[] memory prodId)
    {
        return (SPEC.prodList[_seller][_o_id]);
    }

    function product1(uint32 _id)
        public
        view
        returns (
            bytes32 itemName,
            uint256 itemPrice,
            bytes32 imageId,
            uint32 availableCount
        )
    {
        return (
            SPEC.Product[_id].itemName,
            SPEC.Product[_id].itemPrice,
            SPEC.Product[_id].imageId,
            SPEC.Product[_id].availableCount
        );
    }

    function product2(uint32 _id)
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

    function productCount(uint32 _o_id, uint32 _p_id)
        external
        view
        returns (uint32 count)
    {
        return (SPEC.prodTotal[_o_id][_p_id]);
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
            uint64 userContact,
            uint8 userGender,
            bytes32 userEmail,
            string memory userAddr,
            uint32[] memory orders,
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

    function marketOrder(uint32 _id)
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

    function productOrder(uint32 _o_id, uint32 _p_id)
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

    event SignUp(address indexed user, bytes32 name);
    event addItem(bytes32 user, bytes32 name, uint256 product_id);
    event order(address indexed user, uint256 id);
}


contract SpecKart is SpecRead {
    using SafeMath for uint256;
    address TOKEN;
    address DISP;

    constructor(address _token, address _dispute) public {
        SPEC.P_ID = 100;
        SPEC.O_ID = 10000;
        SPEC.MIN_TIME = 3 minutes;
        TOKEN = _token;
        DISP = _dispute;
    }

    function checkUser() public view returns (uint256 status) {
        if (uint256(SPEC.Users[msg.sender].userType) == 2) {
            return 2;
        } else if (uint256(SPEC.Users[msg.sender].userType) == 1) {
            return 1;
        } else if (IDispute(DISP).checkAdmin(msg.sender) == true) {
            return 3;
        }
        return 0;
    }

    modifier newUser() {
        require(checkUser() == 0, "Not A New User");
        _;
    }

    function userSignUp(
        bytes32 _userName,
        uint64 _userContact,
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
        uint32 _availableCount,
        bytes32 _itemDetails,
        bytes32 _itemBrand,
        uint8 _itemColor,
        bytes32 _imageId
    ) external onlySeller {
        require(
            ISpecToken(TOKEN).balance(msg.sender) >= _itemPrice,
            "Insufficient Dispuaddress(te value"
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
        SPEC.Product[SPEC.P_ID].disputePrice = SPEC.Product[SPEC.P_ID].itemPrice.div(100);
        ISpecToken(TOKEN).sendTokens(
            SPEC.Product[SPEC.P_ID].disputePrice.mul(_availableCount),
            msg.sender
        );
        SPEC.P_ID++;
        emit addItem(_itemName, _itemBrand, SPEC.P_ID);
    }

    function createOrder(
        string calldata _orderDetails,
        uint32[] calldata _prodIds,
        uint32[] calldata _prodCounts
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
                ISpecToken(TOKEN).balance(msg.sender) >=
                    SPEC.Product[_prodIds[i]].disputePrice.add(
                        SPEC.Product[_prodIds[i]].itemPrice
                    ),
                "Insufficient Ethereum"
            );
        }
        uint256 total = 0;
        for (uint32 i = 0; i < _prodIds.length; i++) {
            SPEC.orderList[SPEC.Product[_prodIds[i]].seller].push(SPEC.O_ID);
            SPEC.prodList[SPEC.Product[_prodIds[i]].seller][SPEC.O_ID].push(
                _prodIds[i]
            );
            SPEC.prodTotal[SPEC.O_ID][_prodIds[i]] = _prodCounts[i];
            total += (SPEC.Product[_prodIds[i]].itemPrice.add(SPEC.Product[_prodIds[i]].disputePrice)).mul(_prodCounts[i]);
            SPEC.Product[_prodIds[i]].availableCount -= _prodCounts[i];
            SPEC.MarketOrder[SPEC.O_ID].isOrdered[_prodIds[i]] = true;
        }

        SPEC.MarketOrder[SPEC.O_ID].BuyerAddr = msg.sender;
        SPEC.MarketOrder[SPEC.O_ID].timeStamp = now;
        SPEC.MarketOrder[SPEC.O_ID].orderDetails = _orderDetails;
        SPEC.MarketOrder[SPEC.O_ID].totalPrice = total;
        SPEC.Users[msg.sender].orders.push(SPEC.O_ID);
        SPEC.O_ID++;
        ISpecToken(TOKEN).sendTokens(total, msg.sender);
        emit order(msg.sender, SPEC.O_ID);
    }

    function confirmOrder(uint32 _o_Id, uint32 _p_Id) external onlySeller {
        require(SPEC.Product[_p_Id].seller == msg.sender, "Only Seller");
        require(
            SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false,
            "Conditions not satisfied"
        );
        SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] = true;
        emit order(msg.sender, _o_Id);
    }

    function rejectOrder(uint32 _o_Id, uint32 _p_Id) external onlySeller {
        require(SPEC.Product[_p_Id].seller == msg.sender, "Only Seller");
        require(
                SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false
        );
        cancel(_o_Id,_p_Id);
        emit order(msg.sender, _o_Id);
    }

    function shipOrder(uint32 _o_Id, uint32 _p_Id) external onlySeller {
        require(SPEC.Product[_p_Id].seller == msg.sender, "Only Seller");
        require(
            SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false,
            "Conditions not satisfied"
        );
        SPEC.MarketOrder[_o_Id].isShipped[_p_Id] = true;
        emit order(msg.sender, _o_Id);
    }

    function confirmDelivery(uint32 _o_Id, uint32 _p_Id) external onlyBuyer {
        require(SPEC.MarketOrder[_o_Id].BuyerAddr == msg.sender, "Only Buyer");
        require(
            SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false,
            "Conditions not satisfied"
        );
        SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] = true;
        ISpecToken(TOKEN).collectTokens(
            SPEC.Product[_p_Id].itemPrice.add(SPEC.Product[_p_Id].disputePrice),
            SPEC.Product[_p_Id].seller
        );
        ISpecToken(TOKEN).collectTokens(
            SPEC.Product[_p_Id].disputePrice,
            SPEC.MarketOrder[_o_Id].BuyerAddr
        );
        emit order(msg.sender, _o_Id);
    }

    function cancelOrder(uint32 _o_Id, uint32 _p_Id) external onlyBuyer {
        require(
                SPEC.MarketOrder[_o_Id].isOrdered[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].BuyerAddr == msg.sender &&
                SPEC.MarketOrder[_o_Id].isConfirmed[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isRejected[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] == false
        );
        cancel(_o_Id,_p_Id);
        emit order(msg.sender, _o_Id);
    }
    
    function cancel(uint32 _o_Id, uint32 _p_Id) private {
        SPEC.MarketOrder[_o_Id].isCancelled[_p_Id] = true;
        ISpecToken(TOKEN).collectTokens(
            SPEC.Product[_p_Id].itemPrice.add(SPEC.Product[_p_Id].disputePrice),
            msg.sender
        );
        SPEC.Product[_p_Id].availableCount += SPEC.prodTotal[_o_Id][_p_Id];
    }


    function DisputeCreation(
        uint32 _o_Id,
        uint32 _p_Id,
        bytes32 _comment
    ) external {
        require(
            now > (SPEC.MIN_TIME + SPEC.MarketOrder[_o_Id].timeStamp),
            "inbetween 30 to 60 days only"
        );
        // require(uint256(user[msg.sender].userType) == 2, "Invalid User");
        require(
            SPEC.Product[_p_Id].seller == msg.sender ||
                SPEC.MarketOrder[_o_Id].BuyerAddr == msg.sender,
            "Must be a Buyer or Seller"
        );
        require(
            SPEC.MarketOrder[_o_Id].isDispute[_p_Id] == false &&
                SPEC.MarketOrder[_o_Id].isShipped[_p_Id] == true &&
                SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] == false,
            "Product is either not Shipped or already Confirmed"
        );
        IDispute(DISP).Create(
            _o_Id,
            _p_Id,
            uint8(SPEC.Users[msg.sender].userType),
            _comment,
            msg.sender
        );
        SPEC.MarketOrder[_o_Id].isDispute[_p_Id] = true;
    }

    function DisputeVoting(uint32 _D_ID, uint32 _vote) external {
        uint8 winner;
        uint32 _p_Id = IDispute(DISP).getPID(_D_ID);
        uint32 _o_Id = IDispute(DISP).getOID(_D_ID);

        winner = IDispute(DISP).Vote(
            msg.sender,
            _D_ID,
            _vote,
            (uint256(SPEC.prodTotal[_o_Id][_p_Id])).mul(SPEC.Product[_p_Id].itemPrice),
            SPEC.Product[_p_Id].seller,
            SPEC.MarketOrder[_o_Id].BuyerAddr
        );

        if (winner == 2) {
            SPEC.MarketOrder[_o_Id].confirmDelivery[_p_Id] = true;
        }
    }

    function purchaseToken() external payable {
        uint256 count = (msg.value).div(ISpecToken(TOKEN).specPrice());
        uint256 balance = (msg.value).sub(
            count.mul(ISpecToken(TOKEN).specPrice())
        );
        msg.sender.transfer(balance);
        ISpecToken(TOKEN).buyToken(count, msg.sender);
    }

    function sellToken(uint256 _count) external {
        uint256 amount = _count.mul(ISpecToken(TOKEN).specPrice());
        msg.sender.transfer(amount);
        ISpecToken(TOKEN).burn(_count, msg.sender);
    }
}
