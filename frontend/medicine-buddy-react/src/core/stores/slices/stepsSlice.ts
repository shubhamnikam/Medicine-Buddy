import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StateStatus } from "../stateStatus";
import { createUserDiseaseEntry, createUserMedicineEntry, createUserQuestionEntry, getDiseaseMedicineMapping, getDiseaseSymptomMapping, getQuestions } from "../../services/steps.service";
import { CurrentStep } from "../currentStep";
import { IGetDiseaseSymptomMappingTransactionModel } from "../../models/transaction/IGetDiseaseSymptomMappingTransactionModel";
import { IGetQuestionsInputModel } from "../../models/input/IGetQuestionsInputModel";
import { IGetQuestionsTransactionModel } from "../../models/transaction/IGetQuestionsTransactionModel";
import { ICreateUserDiseaseEntryInputModel } from "../../models/input/ICreateUserDiseaseEntryInputModel";
import { ICreateUserDiseaseEntryOutputModel } from "../../models/output/ICreateUserDiseaseEntryOutputModel";
import { ICreateUserQuestionEntryInputModel } from "../../models/input/IUserLogoutInputModel copy";
import { IGetDiseaseMedicineMappingInputModel } from "../../models/input/IGetQuestionsInputModel copy";
import { IGetDiseaseMedicineMappingTransactionModel } from "../../models/transaction/IGetDiseaseMedicineMappingTransactionModel";
import { ICreateUserMedicineEntryInputModel } from "../../models/input/ICreateUserMedicineEntryInputModel";

