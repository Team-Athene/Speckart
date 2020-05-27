import { UserModel } from './../../Models/spk.model'
import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Web3Model } from 'src/app/Models/web3.model'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../../assets/styles/form.css',
    './register.component.scss']
})
export class RegisterComponent implements OnInit {
  account: string
  spk: any
  constructor(private web3service: Web3Service, private route: Router) { }
  ngOnInit() {
    this.web3service.web3login()
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
    })
  }
  onSubmit = async (form: NgForm) => {
    try {
      const user: UserModel = form.value
      const regRespone = await this.spk.userSignUp(
        await this.web3service.toBytes( user.name ),
        user.contact,
        user.gender,
        await this.web3service.toBytes( user.mail ),
        user.address,
        user.type
      ).send({ from: this.account, gas: 5000000 })
      if (regRespone.status) {
        const a = await this.web3service.fromBytes( regRespone.events.SignUp.returnValues.name)
        alert('Hi ' + user.name + '  Your Registration to SpecKart is Success')
        this.route.navigateByUrl('/')
      }
    } catch (error) {

    }
  }

}
