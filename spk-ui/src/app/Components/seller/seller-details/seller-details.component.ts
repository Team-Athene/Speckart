import { Component, OnInit } from '@angular/core'
import { UserBalanceModel } from 'src/app/Models/spk.model'
import { UserBalanceModelClass } from 'src/app/Models/Class/cart.class'
import { ApiService } from 'src/app/Services/api/api.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Router } from '@angular/router'
import { Web3Model } from 'src/app/Models/web3.model'

@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.scss']
})
export class SellerDetailsComponent implements OnInit {
  account: string
  spk: any
  token: any
  name: string
  contact: any
  gender: string
  email: string
  address: string
  status: any
  userBalance: UserBalanceModel = new UserBalanceModelClass()
  constructor(private api: ApiService, private web3service: Web3Service, private spec: SpkService, private route: Router) { }

  ngOnInit() {
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
      this.token = data.token
    })
    this.onLoad()
  }
  onLoad = async () => {
    try {
      this.userBalance = {
        etherBal: await this.spec.getBalance(this.account),
        tokenBal: (await this.token.balance(this.account).call({ from: this.account }) / (10 ** 2))
      }
      const user = await this.spk.userDetails().call({ from: this.account })
      this.name = await this.web3service.fromBytes( user.userName )
      this.contact = await this.web3service.fromBytes( user.userContact )
      if (user.userGender === '1') {
        this.gender = 'Male'
      } else if (user.userGender === '2') {
        this.gender = 'Female'
      } else {
        this.gender = 'Others'
      }
      this.email = user.userEmail
      this.address = user.userAddr
    } catch (error) {
    }
  }
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }
}
