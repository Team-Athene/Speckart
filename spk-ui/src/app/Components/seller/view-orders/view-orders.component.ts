import { async } from '@angular/core/testing'

import {
  OrderModel,
  CartProduct,
  OrderListModel,
  ProductModel,
  ImageDataModel,
  UserOrderModel,
} from 'src/app/Models/spk.model'
import { Component, OnInit } from '@angular/core'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Web3Model } from 'src/app/Models/web3.model'
import {
  OrderModelClass,
  CartProductClass,
  OrderListModelClass,
  ProductModelClass,
  UserOrderModelClass,
} from 'src/app/Models/Class/cart.class'
import { Router } from '@angular/router'
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss'],
})
export class ViewOrdersComponent implements OnInit {
  account: string
  spk: any
  imgurl = 'http://0.0.0.0:3000/'
  currentOrder: OrderModel = new OrderModelClass()
  orders: OrderModel[]
  choice: number
  currentOrderId: number

  productModel: ProductModel = new ProductModelClass()
  buyerModel: UserOrderModel = new UserOrderModelClass()
  orderList: OrderListModel[] = new Array ( new OrderListModelClass())
  ordered: OrderListModel[] = new Array ( new OrderListModelClass())
  cancelled: OrderListModel[] = new Array ( new OrderListModelClass())
  disputed: OrderListModel[] = new Array ( new OrderListModelClass())
  rejected: OrderListModel[] = new Array ( new OrderListModelClass())
  delivered: OrderListModel[] = new Array ( new OrderListModelClass())
  shipped: OrderListModel[] = new Array ( new OrderListModelClass())
  confirmed: OrderListModel[] = new Array ( new OrderListModelClass())
  status: number
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
    private spec: SpkService,
    private route: Router
  ) {}
  ngOnInit() {
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
    })
    this.onLoad()
  }
  onLoad = async () => {
    this.status = 0
    this.orders = new Array(new OrderModelClass())
    delete this.orders[0]

    const array = await this.spk
      .Orders(this.account)
      .call({ from: this.account })
    console.log('TCL: OrderDetailsComponent -> onLoad -> array', array)
    const orderList = [...new Set(array)]
    console.log('TCL: OrderDetailsComponent -> onLoad -> orderList', orderList)
    orderList.forEach(async (element) => {
      const productsList = await this.spk
        .productsList(this.account, element)
        .call({ from: this.account })
      console.log(
        'TCL: OrderDetailsComponent -> onLoad -> productsList',
        productsList
      )
      const marketOrder = await this.spk
        .marketOrder(element)
        .call({ from: this.account })
      console.log(
        'TCL: OrderDetailsComponent -> onLoad -> marketOrder',
        marketOrder
      )
      productsList.forEach(async (prod) => {
        const productOrder = await this.spk
          .productOrder(element, prod)
          .call({ from: this.account })
        console.log(
          'TCL: OrderDetailsComponent -> onLoad -> productOrder',
          productOrder
        )
        if (productOrder.isCancelled === true) {
          let cancel: OrderListModel = new OrderListModelClass()
          cancel = await this.productReturn(marketOrder, prod, element)
          this.cancelled.push(cancel)
        } else if (productOrder.isDispute === true) {
          let dispute: OrderListModel = new OrderListModelClass()
          dispute = await this.productReturn(marketOrder, prod, element)
          this.disputed.push(dispute)
        } else if (productOrder.isRejected === true) {
          let reject: OrderListModel = new OrderListModelClass()
          reject = await this.productReturn(marketOrder, prod, element)
          this.rejected.push(reject)
        } else if (productOrder.confirmDelivery === true) {
          let deliver: OrderListModel = new OrderListModelClass()
          deliver = await this.productReturn(marketOrder, prod, element)
          this.delivered.push(deliver)
        } else if (productOrder.isShipped === true) {
          let ship: OrderListModel = new OrderListModelClass()
          ship = await this.productReturn(marketOrder, prod, element)
          this.shipped.push(ship)
        } else if (productOrder.isConfirmed === true) {
          let confirm: OrderListModel = new OrderListModelClass()
          confirm = await this.productReturn(marketOrder, prod, element)
          this.confirmed.push(confirm)
        } else {
          let ordered: OrderListModel = new OrderListModelClass()
          ordered = await this.productReturn(marketOrder, prod, element)
          this.ordered.push(ordered)
        }
      })
      this.orderList = this.ordered
    })
  }
  productReturn = async (marketOrder, prod, o_ID) => {
    let order: OrderListModel = new OrderListModelClass()

    const date = new Date(parseInt(marketOrder.timeStamp, 10) * 1000)
    order.orderId = o_ID
    order.prodID = prod
    order.timeStamp = date.toLocaleString()
    const user = await this.spk
      .userOrderDetails(marketOrder.BuyerAddr)
      .call({ from: this.account })
    order.buyerDetails = {
      name: await this.web3service.fromBytes( user.userName ),
      contact: user.userContact,
      mail: await this.web3service.fromBytes( user.userEmail ),
      address: user.userAddr
    }

    let temProduct: ProductModel = await this.spk
      .product1(prod)
      .call({ from: this.account })
    const temp = await this.spk.product2(prod).call({ from: this.account })
    temProduct.itemColor = temp.itemColor
    temProduct.itemType = temp.itemType
    temProduct.itemDetails = await this.web3service.fromBytes( temp.itemDetails )
    temProduct.itemBrand = await this.web3service.fromBytes( temp.itemBrand )
    temProduct.itemId = prod
    temProduct.itemName = await this.web3service.fromBytes( temProduct.itemName )
    temProduct.imageId = await this.web3service.fromBytes( temProduct.imageId)
    console.log("TCL: ViewOrdersComponent -> productReturn -> temProduct", temProduct)
    const imgs: any = await this.api.viewProducts( temProduct.imageId )
    const a = temProduct.itemColor,
      b = temProduct.itemType
    temProduct.itemColor = this.color[a]
    temProduct.itemType = this.type[b]
    temProduct.imageData = new Array()
    imgs.forEach((img: ImageDataModel, i: any) => {
      temProduct.imageData[i] = img
    })
    order.prodDetails = temProduct
    return order
  }
  select = async (choice) => {
    this.status = choice
    console.log("TCL: ViewOrdersComponent -> select -> this.status", this.status)
    switch (choice) {
      case 0:
        this.orderList = this.ordered
        console.log("TCL: ViewOrdersComponent -> select -> this.orderList", this.orderList)
        break
      case 1:
        this.orderList = this.confirmed
        break
      case 2:
        this.orderList = this.rejected
        break
      case 3:
        this.orderList = this.shipped
        break
      case 4:
        this.orderList = this.delivered
        break
      case 5:
        this.orderList = this.disputed
        break
      case 6:
        this.orderList = this.cancelled
        break

      default:
        this.orderList = this.ordered
        break
    }
  }
  prodView = async (choice: number, order: number, product: ProductModel) => {
    console.log('TCL: ViewOrdersComponent -> prodView -> choice', choice)
    this.currentOrderId = order
    this.productModel = product
    console.log(
      'TCL: ViewOrdersComponent -> prodView -> this.productModel',
      this.productModel
    )
  }
  buyerView = async (choice: number, buyer: UserOrderModel) => {
    console.log('TCL: ViewOrdersComponent -> buyerView -> choice', choice)
    this.buyerModel = new UserOrderModelClass()
    this.buyerModel = buyer
    console.log(
      'TCL: ViewOrdersComponent -> buyerView -> this.buyerModel ',
      this.buyerModel
    )
  }
  accept = async (prodId: number ) => {
    const res = await this.spk
      .confirmOrder(this.currentOrderId, prodId)
      .send({ from: this.account, gas: 5000000 })
    if (res.status) {
      alert('Order Accepted')
      this.onLoad()
    }
  }
  reject = async (prodId: number ) => {
    const res = await this.spk
      .rejectOrder(this.currentOrderId, prodId)
      .send({ from: this.account, gas: 5000000 })
      console.log("TCL: ViewOrdersComponent -> reject -> res", res)
    if (res.status) {
      alert('Order Rejected')
      this.onLoad()
    }
  }
  ship = async (prodId: number ) => {
    const res = await this.spk
      .shipOrder(this.currentOrderId, prodId)
      .send({ from: this.account, gas: 5000000 })
    if (res.status) {
      alert('Order Shipped')
      this.onLoad()
    }
  }
  dispute = async ( form: NgForm, prodId: number ) => {
    const comment: string = await this.web3service.toBytes( form.value )
    const res = await this.spk
      .DisputeCreation(this.currentOrderId, prodId, comment)
      .send({ from: this.account, gas: 5000000 })
    if (res.status) {
      alert('Dispute Initiated')
      this.onLoad()
    }
  }
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }
}
