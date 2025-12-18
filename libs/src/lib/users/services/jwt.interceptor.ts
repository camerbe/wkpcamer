import { HttpInterceptorFn } from '@angular/common/http';
import { LocalstorageService } from '../../../../shared/src/lib/src/lib/storage/localstorage.service';
import { inject } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const localstorageService =inject(LocalstorageService);
  const token =localstorageService.getToken();
  const apiUrl=req.url.startsWith(CONFIG.apiUrl);
  if(token && apiUrl){
    const autReq = req.clone({
      setHeaders:{
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers':'*',
        'Content-Type':'application/json',
        'Accept':'*/*',
        'mode': 'no-cors',
        'Authorization':`Bearer ${token}`
      }
    });
    return next(autReq);
  }
  return next(req);
};
