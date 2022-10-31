import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {

  constructor() { }

  getTokenDetails(): {} {
    const JWTTokenString: any = localStorage.getItem("JWTToken")?.toString();
    const JWTToken: string = JWTTokenString;
    const decoded: any = jwt_decode(JWTToken);
    const emailString: any = decoded["Email"].toString();
    const email: string = emailString;
    const userIdString: any = decoded["UserId"].toString();
    const userId: string = userIdString;
    const tokenDetailsDict: any = {}; 
    tokenDetailsDict.JWTToken = JWTToken;
    tokenDetailsDict.email = email;
    tokenDetailsDict.userId = userId;
    return tokenDetailsDict;
  }

  setToken(JWTToken: string): void {
    localStorage.setItem("JWTToken", JWTToken);
  }

  getTokenRequestHeaderOptions() {
    const tokenDetailsDict: any = this.getTokenDetails();
    const JWTToken = tokenDetailsDict.JWTToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${JWTToken}`
    });
    const requestOptions = { headers: headers };
    return requestOptions;
  }

}
