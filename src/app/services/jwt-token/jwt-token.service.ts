import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import ls from 'localstorage-slim';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor() {
    ls.config.encrypt = true;
  }
  
  getJWTTokenDetails(): {} {
    const tokenDetailsDict: any = {}; 
    const loginTokenDetails: any = ls.get("loginTokenDetails", { secret: 95 });
    if (loginTokenDetails == null) {
      tokenDetailsDict.jwtToken = "";
      tokenDetailsDict.email = "";
      tokenDetailsDict.userId = "";
      tokenDetailsDict.refreshToken = "";  
      return tokenDetailsDict;
    }
    const jwtToken: string = loginTokenDetails.jwtToken;
    const refreshToken: string = loginTokenDetails.refreshToken;
    const decoded: any = jwt_decode(jwtToken);
    const emailString: any = decoded["Email"].toString() || "";
    const email: string = emailString;
    const userIdString: any = decoded["UserId"].toString() || "";
    const userId: string = userIdString;
    tokenDetailsDict.jwtToken = jwtToken;
    tokenDetailsDict.email = email;
    tokenDetailsDict.userId = userId;
    tokenDetailsDict.refreshToken = refreshToken;
    return tokenDetailsDict;
  }

  setJWTToken(loginTokenDetails: any): void {
    ls.set("loginTokenDetails", loginTokenDetails, { secret: 95 });
  }

  getTokenRequestHeaderOptions(): any {
    const tokenDetailsDict: any = this.getJWTTokenDetails();
    const JWTToken = tokenDetailsDict.JWTToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${JWTToken}`
    });
    const requestOptions = { headers: headers };
    return requestOptions;
  }
}
