import { CartService } from './../../../Services/cart/cart.service'
import { Cart } from 'src/app/Models/spk.model'
import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Model } from 'src/app/Models/web3.model'

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.scss']
})
export class ViewCartComponent implements OnInit {

  constructor(private api: ApiService, private web3service: Web3Service, private cart: CartService) { }
  account: string
  spk: any
  items: Cart
  flag: any
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
      this.flag = 0;
      this.items = JSON.parse(sessionStorage.getItem('cart'))
      if (this.items !== null) {
        this.flag = 1
      }
    } catch (error) {
    }
  }
  payment = async () => {
    try {
      const count = this.items.cartTotal
      const details = JSON.stringify(this.items.productData)
      const order = await this.spk.createOrder(details, count * 100).send({ from: this.account })
      if (order.status) {
        sessionStorage.removeItem('cart')
        this.onLoad()
      }
    } catch (error) { }
  }
  subCount = async (index) => {
    await this.cart.calculateCart(index, -1)
    this.onLoad()
  }
  addCount = async (index) => {
    await this.cart.calculateCart(index, 1)
    this.onLoad()
  }
}