// initial data
const stepsInitialData = {
  currentStep: CurrentStep.INIT,
  diseaseSymptomMapping: {
    status: StateStatus.DEFAULT as StateStatus,
    data: [] as IGetDiseaseSymptomMappingTransactionModel[],
    error: {} as any | null,
  },
  selectedDiseaseSymptomMapping: {
    status: StateStatus.DEFAULT as StateStatus,
    data: {} as ICreateUserDiseaseEntryOutputModel | null,
    error: {} as any | null,
  },
  questions: {
    status: StateStatus.DEFAULT as StateStatus,
    data: [] as IGetQuestionsTransactionModel[],
    error: {} as any | null,
  },
  medicines: {
    status: StateStatus.DEFAULT as StateStatus,
    data: [] as IGetDiseaseMedicineMappingTransactionModel[],
    error: {} as any | null,
  },
};
// reducer ==> logic to handle action
const stepsSlice = createSlice({
  name: "steps",
  initialState: stepsInitialData,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleGetDiseaseSymptomMapping.pending, (state) => {
        // reset all states
        state.currentStep = CurrentStep.INIT;
        state.diseaseSymptomMapping.status = StateStatus.LOADING;
        state.diseaseSymptomMapping.data = [];
        state.diseaseSymptomMapping.error = null;
      })
      .addCase(handleGetDiseaseSymptomMapping.fulfilled, (state, action) => {
        if (action.payload.model.length > 0) {
          state.currentStep = CurrentStep.STEP_1_PROGRESS;
          state.diseaseSymptomMapping.status = StateStatus.SUCCESS;
          state.diseaseSymptomMapping.error = null;

          const diseaseMap = new Map<
            number,
            IGetDiseaseSymptomMappingTransactionModel
          >();
          action.payload.model.forEach((entry) => {
            if (!diseaseMap.has(entry.diseaseId)) {
              diseaseMap.set(entry.diseaseId, {
                diseaseId: entry.diseaseId,
                diseaseTitle: entry.diseaseTitle,
                diseaseDescription: entry.diseaseDescription,
                transactionId: entry.transactionId,
                symptoms: [] as any[],
              } as IGetDiseaseSymptomMappingTransactionModel);
            }
            diseaseMap.get(entry.diseaseId)?.symptoms.push({
              symptomId: entry.symptomId,
              symptomTitle: entry.symptomTitle,
              symptomDescription: entry.symptomDescription,
            });
          });

          state.diseaseSymptomMapping.data = Object.values(
            Object.fromEntries(diseaseMap)
          );
        }
      })
      .addCase(handleGetDiseaseSymptomMapping.rejected, (state, action) => {
        state.currentStep = CurrentStep.ERROR;
        state.diseaseSymptomMapping.status = StateStatus.FAILED;
        state.diseaseSymptomMapping.data = [];
        state.diseaseSymptomMapping.error =
          action.payload || "Something went wrong!";
      })
      .addCase(handleCreateUserDiseaseEntry.pending, (state) => {
        // reset all states
        state.currentStep = CurrentStep.STEP_1_PROGRESS;
        state.selectedDiseaseSymptomMapping.status = StateStatus.LOADING;
        state.selectedDiseaseSymptomMapping.data = null;
        state.selectedDiseaseSymptomMapping.error = null;
      })
      .addCase(handleCreateUserDiseaseEntry.fulfilled, (state, action) => {
        if (action.payload.model) {
          state.currentStep = CurrentStep.STEP_1_COMPLETE;
          state.selectedDiseaseSymptomMapping.status = StateStatus.SUCCESS;
          state.selectedDiseaseSymptomMapping.data = action.payload.model;
          state.selectedDiseaseSymptomMapping.error = null;
        }
      })
      .addCase(handleCreateUserDiseaseEntry.rejected, (state, action) => {
        state.currentStep = CurrentStep.ERROR;
        state.selectedDiseaseSymptomMapping.status = StateStatus.FAILED;
        state.selectedDiseaseSymptomMapping.data = null;
        state.selectedDiseaseSymptomMapping.error = action.payload || "Something went wrong!";
      })
      .addCase(handleGetQuestions.pending, (state) => {
        // reset all states
        state.currentStep = CurrentStep.STEP_2_PROGRESS;
        state.questions.status = StateStatus.LOADING;
        state.questions.data = [];
        state.questions.error = null;
      })
      .addCase(handleGetQuestions.fulfilled, (state, action) => {
        if (action.payload.model.length > 0) {
          state.currentStep = CurrentStep.STEP_2_PROGRESS;
          state.questions.status = StateStatus.SUCCESS;
          state.questions.error = null;
          state.questions.data = action.payload.model.map((item) => {
            return {...item, answer: null} as IGetQuestionsTransactionModel
          })
        }
      })
      .addCase(handleGetQuestions.rejected, (state, action) => {
        state.currentStep = CurrentStep.ERROR;
        state.questions.status = StateStatus.FAILED;
        state.questions.data = [];
        state.questions.error = action.payload || "Something went wrong!";
      })      
      .addCase(handleCreateUserQuestionEntry.pending, (state) => {
        // reset all states
        state.currentStep = CurrentStep.STEP_2_PROGRESS;
      })
      .addCase(handleCreateUserQuestionEntry.fulfilled, (state, action) => {
        if (action.payload.model === true) {
          state.currentStep = CurrentStep.STEP_2_COMPLETE;
        }
      })
      .addCase(handleCreateUserQuestionEntry.rejected, (state) => {
        state.currentStep = CurrentStep.ERROR;
      })
      .addCase(handleGetDiseaseMedicineMapping.pending, (state) => {
        // reset all states
        state.currentStep = CurrentStep.STEP_3_PROGRESS;
        state.medicines.status = StateStatus.LOADING;
        state.medicines.data = [];
        state.medicines.error = null;
      })
      .addCase(handleGetDiseaseMedicineMapping.fulfilled, (state, action) => {
        if (action.payload.model.length > 0) {
          state.currentStep = CurrentStep.STEP_3_PROGRESS;
          state.medicines.status = StateStatus.SUCCESS;
          state.medicines.error = null;
          state.medicines.data = action.payload.model.map((item) => {
            return {...item, answer: null} as IGetDiseaseMedicineMappingTransactionModel
          })
        }
      })
      .addCase(handleGetDiseaseMedicineMapping.rejected, (state, action) => {
        state.currentStep = CurrentStep.ERROR;
        state.medicines.status = StateStatus.FAILED;
        state.medicines.data = [];
        state.medicines.error = action.payload || "Something went wrong!";
      })      
      .addCase(handleCreateUserMedicineEntry.pending, (state) => {
        // reset all states
        state.currentStep = CurrentStep.STEP_3_PROGRESS;
      })
      .addCase(handleCreateUserMedicineEntry.fulfilled, (state, action) => {
        if (action.payload.model === true) {
          state.currentStep = CurrentStep.STEP_3_COMPLETE;
        }
      })
      .addCase(handleCreateUserMedicineEntry.rejected, (state) => {
        state.currentStep = CurrentStep.ERROR;
      })  
  },
});

