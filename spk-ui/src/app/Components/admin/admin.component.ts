import { Component, OnInit } from '@angular/core'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Router } from '@angular/router'
import { Web3Model } from 'src/app/Models/web3.model'
import { DisputeModelClass, ProductModelClass } from 'src/app/Models/Class/cart.class'
import { DisputeModel, ProductModel, ImageDataModel } from 'src/app/Models/spk.model'
import { ApiService } from 'src/app/Services/api/api.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  account: string
  spk: any
  token: any
  dispute: any

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
  userType = {
    1: 'Buyer',
    2: 'Seller'
  }

  constructor(
    private api: ApiService,
    private spec: SpkService,
    private web3service: Web3Service,
    private route: Router
  ) {}

  ngOnInit() {
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
      this.token = data.token
      this.dispute = data.dispute
    })
    this.load()
  }

  load = async () => {
    try {
      const D_ID: number = await this.dispute.getDID().call({ from: this.account })
      for (let index = 10000; index < D_ID; index++) {
        const getDispute: any = await this.dispute.getDispute().call({ from: this.account })
        const tempDispute: DisputeModel = new DisputeModelClass()
        tempDispute.disputeId = index
        tempDispute.orderId = getDispute.orderId
        tempDispute.productId = getDispute.productId
        tempDispute.creatorType = getDispute.creatorType
        tempDispute.comment = getDispute.comment
        tempDispute.comment = getDispute.bVote
        tempDispute.comment = getDispute.sVote
        tempDispute.isDisputeCleared = getDispute.isDisputeCleared
        const order: any = await this.dispute.marketOrder(tempDispute.orderId).call({ from: this.account })
        tempDispute.Order.Buyer = order.BuyerAddr
        tempDispute.Order.timeStamp = order.timeStamp

        const temp1 = await this.spk.product1(tempDispute.productId).call({ from: this.account })
        const temp2 = await this.spk.product2(tempDispute.productId).call({ from: this.account })
        const temProduct: ProductModel = new ProductModelClass()
        temProduct.itemName = await this.web3service.fromBytes(temp1.itemName)
        temProduct.itemPrice = (temp1.itemPrice / 100)
        temProduct.imageId = await this.web3service.fromBytes(temp1.imageId)
        temProduct.itemCount = temp1.availableCount
        temProduct.itemColor = temp2.itemColor
        temProduct.itemType = temp2.itemType
        temProduct.itemDetails = await this.web3service.fromBytes(temp2.itemDetails)
        temProduct.itemBrand = await this.web3service.fromBytes(temp2.itemBrand)
        temProduct.itemId = tempDispute.productId
        const imgs: any = await this.api.viewProducts(temProduct.imageId)
        const a = temProduct.itemColor,
          b = temProduct.itemType
        temProduct.itemColor = this.color[a]
        temProduct.itemType = this.type[b]
        temProduct.imageData = new Array()
        imgs.forEach((img: ImageDataModel, i: any) => {
          temProduct.imageData[i] = img
        })
        
      }

    } catch (error) {

    }
  }

  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }
}
