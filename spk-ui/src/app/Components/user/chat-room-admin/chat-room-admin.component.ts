import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/Services/Web3/web3.service';
import { Router } from '@angular/router';
import { Web3Model } from 'src/app/Models/web3.model';

@Component({
  selector: 'app-chat-room-admin',
  templateUrl: './chat-room-admin.component.html',
  styleUrls: ['./chat-room-admin.component.scss']
})
export class ChatRoomAdminComponent implements OnInit {

  account: string
  spk: any

  constructor(private web3service: Web3Service, private route: Router) { }

  ngOnInit() {
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account
      this.spk = data.spk
    })
  }

  logOut = async () => {
    this.route.navigateByUrl('/market')
  }
}