// action ==> to set using dispatch hook
export const handleGetDiseaseSymptomMapping = createAsyncThunk(
  "steps/getDiseaseSymptomMapping",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDiseaseSymptomMapping();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const handleCreateUserDiseaseEntry = createAsyncThunk(
  "steps/createUserDiseaseEntry",
  async ({userId, diseaseId, transactionId} : {userId: number, diseaseId: number, transactionId: string}, { rejectWithValue }) => {
    try {
        const input: ICreateUserDiseaseEntryInputModel = {
            userId: userId,
            diseaseId: diseaseId,
            transactionId: transactionId,
        }
      const data = await createUserDiseaseEntry(input);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const handleGetQuestions = createAsyncThunk(
  "steps/getQuestions",
  async (transactionId : string, { rejectWithValue }) => {
    try {
        const input: IGetQuestionsInputModel = {
            transactionId: transactionId
        }
      const data = await getQuestions(input);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const handleCreateUserQuestionEntry = createAsyncThunk(
  "steps/createUserQuestionEntry",
  async (rawInput: any, { rejectWithValue }) => {
    try {

        const input: ICreateUserQuestionEntryInputModel[] = rawInput.data.map((item)=>{
            return {
                userId:rawInput.userId,
                questionId: item.id,
                answer: item.answer ?? "NA",
                transactionId: rawInput.transactionId, 
            }  as ICreateUserQuestionEntryInputModel
        });
      const data = await createUserQuestionEntry(input);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const handleGetDiseaseMedicineMapping = createAsyncThunk(
  "steps/getDiseaseMedicineMapping",
  async ({diseaseId, transactionId}:{diseaseId : number, transactionId : string}, { rejectWithValue }) => {
    try {
        const input: IGetDiseaseMedicineMappingInputModel = {
          diseaseId: diseaseId,
          transactionId: transactionId
        }
      const data = await getDiseaseMedicineMapping(input);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const handleCreateUserMedicineEntry = createAsyncThunk(
  "steps/createUserMedicineEntry",
  async (rawInput: any, { rejectWithValue }) => {
    try {

        const input: ICreateUserMedicineEntryInputModel[] = rawInput.data.map((item)=>{
            return {
                userId:rawInput.userId,
                medicineId: item.medicineId,
                transactionId: rawInput.transactionId, 
            }  as ICreateUserMedicineEntryInputModel
        });
      const data = await createUserMedicineEntry(input);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


// state ==> to get using selector hook
export const stepsReducerCurrentStep = (state) =>
  state.stepsReducer.currentStep;

export const stepsReducerDiseaseSymptomMappingStatus = (state) =>
  state.stepsReducer.diseaseSymptomMapping.status;
export const stepsReducerDiseaseSymptomMappingData = (state) =>
  state.stepsReducer.diseaseSymptomMapping.data;
export const stepsReducerDiseaseSymptomMappingError = (state) =>
  state.stepsReducer.diseaseSymptomMapping.error;

export const stepsReducerSelectedDiseaseSymptomMappingStatus = (state) =>
  state.stepsReducer.selectedDiseaseSymptomMapping.status;
export const stepsReducerSelectedDiseaseSymptomMappingData = (state) =>
  state.stepsReducer.selectedDiseaseSymptomMapping.data;
export const stepsReducerSelectedDiseaseSymptomMappingError = (state) =>
  state.stepsReducer.selectedDiseaseSymptomMapping.error;

export const stepsReducerQuestionsStatus = (state) =>
  state.stepsReducer.questions.status;
export const stepsReducerQuestionsData = (state) =>
  state.stepsReducer.questions.data;
export const stepsReducerQuestionsError = (state) =>
  state.stepsReducer.questions.error;

export const stepsReducerMedicinesStatus = (state) =>
  state.stepsReducer.medicines.status;
export const stepsReducerMedicinesData = (state) =>
  state.stepsReducer.medicines.data;
export const stepsReducerMedicinesError = (state) =>
  state.stepsReducer.medicines.error;

export default stepsSlice.reducer;
