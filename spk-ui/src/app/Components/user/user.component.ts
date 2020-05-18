import { ProductModelClass } from './../../Models/Class/cart.class'
import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Web3Model } from 'src/app/Models/web3.model'
import { ProductModel, ImageDataModel, Cart, CartProduct } from 'src/app/Models/spk.model'
import { ApiService } from 'src/app/Services/api/api.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  account: string
  spk: any
  imgurl = 'http://0.0.0.0:3000/'
  recentProducts: ProductModel[] = []
  productDetail: ProductModel = new ProductModelClass()
  cart: Cart = { productData: [], cartTotal: 0 }

  constructor(private api: ApiService, private web3service: Web3Service, private route: Router) {}
  ngOnInit() {
    this.web3service.web3login()
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
    })
    this.onLoad()
  }
  onLoad = async () => {
    try {
      this.recentProducts = []
      const getRecentView: any = await this.api.getRecentView(this.account)
      const cartApi: any = await this.api.getCart( this.account )
      if(cartApi === null){
        this.cart = { productData: [], cartTotal: 0 }
      } else {
        this.cart = JSON.parse(cartApi)
      }
      for (let i = 0; i < getRecentView.length; i++) {
        const temProduct: ProductModel = await this.spk.product(parseInt(getRecentView[i])).call({ from: this.account })
        temProduct.itemId = getRecentView[i]
        const imgs: any = await this.api.viewProducts(temProduct.imageId)
        temProduct.imageData = new Array()
        imgs.forEach((img: ImageDataModel, i: any) => {
          temProduct.imageData[i] = img
        })
        this.recentProducts.push(temProduct)
      }
    } catch (error) {
    }
  }
  detailView = async (product: ProductModel) => {
    this.productDetail = product
    await this.api.recentView({itemId: product.itemId, address: this.account})
    this.onLoad()
  }
  addToCart = async (product: ProductModel) => {
    const itemCart: CartProduct = {
      itemId: null,
      itemName: null,
      itemCount: null,
      itemPrice: null,
      itemTotal: null,
      itemColor: null,
      itemBrand: null,
      imageId: null,
      imageData: []
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
    for (let i = 0; i < len; i++) {
      if (this.cart.productData[i].itemId === product.itemId) {
        flag = 1
        this.cart.productData[i].itemCount++
        this.cart.productData[i].itemTotal = product.itemPrice * this.cart.productData[i].itemCount
      }
    }
    if (flag !== 1) {
      this.cart.productData.push(itemCart)
    }
    this.cart.cartTotal = this.cart.cartTotal + parseInt(product.itemPrice, 10)
    await this.api.addCart({cart: JSON.stringify(this.cart), address: this.account})
    alert('Your item is added to the cart')
    // sessionStorage.setItem('cart', JSON.stringify(this.cart))
  }
  clearProduct = async () => {
    this.productDetail = new ProductModelClass()
  }
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }

}
