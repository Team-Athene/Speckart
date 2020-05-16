import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input()
  UserType: number;
  constructor(private route: Router) { }

  ngOnInit() {
  }
  logOut = async () => {
    sessionStorage.clear()
    this.route.navigateByUrl('/')
  }

}
