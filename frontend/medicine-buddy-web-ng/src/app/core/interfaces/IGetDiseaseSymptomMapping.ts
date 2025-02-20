export interface IGetDiseaseSymptomMapping{
  contextStatus: Number;
  contextTitle: Number;
  contextSubTitle: Number;
  message:string;
  model: IGetDiseaseSymptomMappingModel[]
}
interface IGetDiseaseSymptomMappingModel{
  diseaseSymptomMappingId: Number;
  diseaseId: Number;
  diseaseTitle: string;
  diseaseDescription: string;
  diseaseIsActive: Number;
  symptomId: Number;
  symptomTitle: string;
  symptomDescription: string;
  symptomIsActive: boolean;
  transactionId: string;
}


export interface IGetQuestions{
  contextStatus: Number;
  contextTitle: Number;
  contextSubTitle: Number;
  message:string;
  model: IGetQuestionsModel[]
}
interface IGetQuestionsModel{
  id: Number;
  title: string;
  description: string;
  isActive: boolean;
  transactionId: string;
}

export interface IGetDiseaseMedicineMapping{
  contextStatus: Number;
  contextTitle: Number;
  contextSubTitle: Number;
  message:string;
  model: IGetDiseaseMedicineMappingModel[]
}
interface IGetDiseaseMedicineMappingModel{
  diseaseMedicineMappingId: Number;
  diseaseId: Number;
  diseaseTitle: string;
  diseaseDescription: string;
  diseaseIsActive: Number;
  medicineId: Number;
  medicineTitle: string;
  medicineDescription: string;
  medicineIsActive: boolean;
  transactionId: string;
}



export interface ICreateUserSymptomEntry{
  contextStatus: Number;
  contextTitle: Number;
  contextSubTitle: Number;
  message:string;
  model: boolean
}
export interface ICreateUserMedicineEntry{
  contextStatus: Number;
  contextTitle: Number;
  contextSubTitle: Number;
  message:string;
  model: boolean
}

export interface IGetUserProfile{
  contextStatus: Number;
  contextTitle: Number;
  contextSubTitle: Number;
  message:string;
  model: IGetUserProfileModel
}
export interface IGetUserProfileModel{
  id: Number;
  firstName: string;
  lastName: string;
  userName: string;
  age: Number;
  height: Number;
  weight: Number;
  createdOn: Date;
}


export interface IUserRegister{
  contextStatus: Number;
  contextTitle: Number;
  contextSubTitle: Number;
  message:string;
  model: string
}