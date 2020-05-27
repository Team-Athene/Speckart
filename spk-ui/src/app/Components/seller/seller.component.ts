import { async } from '@angular/core/testing'
import { Component, OnInit } from '@angular/core'
import { SpkService } from 'src/app/Services/spk/spk.service'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { UserBalanceModel, TokenModel } from 'src/app/Models/spk.model'
import { Web3Model } from 'src/app/Models/web3.model'
import { Router } from '@angular/router'

@Component( {
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: [ './seller.component.scss' ],
} )
export class SellerComponent implements OnInit {
  userBalance: UserBalanceModel = {
    etherBal: null,
    tokenBal: null,
  }
  account: string
  spk: any
  token: any
  constructor (
    private spec: SpkService,
    private web3service: Web3Service,
    private route: Router
  ) { }

  ngOnInit() {
    this.web3service.web3login()
    this.web3service.Web3Details$.subscribe( async ( data: Web3Model ) => {
      this.account = data.account
      this.spk = data.spk
      this.token = data.token
    } )
    this.load()
  }
  load = async () => {
    const userDetails = await this.spk.userDetails().call( { from: this.account } )
    sessionStorage.setItem( 'name', await this.web3service.fromBytes( userDetails.userName ) )
    const spkDetails: TokenModel = await this.token
      .spkDetail()
      .call( { from: this.account } )
    this.userBalance = {
      etherBal: await this.spec.getBalance( this.account ),
      tokenBal:
        ( await this.token.balance( this.account ).call( { from: this.account } ) ) /
        10 ** spkDetails.tokenDecimals,
    }
  }
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl( '/' )
  }
}
