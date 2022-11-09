import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TDM';

  constructor(
    private router: Router
  ){
    // navigating to 
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (
        event.id == 1 &&
        event.url == event.urlAfterRedirects &&
        event.urlAfterRedirects != '/register'
      ) {
        this.router.navigateByUrl('/modelslist');
      }
    })
  }

  ngOnInit() {
    console.log(DEVELOPER)
  }
  
}

//export const DOTNETCOREAPI = "https://localhost:7043/" //localhost

export const DOTNETCOREAPI = "https://tdm20221108224831.azurewebsites.net/" //livehost

export const DEVELOPER = ""+
"DEVELOPER: Mohamed Waqar Zulfeqar Dongre"+
"   Email: waqardongre@gmail.com"+
"   Github Profile: https://github.com/waqardongre?tab=repositories"
