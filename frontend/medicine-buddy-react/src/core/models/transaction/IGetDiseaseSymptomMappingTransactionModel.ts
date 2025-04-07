export interface IGetDiseaseSymptomMappingTransactionModel{
  diseaseSymptomMappingId: number;
  diseaseId: number;
  diseaseTitle: string;
  diseaseDescription: string;
  diseaseIsActive: number;
  transactionId: string;
  symptoms: any[];
}
