import { TokenModel, UserBalanceModel } from '../../../Models/spk.model'
import { Component, OnInit } from '@angular/core'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Web3Model } from 'src/app/Models/web3.model'
import {
  TokenModelClass,
  UserBalanceModelClass,
} from 'src/app/Models/Class/cart.class'
import { Router } from '@angular/router'

@Component({
  selector: 'app-token-market-seller',
  templateUrl: './token-market-seller.component.html',
  styleUrls: ['./token-market-seller.component.scss'],
})
export class TokenMarketSellerComponent implements OnInit {
  buyCount: number = null
  sellCount: number = null
  account: string
  spk: any
  token: any
  specToken: TokenModel = new TokenModelClass()
  userBalance: UserBalanceModel = new UserBalanceModelClass()
  constructor(
    private spec: SpkService,
    private web3service: Web3Service,
    private route: Router
  ) {}

  ngOnInit() {
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
      this.token = data.token
    })
    this.load()
  }
  load = async () => {
    const spkDetails: TokenModel = await this.token
      .spkDetail()
      .call({ from: this.account })
    this.userBalance = {
      etherBal: await this.spec.getBalance(this.account),
      tokenBal:
        (await this.token.balance(this.account).call({ from: this.account })) /
        10 ** spkDetails.tokenDecimals,
    }
    this.specToken = {
      tokenName: spkDetails.tokenName,
      tokenSymbol: spkDetails.tokenSymbol,
      tokenDecimals: spkDetails.tokenDecimals,
      specTokenAddress: spkDetails.specTokenAddress,
      tokenOwner: spkDetails.tokenOwner,
      tokenTotalSupply:
        spkDetails.tokenTotalSupply / 10 ** spkDetails.tokenDecimals,
      specTokenPrice:
        this.spec.toEther(spkDetails.specTokenPrice) *
        10 ** spkDetails.tokenDecimals,
      etherBal: this.spec.toEther(spkDetails.etherBal),
      tokenBalance: spkDetails.tokenBalance / 10 ** spkDetails.tokenDecimals,
    }
  }
  buy = async () => {
    const ethAmount = this.spec.toWei(
      this.buyCount * this.specToken.specTokenPrice
    )
    const buyers = await this.spk.purchaseToken().send({
      from: this.account,
      gas: 77982,
      value: ethAmount,
    })
    this.load()
  }
  sell = async () => {
    const sellers = await this.spk.sellToken(this.sellCount * 100).send({
      from: this.account,
      gas: 177982,
    })
    this.load()
  }
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }
}
