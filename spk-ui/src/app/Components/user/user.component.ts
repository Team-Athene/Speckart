import { ProductModelClass } from './../../Models/Class/cart.class'
import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Web3Model } from 'src/app/Models/web3.model'
import {
  ProductModel,
  ImageDataModel,
  Cart,
  CartProduct,
} from 'src/app/Models/spk.model'
import { ApiService } from 'src/app/Services/api/api.service'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'

@Component( {
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.scss' ],
} )
export class UserComponent implements OnInit {
  account: string
  spk: any
  imgurl = environment.imgurl
  recentProducts: ProductModel[] = []
  popularProducts: ProductModel[] = []
  productDetail: ProductModel = new ProductModelClass()
  cart: Cart = { productData: [], cartTotal: 0 }
  type = {
    1: 'Casual',
    2: 'Formal',
    3: 'Sunglass',
  }
  color = {
    1: 'Red',
    2: 'Blue',
    3: 'Black',
    4: 'White',
    5: 'Green',
  }

  constructor(
    private api: ApiService,
    private web3service: Web3Service,
    private route: Router
  ) { }
  ngOnInit() {
    this.web3service.web3login()
    this.web3service.Web3Details$.subscribe( async ( data: Web3Model ) => {
      this.account = data.account
      this.spk = data.spk
    } )
    this.onLoad()
  }
  onLoad = async () => {
    try {
      const user = await this.spk.userDetails().call( { from: this.account } )
      sessionStorage.setItem( 'name', await this.web3service.fromBytes( user.userName ) )
      this.recentProducts = []
      this.popularProducts = []
      const apiResult: any = await this.api.getRecentView( this.account ),
        getRecentView: any = apiResult.recent,
        popular: any = apiResult.trend

      const cartApiPre: any = await this.api.getCart( this.account )
      const cartApi: any = cartApiPre.cart
      if ( cartApi === null ) {
        this.cart = { productData: [], cartTotal: 0 }
      } else {
        this.cart = JSON.parse( cartApi )
      }
      for ( let i = 0; i < getRecentView.length; i++ ) {
        const temp1 = await this.spk.product1( getRecentView[ i ] ).call( { from: this.account } )
        const temp = await this.spk.product2( getRecentView[ i ] ).call( { from: this.account } )
        const temProduct: ProductModel = new ProductModelClass()
        temProduct.itemName = await this.web3service.fromBytes( temp1.itemName )
        temProduct.itemPrice = ( temp1.itemPrice / 100)
        temProduct.imageId = await this.web3service.fromBytes( temp1.imageId )
        temProduct.itemCount = temp1.availableCount
        temProduct.itemColor = temp.itemColor
        temProduct.itemType = temp.itemType
        temProduct.itemDetails = await this.web3service.fromBytes( temp.itemDetails )
        temProduct.itemBrand = await this.web3service.fromBytes( temp.itemBrand )
        temProduct.itemId = getRecentView[ i ]
        const imgs: any = await this.api.viewProducts( temProduct.imageId )
        const a = temProduct.itemColor,
          b = temProduct.itemType
        temProduct.itemColor = this.color[ a ]
        temProduct.itemType = this.type[ b ]
        temProduct.imageData = new Array()
        imgs.forEach( ( img: ImageDataModel, i: any ) => {
          temProduct.imageData[ i ] = img
        } )
        this.recentProducts.push( temProduct )
      }
      for ( let i = 0; i < popular.length; i++ ) {
        const pop1 = await this.spk.product1( popular[ i ] ).call( { from: this.account } )
        const pop = await this.spk.product2( popular[ i ] ).call( { from: this.account } )
        const popProduct: ProductModel = new ProductModelClass()
        popProduct.itemName = await this.web3service.fromBytes( pop1.itemName )
        popProduct.itemPrice = ( pop1.itemPrice / 100)
        popProduct.imageId = await this.web3service.fromBytes( pop1.imageId )
        popProduct.itemCount = pop1.availableCount
        popProduct.itemColor = pop.itemColor
        popProduct.itemType = pop.itemType
        popProduct.itemDetails = await this.web3service.fromBytes( pop.itemDetails )
        popProduct.itemBrand = await this.web3service.fromBytes( pop.itemBrand )
        popProduct.itemId = getRecentView[ i ]
        const imgs: any = await this.api.viewProducts( popProduct.imageId )
        const a = popProduct.itemColor,
          b = popProduct.itemType
        popProduct.itemColor = this.color[ a ]
        popProduct.itemType = this.type[ b ]
        popProduct.imageData = new Array()
        imgs.forEach( ( img: ImageDataModel, i: any ) => {
          popProduct.imageData[ i ] = img
        } )
        this.popularProducts.push( popProduct )
      }
    } catch ( error ) { }
  }

  detailView = async ( product: ProductModel ) => {
    this.productDetail = product
    await this.api.recentView( {
      itemId: product.itemId,
      address: this.account,
    } )
    this.onLoad()
  }
  addToCart = async ( product: ProductModel ) => {
    const itemCart: CartProduct = {
      itemId: null,
      itemName: null,
      itemCount: null,
      itemPrice: null,
      itemTotal: null,
      itemColor: null,
      itemBrand: null,
      imageId: null,
      imageData: [],
    }
    itemCart.itemId = product.itemId
    itemCart.itemName = product.itemName
    itemCart.itemCount++
    itemCart.itemPrice = product.itemPrice
    itemCart.itemTotal = itemCart.itemPrice * itemCart.itemCount
    itemCart.itemColor = product.itemColor
    itemCart.itemBrand = product.itemBrand
    itemCart.imageId = product.imageId
    itemCart.imageData = product.imageData

    const len = this.cart.productData.length

    let flag = 0
    for ( let i = 0; i < len; i++ ) {
      if ( this.cart.productData[ i ].itemId === product.itemId ) {
        flag = 1
        this.cart.productData[ i ].itemCount++
        this.cart.productData[ i ].itemTotal =
          product.itemPrice * this.cart.productData[ i ].itemCount
      }
    }
    if ( flag !== 1 ) {
      this.cart.productData.push( itemCart )
    }
    this.cart.cartTotal = this.cart.cartTotal + parseInt( product.itemPrice, 10 )
    await this.api.addCart( {
      cart: JSON.stringify( this.cart ),
      address: this.account,
    } )
    alert( 'Your item is added to the cart' )
    // sessionStorage.setItem('cart', JSON.stringify(this.cart))
  }
  clearProduct = async () => {
    this.productDetail = new ProductModelClass()
  }
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl( '/' )
  }
}
