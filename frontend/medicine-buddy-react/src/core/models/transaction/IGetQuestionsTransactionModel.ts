export interface IGetQuestionsTransactionModel {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  transactionId: string;
  answer: string | null;
}
