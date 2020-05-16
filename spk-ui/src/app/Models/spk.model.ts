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
}
export interface ProductModel {
  itemId: any
  itemName: string
  itemType: string
  itemPrice: any
  itemDetails: string
  imageId: any,
  ratingCount: number
  imageData: ImageDataModel[]
}
export interface CartProduct {
  itemId: number
  itemName: string
  itemCount: number
  itemPrice: any
  itemTotal: any
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
  totalPrice: number,
  status: any
}


