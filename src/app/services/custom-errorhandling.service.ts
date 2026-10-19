import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorhandlingService  implements ErrorHandler{

  constructor() { }
  handleError(error: any): void {
    console.error('An error occurred: ' + error.message);
    // Optionally, send the error to an external logging service
  }
}
