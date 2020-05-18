import { Component, OnInit } from '@angular/core'
import { ProductModel, Cart, ImageDataModel, CartProduct } from 'src/app/Models/spk.model'
import { ProductModelClass } from 'src/app/Models/Class/cart.class'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Router } from '@angular/router'
import { Web3Model } from 'src/app/Models/web3.model'

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  account: string
  spk: any
  imgurl = 'http://0.0.0.0:3000/'
  products: ProductModel[] = []
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

      const cartApi: any = await this.api.getCart( this.account )
      if(cartApi === null){
        this.cart = { productData: [], cartTotal: 0 }
      } else {
        this.cart = JSON.parse(cartApi)
      }
      const totalProducts = await this.spk.totalProductID().call({ from: this.account })
      for (let i = 100; i < totalProducts; i++) {
        const temProduct: ProductModel = await this.spk.product(i).call({ from: this.account })
        temProduct.itemId = i
        const imgs: any = await this.api.viewProducts(temProduct.imageId)
        temProduct.imageData = new Array()
        imgs.forEach((img: ImageDataModel, i: any) => {
          temProduct.imageData[i] = img
        })
        this.products.push(temProduct)
      }
      console.log("TCL: ShopComponent -> onLoad -> this.products", this.products)
    } catch (error) {
    }
  }
  detailView = async (product: ProductModel) => {
    this.productDetail = product
    await this.api.recentView({itemId: product.itemId, address: this.account})
  }
  addToCart = async (product: ProductModel) => {
    const itemCart: CartProduct = {
      itemId: null,
      itemName: null,
      itemCount: null,
      itemPrice: null,
      itemTotal: null,
      itemBrand: null,
      itemColor: null,
      imageId: null,
      imageData: []
    }
    itemCart.itemId = product.itemId
    itemCart.itemName = product.itemName
    itemCart.itemCount++
    itemCart.itemPrice = product.itemPrice
    itemCart.itemTotal = itemCart.itemPrice * itemCart.itemCount
    itemCart.itemBrand = product.itemBrand
    itemCart.itemColor = product.itemColor
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
  }
  clearProduct = async () => {
    this.productDetail = new ProductModelClass()
  }
  search = async ( key, value ) => {
    const prod = await this.api.search(key,value)
    console.log("TCL: ShopComponent -> search -> prod", prod)
  }
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }

}
