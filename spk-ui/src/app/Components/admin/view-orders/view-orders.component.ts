import { async } from '@angular/core/testing'

import { OrderModel, CartProduct } from 'src/app/Models/spk.model'
import { Component, OnInit } from '@angular/core'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Web3Model } from 'src/app/Models/web3.model'
import { OrderModelClass, CartProductClass } from 'src/app/Models/Class/cart.class'


@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {
  account: string
  spk: any
  date: any
  currentOrder: OrderModel = new OrderModelClass()
  orders: OrderModel[]
  constructor(private api: ApiService, private web3service: Web3Service, private spec: SpkService, ) { }
  ngOnInit() {
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
    })
    this.onLoad()
  }
  onLoad = async () => {
    this.orders = new Array(new OrderModelClass())
    delete this.orders[0]
    const totalOrders = await this.spk.currentOrderID().call({ from: this.account })
    for (let index = 1000; index < totalOrders; index++) {
      const dta = await this.spk.marketOrder(index).call({ from: this.account })
      if (dta.status === '0') {
        dta.orderDetails = JSON.parse(dta.orderDetails)
        dta.orderId = index
        this.orders.push(dta)
      }
    }
  }
  orderView = async (i) => {
    this.currentOrder = this.orders[i]
    const date = new Date(parseInt(this.currentOrder.timeStamp, 10) * 1000)
    this.date = date.toLocaleString()
  }
  clearProduct = () => { }
  accept = async (orderId) => {
    const res = await this.spk.confirmOrder(orderId).send({ from: this.account, gas: 5000000 })
    if (res.status) {
      alert('Order Accepted')
      this.onLoad()
    }
  }
  reject = async (orderId) => {
    const res = await this.spk.rejectOrder(orderId).send({ from: this.account, gas: 5000000 })
    if (res.status) {
      alert('Order Rejected')
      this.onLoad()
    }
  }
}
