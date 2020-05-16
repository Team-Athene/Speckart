import { async } from '@angular/core/testing'
import { Component, OnInit } from '@angular/core'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { UserBalanceModel, TokenModel } from 'src/app/Models/spk.model'
import { Web3Model } from 'src/app/Models/web3.model'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userBalance: UserBalanceModel = {
    etherBal: null,
    tokenBal: null
  }
  account: string
  spk: any
  constructor(private spec: SpkService, private web3service: Web3Service) { }

  ngOnInit() {
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
    })
    this.load()
  }
  load = async () => {
    const spkDetails: TokenModel = await this.spk.spkDetails().call({ from: this.account })
    this.userBalance = {
      etherBal: await this.spec.getBalance(this.account),
      tokenBal: (await this.spk.balanceOf(this.account).call({ from: this.account }) / (10 ** spkDetails.tokenDecimals))
    }
  }
}
