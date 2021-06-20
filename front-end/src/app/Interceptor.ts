import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


const TOKEN_KEY = 'Token';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private alertController: AlertController, private storage: Storage) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.storage.get(TOKEN_KEY))
      .pipe(
        switchMap(token => {
          token = token.replaceAll("\"","");
          if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
          }
          return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
              return event;
            }),
            catchError((error: HttpErrorResponse) => {
              return throwError(error);
            })
          );
        })
      );


  }
}
