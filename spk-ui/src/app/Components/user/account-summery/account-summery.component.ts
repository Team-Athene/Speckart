import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Model } from 'src/app/Models/web3.model'
import {
  OrderModel,
  CartProduct,
  UserBalanceModel,
  ProductModel,
  OrderStatusModel,
  Cart,
  ImageDataModel,
} from 'src/app/Models/spk.model'
import {
  CartProductClass,
  OrderModelClass,
  UserBalanceModelClass,
  OrderStatusModelClass,
  ProductModelClass,
} from 'src/app/Models/Class/cart.class'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-account-summery',
  templateUrl: './account-summery.component.html',
  styleUrls: ['./account-summery.component.scss'],
})
export class AccountSummeryComponent implements OnInit {
  account: string
  spk: any
  status: any
  view: number
  imgurl = "http://0.0.0.0:3000/";
  productList: ProductModel = new ProductModelClass()
  orderData: OrderModel[] = new Array(new OrderModelClass())
  orderStatus: OrderStatusModel = new OrderStatusModelClass()
  currentOrder: OrderModel = new OrderModelClass()
  userBalance: UserBalanceModel = new UserBalanceModelClass()
  confirm = {
    true: 'Yes',
    false: 'No',
  }
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
    try {
      this.orderData = []
      this.view = 0
      this.userBalance = {
        etherBal: await this.spec.getBalance(this.account),
        tokenBal:
          (await this.spk
            .balanceOf(this.account)
            .call({ from: this.account })) /
          10 ** 2,
      }
      const user = await this.spk.userDetails().call({ from: this.account })
      const orders = user.orders
      for (const iterator of orders) {
        const order: OrderModel = new OrderModelClass()
        const item: CartProduct = new CartProductClass()

        const n = parseInt(iterator, 10)
        const data = await this.spk
          .marketOrder(iterator)
          .call({ from: this.account })
        console.log('TCL: AccountSummeryComponent -> onLoad -> data', data)
        order.orderId = n
        order.orderDetails = JSON.parse(data.orderDetails)
        order.totalPrice = data.totalPrice
        order.timeStamp = data.timeStamp
        this.orderData.push(order)
      }
    } catch (error) {}
  }
  orderView = async (i) => {
    try {
      this.currentOrder.orderId = this.orderData[i].orderId
      this.currentOrder.totalPrice = this.orderData[i].totalPrice / 100
      this.currentOrder.orderDetails = this.orderData[i].orderDetails
      const date = new Date(parseInt(this.orderData[i].timeStamp, 10) * 1000)
      this.currentOrder.timeStamp = date.toLocaleString()
      this.view = 1
    } catch (error) {}
  }
  prodView = async (p_Id) => {
    const temp1 = await this.spk.product1(p_Id).call({ from: this.account })
    const temp = await this.spk.product2(p_Id).call({ from: this.account })
    console.log('TCL: ViewProductComponent -> onLoad -> temp1', temp1)
    console.log('TCL: ViewProductComponent -> onLoad -> temp', temp)
    const temProduct: ProductModel = new ProductModelClass()
    temProduct.itemName = await this.web3service.fromBytes(temp1.itemName)
    temProduct.itemPrice = temp1.itemPrice
    temProduct.imageId = await this.web3service.fromBytes(temp1.imageId)
    temProduct.itemCount = temp1.availableCount
    temProduct.itemColor = temp.itemColor
    temProduct.itemType = temp.itemType
    temProduct.itemDetails = await this.web3service.fromBytes(temp.itemDetails)
    temProduct.itemBrand = await this.web3service.fromBytes(temp.itemBrand)
    temProduct.itemId = p_Id
    const imgs: any = await this.api.viewProducts(temProduct.imageId)
    const a = temProduct.itemColor,
      b = temProduct.itemType
    temProduct.itemColor = this.color[a]
    temProduct.itemType = this.type[b]
    temProduct.imageData = new Array()
    imgs.forEach((img: ImageDataModel, i: any) => {
      temProduct.imageData[i] = img
    })
    this.productList = temProduct
  }
  statusView = async (itemId, orderId) => {
    this.orderStatus = await this.spk
      .productOrder(orderId, itemId)
      .call({ from: this.account })
    this.orderStatus.itemId = itemId
    console.log(
      'TCL: AccountSummeryComponent -> statusView -> this.orderStatus',
      this.orderStatus
    )
    const temp1 = await this.spk.product1(itemId).call({ from: this.account })
    const temp = await this.spk.product2(itemId).call({ from: this.account })
    console.log('TCL: ViewProductComponent -> onLoad -> temp1', temp1)
    console.log('TCL: ViewProductComponent -> onLoad -> temp', temp)
    const temProduct: ProductModel = new ProductModelClass()
    temProduct.itemName = await this.web3service.fromBytes(temp1.itemName)
    temProduct.itemPrice = temp1.itemPrice
    temProduct.imageId = await this.web3service.fromBytes(temp1.imageId)
    temProduct.itemCount = temp1.availableCount
    temProduct.itemColor = temp.itemColor
    temProduct.itemType = temp.itemType
    temProduct.itemDetails = await this.web3service.fromBytes(temp.itemDetails)
    temProduct.itemBrand = await this.web3service.fromBytes(temp.itemBrand)
    temProduct.itemId = itemId
    const imgs: any = await this.api.viewProducts(temProduct.imageId)
    const a = temProduct.itemColor,
      b = temProduct.itemType
    temProduct.itemColor = this.color[a]
    temProduct.itemType = this.type[b]
    temProduct.imageData = new Array()
    imgs.forEach((img: ImageDataModel, i: any) => {
      temProduct.imageData[i] = img
    })
    this.productList = temProduct

    this.onLoad();
  }
  cancelOrder = async (o_Id, p_Id) => {
    try {
      const data = await this.spk
        .cancelOrder(o_Id, p_Id)
        .send({ from: this.account })
      console.log('TCL: AccountSummeryComponent -> cancelOrder -> data', data)
      if (data.status) {
        alert('Order Cancelled')
        this.onLoad()
      }
    } catch (error) {}
  }
  confirmOrder = async (o_Id, p_Id) => {
    try {
      const data = await this.spk
        .confirmDelivery(o_Id, p_Id)
        .send({ from: this.account })
      console.log('TCL: AccountSummeryComponent -> confirmOrder -> data', data)
      if (data.status) {
        alert('Order Cancelled')
        this.onLoad()
      }
    } catch (error) {}
  }
  dispute = async (o_Id, p_Id) => {
    try {
      const data = await this.spk
        .confirmOrder(o_Id, p_Id)
        .send({ from: this.account })
      console.log('TCL: AccountSummeryComponent -> dispute -> data', data)
      if (data.status) {
        alert('Order Cancelled')
        this.onLoad()
      }
    } catch (error) {}
  }
  clearProduct = async () => {
    this.productList = new ProductModelClass();
  };
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }
}
