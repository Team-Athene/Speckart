import { Component, OnInit } from '@angular/core'
import { OrderModel } from 'src/app/Models/spk.model'
import { OrderModelClass } from 'src/app/Models/Class/cart.class'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Web3Model } from 'src/app/Models/web3.model'

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  account: string
  spk: any
  date: any
  currentOrder: OrderModel = new OrderModelClass()
  orders: OrderModel[]
  status = '1'
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
      if (dta.status === this.status) {
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
  ShowConfirmed = () => {
    this.status = '1'
    this.onLoad()
  }
  ShowRejected = () => {
    this.status = '2'
    this.onLoad()
  }
}
