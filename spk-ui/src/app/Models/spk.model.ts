export interface TokenModel {
  tokenName: string
  tokenSymbol: string
  tokenDecimals: any
  tokenTotalSupply: any
  specTokenPrice: any
  tokenOwner: string
  specTokenAddress: string
  etherBal: any
  tokenBalance: any
}
export interface UserModel {
  name: string
  contact: number
  gender: string
  mail: string
  address: string
  type: number
}
export interface UserOrderModel {
  name: string
  contact: number
  mail: string
  address: string
}
export interface ProductModel {
  itemId: any
  itemName: any
  itemType: any
  itemPrice: any
  itemCount: number
  itemDetails: any
  itemColor: any
  itemBrand: any
  imageId: any
  ratingCount: number
  imageData: ImageDataModel[]
}
export interface OrderListModel {
  orderId: any
  prodID: any
  timeStamp: any
  buyerDetails: UserOrderModel
  prodDetails: ProductModel
}
export interface CartProduct {
  itemId: number
  itemName: string
  itemCount: number
  itemPrice: any
  itemTotal: any
  itemBrand: any
  itemColor: any
  imageId: any
  imageData: ImageDataModel[]
}
export interface Cart {
  productData: CartProduct[]
  cartTotal: number
}
export interface ImageDataModel {
  originalname: any
  filename: any
  path: any
}
export interface UserBalanceModel {
  etherBal: any
  tokenBal: any
}
export interface OrderModel {
  orderId: any
  timeStamp: any
  orderDetails: CartProduct[]
  totalPrice: number
}
export interface OrderStatusModel {
  isOrdered: boolean
  isConfirmed: boolean
  isRejected: boolean
  isDispute: boolean
  isShipped: boolean
  isCancelled: boolean
  confirmDelivery: boolean
  itemId: number
}

export interface DisputeModel {
  disputeId: number
  orderId: number
  productId: number
  creatorType: any
  comment: any
  bVote: number
  sVote: number
  isDisputeCleared: boolean
  Order: {
    Buyer: string
    timeStamp: number
  }
  Product: ProductModel
  Status: OrderStatusModel
}
