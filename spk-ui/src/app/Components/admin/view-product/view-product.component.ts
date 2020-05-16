import { ProductModel, ImageDataModel } from './../../../Models/spk.model'
import { Component, OnInit } from '@angular/core'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Web3Model } from 'src/app/Models/web3.model'

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
  account: string
  spk: any
  imgurl = 'http://0.0.0.0:3000/'
  products: ProductModel[] = []
  productDetail: ProductModel = {
    imageId: null,
    itemDetails: null,
    itemId: null,
    itemName: null,
    itemPrice: null,
    itemType: null,
    ratingCount: null,
    imageData: null
  }
  constructor(private api: ApiService, private web3service: Web3Service) { }
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
    } catch (error) {
    }
  }
  detailView = async (product: ProductModel) => {
    this.productDetail = product
  }
  clearProduct = async () => {
    this.productDetail = {
      imageId: null,
      itemDetails: null,
      itemId: null,
      itemName: null,
      itemPrice: null,
      itemType: null,
      ratingCount: null,
      imageData: null
    }
  }

}
