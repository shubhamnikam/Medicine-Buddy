export interface IGetDiseaseMedicineMappingOutputModel {
  diseaseMedicineMappingId: number;
  diseaseId: number;
  diseaseTitle: string;
  diseaseDescription: string;
  diseaseIsActive: number;
  medicineId: number;
  medicineTitle: string;
  medicineDescription: string;
  medicineIsActive: boolean;
  transactionId: string;
}
