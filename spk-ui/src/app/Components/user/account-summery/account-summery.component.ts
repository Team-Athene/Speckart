import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Model } from 'src/app/Models/web3.model'
import { OrderModel, CartProduct, UserBalanceModel } from 'src/app/Models/spk.model'
import { CartProductClass, OrderModelClass, UserBalanceModelClass } from 'src/app/Models/Class/cart.class'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-account-summery',
  templateUrl: './account-summery.component.html',
  styleUrls: ['./account-summery.component.scss']
})
export class AccountSummeryComponent implements OnInit {
  account: string
  spk: any
  name: string
  contact: any
  gender: string
  email: string
  address: string
  status: any
  orderData: OrderModel[] = new Array(new OrderModelClass)
  currentOrder: OrderModel = new OrderModelClass
  userBalance: UserBalanceModel = new UserBalanceModelClass()
  constructor(private api: ApiService, private web3service: Web3Service, private spec: SpkService, private route: Router) { }

  ngOnInit() {
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
    })
    this.onLoad()
  }
  onLoad = async () => {
    try {
      this.userBalance = {
        etherBal: await this.spec.getBalance(this.account),
        tokenBal: (await this.spk.balanceOf(this.account).call({ from: this.account }) / (10 ** 2))
      }
      const user = await this.spk.consumer().call({ from: this.account })
      this.name = user.userName
      this.contact = user.userContact
      if (user.userGender === 1) {
        this.gender = 'Male'
      } else if (user.userGender === 2) {
        this.gender = 'Female'
      } else {
        this.gender = 'Others'
      }
      this.email = user.userEmail
      this.address = user.userAddr
      const orders = user.orders
      for (let i = 0; i < orders.length; i++) {
        const order: OrderModel = new OrderModelClass()
        const item: CartProduct = new CartProductClass()

        const n = parseInt(orders[i], 10)
        const data = await this.spk.marketOrder(n).call({ from: this.account })
        order.orderId = n
        order.orderDetails = JSON.parse(data.orderDetails)
        order.totalPrice = data.totalPrice
        order.timeStamp = data.timeStamp
        order.status = data.status
        this.orderData.push(order)
      }

    } catch (error) {
    }
  }
  orderView = async i => {
    try {
      this.currentOrder.orderId = this.orderData[i].orderId
      this.currentOrder.totalPrice = this.orderData[i].totalPrice / 100
      this.currentOrder.orderDetails = this.orderData[i].orderDetails
      const date = new Date(parseInt(this.orderData[i].timeStamp, 10) * 1000)
      this.currentOrder.timeStamp = date.toLocaleString()
      this.status = this.orderData[i].status
      if (this.orderData[i].status === '1') {
        this.currentOrder.status = "Confirmed"
      } else if (this.orderData[i].status === '2') {
        this.currentOrder.status = "Rejected"
      } else if (this.orderData[i].status === '3') {
        this.currentOrder.status = "Cancelled"
      }
    } catch (error) {
    }
  }
  cancelOrder = async i => {
    try {
      const data = await this.spk.cancelOrder(i).send({ from: this.account })
      if (data.status) {
        alert('Order Cancelled')
        this.route.navigateByUrl('/market')
      }

    } catch (error) {
    }
  }
}

