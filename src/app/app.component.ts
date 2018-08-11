import { Component, OnInit } from '@angular/core';
import { CltThemeService, CltSideBarService, Configuration, CltNotificationsService } from 'ngx-callisto/dist';
import { AuthService, AuthError } from '../auth/auth.service';
import { GraphQLError } from '../graphQL/graphQL.module';
import { merge } from 'rxjs';
import { CommonService } from './providers/common.service';
import { HttpClient } from '@angular/common/http';
const actualVersion = require('../../package.json')
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  sidebarConf: Configuration;
  update = false
  remoteVersion
  actualVersion
  constructor(
    themeService: CltThemeService,
    public sidebarService: CltSideBarService,
    public authservice: AuthService,
    private notifService: CltNotificationsService,
    public common: CommonService,
    private http: HttpClient,
  ) {
    let theme = window.localStorage.getItem('theme')
    http.get('http://vps573766.ovh.net:3000/version').toPromise().then((remoteVersion: any)=>{
      this.remoteVersion = remoteVersion.version;
      this.actualVersion = actualVersion.version;
      if(actualVersion.version !== remoteVersion.version) {
        this.update = true;
      }
    })
    if(theme) {
      theme = JSON.parse(theme)
      themeService.theme = theme
      themeService.reload()
    }
    this.sidebarConf = {
      list: [
        {
          icon: 'fas fa-list',
          description: 'Listes',
          url: '/shoppingLists',
          click: _=> { setTimeout(() => this.sidebarService.close(), 50) }
        }, {
          icon: 'fas fa-cookie-bite',
          description: 'Items',
          url: '/items',
          click: _ => { setTimeout(() => this.sidebarService.close(), 50) }
        }, {
          icon: 'fas fa-th-large',
          description: 'Categories',
          url: '/categories',
          click: _ => { setTimeout(() => this.sidebarService.close(), 50) }
        }, {
          icon: 'fas fa-book',
          description: 'Inventaire',
          url: '/inventory',
          click: _ => { setTimeout(() => this.sidebarService.close(), 50) }
        }, {
          icon: 'fas fa-utensil-spoon',
          description: 'Recettes',
          url: '/recipes',
          click: _ => { setTimeout(() => this.sidebarService.close(), 50) }
        }
      ],
      bottom: [
        {
          icon: 'fas fa-cog',
          description: 'Paramètres',
          url: '/settings',
          click: _ => { setTimeout(() => this.sidebarService.close(), 50) }
        }
      ]
    };
    let touchStart;
    document.addEventListener('touchstart', (ev => {
      touchStart = ev.touches[0].clientX;
    }));
    document.addEventListener('touchmove', (ev => {
      const delta = ev.touches[0].clientX - touchStart;
      if (touchStart < 20 && delta > 100) sidebarService.open();
      if (touchStart > window.innerWidth - 20 && delta < -100) sidebarService.close();
    }));
  }
  ngOnInit() {
    merge(AuthError, GraphQLError).subscribe(({ message, code, deleteAll }) => {
      if (deleteAll) {
        setTimeout(() => {
          this.notifService.deleteAll();
          this.notifService.add(message.title, message.detail);
        }, 10);
      } else {
        this.notifService.add(message.title, message.detail);
      }
    });
  }
  getName() {
    return this.common.routeName;
  }

}
