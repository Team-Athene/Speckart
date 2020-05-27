import { ApiService } from 'src/app/Services/api/api.service'
// import { SocketService } from './../../Services/socket/socket.service'
import { async } from '@angular/core/testing'
import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Router } from '@angular/router'
import { Web3Model } from 'src/app/Models/web3.model'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  account: string
  spk: any
  constructor(
    private web3service: Web3Service,
    private route: Router,
    private api: ApiService
  ) {}
  ngOnInit() {
    // this.api.testapi()
    // this.socket.test()
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
    })
  }
  login = async () => {
    try {
      await this.web3service.web3login()
      this.checkUser()
    } catch (error) {}
  }
  checkUser = async () => {
    try {
      const userType = await this.spk.checkUser().call({ from: this.account })
      if (userType === '1') {
        this.route.navigateByUrl('/market')
      } else if (userType === '2') {
        this.route.navigateByUrl('/seller')
      } else if (userType === '3') {
        this.route.navigateByUrl('/admin')
      } else {
        alert('Invalid User')
      }
    } catch (error) {}
  }
}
