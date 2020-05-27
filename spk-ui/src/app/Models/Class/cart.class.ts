import { CartProduct, ProductModel, ImageDataModel, TokenModel, UserBalanceModel, OrderModel, OrderStatusModel, UserOrderModel, DisputeModel } from '../spk.model'

export class CartProductClass implements CartProduct {
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
export class OrderModelClass implements OrderModel {
  orderId: any
  timeStamp: number
  orderDetails: CartProduct[] = new Array( new CartProductClass() )
  totalPrice: number
}
export class ProductModelClass implements ProductModel {
  itemId: any
  itemName: string
  itemType: string
  itemBrand: string
  itemColor: string
  itemPrice: number
  itemCount: number
  itemDetails: string
  imageId: any
  ratingCount: number
  imageData: ImageDataModel[]
}
export class TokenModelClass implements TokenModel {
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
export class UserBalanceModelClass implements UserBalanceModel {
  etherBal: any
  tokenBal: any
}

export class OrderStatusModelClass implements OrderStatusModel {
  isOrdered: boolean
  isConfirmed: boolean
  isRejected: boolean
  isDispute: boolean
  isShipped: boolean
  isCancelled: boolean
  confirmDelivery: boolean
  itemId: number
}
export class OrderListModelClass implements OrderListModelClass{
  orderId: any
  prodID: any
  timeStamp: any
  buyerDetails: UserOrderModel
  prodDetails: ProductModel
}

export class UserOrderModelClass implements UserOrderModel{
  name: string
  contact: number
  mail: string
  address: string
}

export class DisputeModelClass implements DisputeModel{
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
