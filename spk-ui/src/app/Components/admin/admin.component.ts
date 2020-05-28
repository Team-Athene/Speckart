import { Component, OnInit } from '@angular/core'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Router } from '@angular/router'
import { Web3Model } from 'src/app/Models/web3.model'
import { DisputeModelClass, ProductModelClass, OrderStatusModelClass } from 'src/app/Models/Class/cart.class'
import { DisputeModel, ProductModel, ImageDataModel, OrderStatusModel } from 'src/app/Models/spk.model'
import { ApiService } from 'src/app/Services/api/api.service'
import { environment } from 'src/environments/environment'

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
  status: number
  currentDispute: DisputeModel = new DisputeModelClass()
  List: DisputeModel[] = new Array ( new DisputeModelClass() )
  Product: ProductModel = new ProductModelClass()
  Status: OrderStatusModel = new OrderStatusModelClass()
  doneDispute: DisputeModel[] = new Array ( new DisputeModelClass() )
  onDispute: DisputeModel[] = new Array ( new DisputeModelClass() )
  imgurl = environment.imgurl

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
  confirm = {
    true: 'Yes',
    false: 'No',
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
      this.status = 1
      this.doneDispute = []
      this.onDispute = []
      const D_ID: number = await this.dispute.getDID().call({ from: this.account })
      for (let index = 1001; index <= D_ID; index++) {
        const getDispute: any = await this.dispute.getDispute(index).call({ from: this.account })
        const tempDispute: DisputeModel = new DisputeModelClass()
        tempDispute.disputeId = index
        tempDispute.orderId = getDispute.orderId
        tempDispute.productId = getDispute.productId
        tempDispute.creatorType = getDispute.creatorType
        tempDispute.comment = await this.web3service.fromBytes( getDispute.comment )
        tempDispute.bVote = getDispute.bVote
        tempDispute.sVote = getDispute.sVote
        tempDispute.isDisputeCleared = getDispute.isDisputeCleared

        const order: any = await this.spk.marketOrder(tempDispute.orderId).call({ from: this.account })
        console.log('TCL: AdminComponent -> load -> order', order)
        const temOrder: any = {
          Buyer: order.BuyerAddr,
          timeStamp: order.timeStamp
        }
        tempDispute.Order = temOrder

        const temp1 = await this.spk.product1(tempDispute.productId).call({ from: this.account })
        console.log('TCL: AdminComponent -> load -> temp1', temp1)
        const temp2 = await this.spk.product2(tempDispute.productId).call({ from: this.account })
        console.log('TCL: AdminComponent -> load -> temp2', temp2)
        const count: number =  await this.spk.productCount(tempDispute.orderId, tempDispute.productId).call({ from: this.account })
        const temProduct: ProductModel = new ProductModelClass()
        temProduct.itemName = await this.web3service.fromBytes(temp1.itemName)
        temProduct.itemPrice = (temp1.itemPrice / 100)
        temProduct.imageId = await this.web3service.fromBytes(temp1.imageId)
        temProduct.itemCount = count
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
        tempDispute.Product = temProduct


        const tempStatus: OrderStatusModel = await this.spk.productOrder(tempDispute.orderId, tempDispute.productId).call({ from: this.account })
        tempStatus.itemId = tempDispute.productId

        tempDispute.Status = tempStatus

        if (tempDispute.isDisputeCleared === true) {
          this.doneDispute.push(tempDispute)
        } else {
          this.onDispute.push(tempDispute)
        }
      }
      this.List = this.onDispute

    } catch (error) {

    }
  }

  vote = async ( D_ID: number, vote: number ) => {
    try {
      // 1 if seller & 2 for buyer
      const disputeVote: any = await this.spk.DisputeVoting(D_ID, vote).send({ from: this.account })
      if (disputeVote.status) {
        alert('Voting Successful')
        this.load()
      }
    } catch (error) {

    }
  }

  select = async (choice) => {
    this.status = choice
    switch (choice) {
      case 1:
        this.List = this.onDispute
        break
      case 2:
        this.List = this.doneDispute
        break
      default:
        this.List = this.onDispute
        break
    }
  }

  disputeView = async (i: number) => {
    this.currentDispute = this.List[i]
    this.Product = this.List[i].Product
    this.Status = this.List[i].Status
  }

  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }
}
