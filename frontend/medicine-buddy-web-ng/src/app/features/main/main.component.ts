import { transition } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { IGetDiseaseSymptomMapping } from 'src/app/core/interfaces/IGetDiseaseSymptomMapping';
import { ErrorService } from 'src/app/core/services/error.service';
import { HttpService } from 'src/app/core/services/http.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { AppConstants } from 'src/app/core/utility/AppConstants';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  sub_getDiseaseSymptomsMapping: any;
  sub_getDiseaseMedicineMapping: any;
  sub_createUserSymptomEntry: any;
  sub_createUserMedicineEntry: any;
  questionForm!: FormGroup;

  section_1: any = {
    isCompleted: false,
    userId: 0,
    diseaseId: 0,
    transactionId: '',
    diseaseList:[]
  };
  section_2: any = {
    isCompleted: false,
    userId: 0,
    transactionId: '',
    questionList: []
  };
  section_3: any = {
    isCompleted: false,
    userId: 0,
    diseaseId: 0,
    medicineList: [],
    transactionId: ''
  };
  constructor(
    private router: Router,
    private httpService: HttpService,
    private errorService: ErrorService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDiseaseSymptomsMapping();
    this.questionForm = this.fb.group({
      responses: this.fb.array(this.section_1.questionList.map((q: any) => this.createQuestionGroup(q)))
    });
  }

  getDiseaseSymptomsMapping() {
    this.section_1.isCompleted = false;

    this.sub_getDiseaseSymptomsMapping = this.httpService
      .getDiseaseSymptomsMapping()
      .subscribe(
        (resultObj) => {
          console.log(resultObj);

          const diseaseMap = new Map();
          resultObj.model.forEach((entry) => {
            const {
              diseaseId,
              diseaseTitle,
              diseaseDescription,
              symptomId,
              symptomTitle,
              symptomDescription,
              transactionId,
            } = entry;

            if (!diseaseMap.has(diseaseId)) {
              diseaseMap.set(diseaseId, {
                diseaseId,
                diseaseTitle,
                diseaseDescription,
                transactionId,
                symptoms: [],
              });
            }

            diseaseMap.get(diseaseId).symptoms.push({
              symptomId,
              symptomTitle,
              symptomDescription,
            });
          });

          this.section_1.diseaseList = Object.values(Object.fromEntries(diseaseMap));

          console.log(this.section_1.diseaseList);
        },
        (error) => {
          this.errorService.handleError(error);
        }
      );
  }

  handleOnClickDiseaseSelection(diseaseId: Number, transactionId: string): void {

    this.section_1.isCompleted = true;
    this.section_2.isCompleted = false;
    this.section_3.isCompleted = false;

    this.section_1.diseaseId = diseaseId;
    this.section_1.transactionId = transactionId;

    this.sub_getDiseaseSymptomsMapping = this.httpService
      .getQuestions(this.section_1.transactionId)
      .subscribe(
        (resultObj) => {
          console.log(resultObj);
          this.section_2.questionList = resultObj.model;     
          this.questionForm = this.fb.group({
            responses: this.fb.array(this.section_2.questionList.map((q: any) => this.createQuestionGroup(q)))
          });
        },
        (error) => {
          this.errorService.handleError(error);
        }
      );
  }

  createQuestionGroup(question: any): FormGroup {
    return this.fb.group({
      id: [question.id],
      title: [question.title],
      description: [question.description],
      answer: ['']  // Text input for user answer
    });
  }

  get responses(): FormArray {
    return this.questionForm.get('responses') as FormArray;
  }
  submitQuestionsForm(): void {
    const formData = this.questionForm.value.responses;
    console.log("Submitting:", formData);

    this.section_1.isCompleted = true;
    this.section_2.isCompleted = true;
    this.section_3.isCompleted = false;

    this.getDiseaseMedicineMapping();
  }

  getDiseaseMedicineMapping() {

    this.sub_getDiseaseMedicineMapping = this.httpService
      .getDiseaseMedicineMapping(this.section_1.transactionId, this.section_1.diseaseId)
      .subscribe(
        (resultObj) => {
          console.log(resultObj);
          this.section_3.medicineList = resultObj.model;  
        },
        (error) => {
          this.errorService.handleError(error);
        }
      );
  }
  
  handlerOnClickMedicinesOkButton(): void {

    this.section_1.isCompleted = false;
    this.section_2.isCompleted = false;
    this.section_3.isCompleted = true;
    
    const userObject = StorageService.getFromSessionStorage(AppConstants.LOGGED_IN_USER_COMPLETE_OBJ);
    console.log(userObject);
    
    const finalMedicineToSave: any[] = []
    this.section_3.medicineList.forEach((item: any) => {     
      finalMedicineToSave.push({
        medicineId: item.medicineId,
        userId: userObject.userId,
        transactionId: this.section_1.transactionId
      })
    })
    console.log(finalMedicineToSave);

    
    this.sub_createUserSymptomEntry = this.httpService
    .createUserSymptomEntry(userObject.userId, this.section_1.diseaseId, this.section_1.transactionId)
    .subscribe(
      (resultObj) => {
        console.log(resultObj);
      },
      (error) => {
        this.errorService.handleError(error);
      }
    );
    
    this.sub_createUserMedicineEntry = this.httpService
    .createUserMedicineEntry(finalMedicineToSave)
    .subscribe(
      (resultObj) => {
        console.log(resultObj);
      },
      (error) => {
        this.errorService.handleError(error);
      }
    );

    // this.router.navigate(["/page/home"]);
  }
  ngOnDestroy(): void {}
}
