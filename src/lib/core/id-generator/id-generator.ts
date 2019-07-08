import { Injectable } from '@angular/core';

@Injectable()
export class IdGenerator {

  generate(data?: any) {
    return (new Date()).getTime();
  }

}
