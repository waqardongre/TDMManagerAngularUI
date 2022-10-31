import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TDM';

  ngOnInit() {
    console.log(DEVELOPER)
  }
}

export const DOTNETCOREAPI = "https://localhost:7043/"

export const DEVELOPER = ""+
"DEVELOPER: Mohamed Waqar Zulfeqar Dongre"+
"   Email: waqardongre@gmail.com"+
"   Github Profile: https://github.com/waqardongre?tab=repositories"