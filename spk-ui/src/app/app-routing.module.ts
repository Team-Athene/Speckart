import { MarketRouterComponent } from './Components/token-market/market-router/market-router.component'
import { ViewProductComponent } from './Components/seller/view-product/view-product.component'
import { AddProductComponent } from './Components/seller/add-product/add-product.component'
import { ViewCartComponent } from './Components/user/view-cart/view-cart.component'
import { AccountSummeryComponent } from './Components/user/account-summery/account-summery.component'
import { UserRouterComponent } from './Components/user/user-router/user-router.component'
import { RegisterComponent } from './Components/register/register.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './Components/home/home.component'
import { UserComponent } from './Components/user/user.component'
import { TokenMarketComponent } from './Components/token-market/token-market.component'
import { LoginGuard } from './Guards/Login/login.guard'
import { ViewOrdersComponent } from './Components/seller/view-orders/view-orders.component'
import { ShopComponent } from './Components/user/shop/shop.component'
import { TokenMarketComponent_User } from './Components/user/token-market-user/token-market.component'
import { UserDetailsComponent } from './Components/user/user-details/user-details.component'
import { ChatRoomComponent } from './Components/user/chat-room/chat-room.component'
import { TokenMarketAdminComponent } from './Components/admin/token-market-admin/token-market-admin.component'
import { SellerDetailsComponent } from './Components/seller/seller-details/seller-details.component'
import { SellerComponent } from './Components/seller/seller.component'
import { SellerRouterComponent } from './Components/seller/seller-router/seller-router.component'
import { AdminComponent } from './Components/admin/admin.component'
import { AdminRouterComponent } from './Components/admin/admin-router/admin-router.component'
import { TokenMarketSellerComponent } from './Components/seller/token-market-seller/token-market-seller.component'


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'register',
    canActivate: [ LoginGuard ],
    component: RegisterComponent
  },
  {
    path: 'market',
    component: UserRouterComponent,
    children: [
      {
        path: '',
        component: UserComponent
      },
      {
        path: 'summary',
        component: AccountSummeryComponent
      },
      {
        path: 'cart',
        component: ViewCartComponent
      },
      {
        path: 'shop',
        component: ShopComponent
      },
      {
        path: 'exchange',
        component: TokenMarketComponent_User
      },
      {
        path: 'userDetails',
        component: UserDetailsComponent
      }
    ]
  },
  {
    path: 'seller',
    component: SellerRouterComponent,
    children: [
      {
        path: '',
        component: SellerComponent
      },
      {
        path: 'add-product',
        component: AddProductComponent
      },
      {
        path: 'userDetails',
        component: SellerDetailsComponent
      },
      {
        path: 'view-products',
        component: ViewProductComponent
      },
      {
        path: 'view-orders',
        component: ViewOrdersComponent
      },
      {
        path: 'exchange',
        component: TokenMarketSellerComponent
      },

    ]
  },
  {
    path: 'admin',
    component: AdminRouterComponent,
    children: [
      {
        path: '',
        component: AdminComponent
      },
      {
        path: 'exchange',
        component: TokenMarketAdminComponent
      }
    ]
  },
  {
    path: 'exchange',
    component: MarketRouterComponent,
    canActivate: [ LoginGuard ],
    children: [
      {
        path: '',
        component: TokenMarketComponent
      }
    ]
  },
  {
    path: 'chatroom',
    component: ChatRoomComponent
  },
]


@NgModule( {
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
