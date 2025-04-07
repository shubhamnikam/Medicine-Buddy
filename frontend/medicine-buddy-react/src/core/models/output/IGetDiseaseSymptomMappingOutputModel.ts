export interface IGetDiseaseSymptomMappingOutputModel{
  diseaseSymptomMappingId: number;
  diseaseId: number;
  diseaseTitle: string;
  diseaseDescription: string;
  diseaseIsActive: number;
  symptomId: number;
  symptomTitle: string;
  symptomDescription: string;
  symptomIsActive: boolean;
  transactionId: string;
}
