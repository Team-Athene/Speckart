import { CartProduct, ProductModel, ImageDataModel, TokenModel, UserBalanceModel, OrderModel } from '../spk.model'

export class CartProductClass implements CartProduct {
  itemId: number
  itemName: string
  itemCount: number
  itemPrice: any
  itemTotal: any
}
export class OrderModelClass implements OrderModel {
  orderId: any
  timeStamp: number
  orderDetails: CartProduct[] = new Array( new CartProductClass() )
  totalPrice: number
  status: 0
}
export class ProductModelClass implements ProductModel {
  itemId: any
  itemName: string
  itemType: string
  itemPrice: number
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

