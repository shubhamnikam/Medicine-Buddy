import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectValue'
})
export class ObjectValuePipe implements PipeTransform {

  transform(value: {}): string[] {

    if (!value) {
      return [];
    }

    return Object.keys(value);
  }
}
