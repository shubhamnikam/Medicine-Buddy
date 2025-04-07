import { Alert, Badge, ListGroup, Button } from "react-bootstrap";
import { authReducerLoginStateData } from "../../../core/stores/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleCreateUserMedicineEntry, handleGetDiseaseMedicineMapping, stepsReducerCurrentStep, stepsReducerMedicinesData, stepsReducerMedicinesError, stepsReducerMedicinesStatus, stepsReducerQuestionsStatus, stepsReducerSelectedDiseaseSymptomMappingData, stepsReducerSelectedDiseaseSymptomMappingStatus } from "../../../core/stores/slices/stepsSlice";
import { ICreateUserDiseaseEntryOutputModel } from "../../../core/models/output/ICreateUserDiseaseEntryOutputModel";
import { IGetDiseaseMedicineMappingTransactionModel } from "../../../core/models/transaction/IGetDiseaseMedicineMappingTransactionModel";
import { AppDispatch } from "../../../core/stores";
import { useEffect } from "react";
import { StateStatus } from "../../../core/stores/stateStatus";
import { CurrentStep } from "../../../core/stores/currentStep";
import { useNavigate } from "react-router";

const Step3 = () => {
  const currentStep = useSelector(stepsReducerCurrentStep);
  const navigate = useNavigate();
  const authLoginStateData = useSelector(authReducerLoginStateData);
  const stepsSelectedDiseaseSymptomMappingStatus = useSelector(
    stepsReducerSelectedDiseaseSymptomMappingStatus
  );

  const stepsSelectedDiseaseSymptomMappingData: ICreateUserDiseaseEntryOutputModel =
    useSelector(stepsReducerSelectedDiseaseSymptomMappingData);

  const stepsQuestionsStatus = useSelector(stepsReducerQuestionsStatus);
  const stepsMedicinesStatus = useSelector(stepsReducerMedicinesStatus);
  const stepsMedicinesData: IGetDiseaseMedicineMappingTransactionModel[] = useSelector(stepsReducerMedicinesData);
  const stepsMedicinesError = useSelector(stepsReducerMedicinesError);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (stepsSelectedDiseaseSymptomMappingStatus === StateStatus.SUCCESS 
      && stepsQuestionsStatus === StateStatus.SUCCESS) {
      const diseaseId = stepsSelectedDiseaseSymptomMappingData.diseaseId;
      const transactionId = stepsSelectedDiseaseSymptomMappingData.transactionId;
      dispatch(handleGetDiseaseMedicineMapping({diseaseId, transactionId}));
    }
  }, [dispatch, stepsQuestionsStatus, stepsSelectedDiseaseSymptomMappingData.diseaseId, stepsSelectedDiseaseSymptomMappingData.transactionId, stepsSelectedDiseaseSymptomMappingStatus, stepsSelectedDiseaseSymptomMappingStatus.transactionId]);

  useEffect(() => {
    if(currentStep === CurrentStep.STEP_3_COMPLETE){
      navigate("/main/home")
    }
  }, [currentStep, navigate])

  const handleSaveAndGotoHome = (e) => {
    e.preventDefault();
    const rawInput = {
      userId: authLoginStateData.userId,
      transactionId: stepsSelectedDiseaseSymptomMappingData.transactionId,
      data: stepsMedicinesData,
    };
    dispatch(handleCreateUserMedicineEntry(rawInput));
  };
  return (
    <>
      {stepsMedicinesStatus === StateStatus.LOADING ? (
        <h2>Loading...</h2>
      ) : null}
      {stepsMedicinesStatus === StateStatus.FAILED
        ? alert(`${stepsMedicinesError} => Navigating to home...`)
        : null}
      {stepsMedicinesStatus === StateStatus.SUCCESS ? (
        <div className="container mt-4">
        <Alert variant="success" className="text-center">
          3️⃣ <Badge pill bg="success">Receive:</Badge> Instantly get a general prescription tailored to your inputs.
        </Alert>
        <ListGroup>
          {stepsMedicinesData.map((medicine) => (
            <ListGroup.Item key={medicine.medicineId}>
              <strong>{medicine.medicineId}</strong>: <strong>{medicine.medicineTitle}</strong> - {medicine.medicineDescription}
            </ListGroup.Item>
          ))}
        </ListGroup>
    
        <div className="d-flex flex-wrap mt-3 gap-2">
          <Button variant="success" onClick={handleSaveAndGotoHome}>Noted. Go to Home Page</Button>
          <Button variant="warning" onClick={() => alert('work in progress...')}>Feedback & Contact Us</Button>
          <Button variant="outline-primary" disabled>
            NOTE: Please consult with your doctors if symptoms persist more than 2-3 days
          </Button>
        </div>
      </div>
      ) : null}
    </>
  );
};

export default Step3;
