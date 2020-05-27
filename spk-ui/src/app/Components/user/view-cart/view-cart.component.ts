import { CartService } from './../../../Services/cart/cart.service'
import { Cart } from 'src/app/Models/spk.model'
import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Model } from 'src/app/Models/web3.model'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.scss']
})
export class ViewCartComponent implements OnInit {

  constructor(private api: ApiService, private web3service: Web3Service, private cart: CartService, private route: Router) { }
  account: string
  spk: any
  items: Cart = { productData: [], cartTotal: 0 }
  flag: any
  done: number
  imgurl = environment.imgurl
  ngOnInit() {
    this.web3service.web3login()
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
    })
    this.done = 0
    this.onLoad()
  }

  onLoad = async () => {
    try {
      this.flag = 0
      const cartApiPre: any = await this.api.getCart( this.account )
      const cartApi: any = cartApiPre.cart
      if (cartApi === null) {
        this.items = { productData: [], cartTotal: 0 }
      } else {
        this.items = JSON.parse(cartApi)
      }
      if (this.items !== null) {
        this.flag = 1
      }
    } catch (error) {
    }
  }
  payment = async () => {
    try {
      const count = this.items.cartTotal
      const id = [],
      itemCount = [],
      itemId = []
      const details = JSON.stringify(this.items.productData)
      this.items.productData.forEach(element => {
        id.push(element.itemId)
        itemCount.push(element.itemCount)
        itemId.push({id: element.itemId, count: element.itemCount})
      })
      const order = await this.spk.createOrder(details, id, itemCount).send({ from: this.account, gas: 5000000 })

      if (order.status) {
        this.done = 1
        await this.api.addCart({cart: '0', address: this.account, itemId})
        this.onLoad()
      }
    } catch (error) { }
  }
  subCount = async (index) => {
    await this.cart.calculateCart(index, -1, this.account)
    this.onLoad()
  }
  addCount = async (index) => {
    await this.cart.calculateCart(index, 1, this.account)
    this.onLoad()
  }
  remove = async (index, count) => {
    await this.cart.calculateCart(index, -1 * (count), this.account)
    this.onLoad()
  }
  continue = async () => {
    this.route.navigateByUrl('/market/shop')
  }
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }
}
