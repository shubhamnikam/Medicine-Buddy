import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private router: Router, private route: ActivatedRoute) {}


  computeValue(colData: any, colName: any, valueConfigObj: any): string {
    let computedValue = '';
    try {
      //check for style availability
      if (valueConfigObj.hasOwnProperty(colName)) {
        const valueConfig = valueConfigObj[colName];
        const valueTitle = valueConfig['valueTitle'];
        computedValue = `${valueTitle} : ${colData}`;
      } else {
        computedValue = colData;
      }
    } catch (error) {
      console.warn(`computeValue not appliled : ${error}`);
    }
    return computedValue;
  }

  computeStyleClass(
    rowData: any,
    colData: any,
    colName: string,
    colStyleConfigObj: any
  ): string {
    let computedClassName = '';
    try {
      //check for style availability
      if (colStyleConfigObj.hasOwnProperty(colName)) {
        const colStyleConfigList = colStyleConfigObj[colName];

        //check all available conditions per value to be render
        colStyleConfigList.forEach((config: any, index: number) => {
          const className = config['className'];
          const condition = config['condition'];

          // direct attach style without expression evalution
          if (condition == 'true') {
            computedClassName = className;
          } else {
            // find + replace conditions + evalute
            //new way
            let expression = condition;
            for (const [key, value] of Object.entries(rowData)) {
              if (expression.includes(`{{${key}}}`)) {
                expression = expression.replaceAll(`{{${key}}}`, value);
              }
            }

            if (eval(expression)) {
              computedClassName = className;
            }
          }
        });
      }
    } catch (error) {
      console.warn(`computeStyleClass not appliled : ${error}`);
    }
    return computedClassName;
  }

  reloadCurrentPage(hardReloadRequired: boolean = false): void {
    if (hardReloadRequired) {
      window.location.reload();
    } else {
      const currentUrl = this.router.url;
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate([currentUrl]));
    }
  }

  computeStyleClassByValue(value:string, configuration:any){

    let computedClassName = '';
    try
    {
        //check all available conditions per value to be render
        configuration.forEach((config: any, index: number) => {
          const className = config['className'];
          const condition = config['condition'];

        let expression = condition;

        if (expression.includes(`{{Value}}`)) {
          expression = expression.replaceAll(`{{Value}}`, value);
        }

        if (eval(expression)) {
          computedClassName = className;
        }
      });
    }
     catch (error) {
      console.warn(`computeStyleClass not appliled : ${error}`);
    }
    return computedClassName;

  }
}
