import { FC, useEffect } from "react";
import { Card, Alert, Badge, Row, Col, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
    handleCreateUserDiseaseEntry,
  handleGetDiseaseSymptomMapping,
  stepsReducerDiseaseSymptomMappingData,
  stepsReducerDiseaseSymptomMappingError,
  stepsReducerDiseaseSymptomMappingStatus,
} from "../../../core/stores/slices/stepsSlice";
import { StateStatus } from "../../../core/stores/stateStatus";
import { AppDispatch } from "../../../core/stores";
import { IGetDiseaseSymptomMappingTransactionModel } from "../../../core/models/transaction/IGetDiseaseSymptomMappingTransactionModel";
import { authReducerLoginStateData } from "../../../core/stores/slices/authSlice";

const Step1: FC = () => {
  const authLoginStateData = useSelector(
    authReducerLoginStateData
  );
  const stepsDiseaseSymptomMappingStatus = useSelector(
    stepsReducerDiseaseSymptomMappingStatus
  );
  const stepsDiseaseSymptomMappingData: IGetDiseaseSymptomMappingTransactionModel[] = useSelector(
    stepsReducerDiseaseSymptomMappingData
  );
  const stepsDiseaseSymptomMappingError = useSelector(
    stepsReducerDiseaseSymptomMappingError
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(handleGetDiseaseSymptomMapping());
  }, [dispatch]);

  const handleOnClick = (diseaseId: number, transactionId: string) => { 
    const userId = authLoginStateData.userId;
    alert(userId);
    alert(transactionId);
    
    dispatch(handleCreateUserDiseaseEntry({userId, diseaseId, transactionId}));
  }

  return (
    <>
      {stepsDiseaseSymptomMappingStatus === StateStatus.LOADING ? (
        <h2>Loading...</h2>
      ) : null}
      {stepsDiseaseSymptomMappingStatus === StateStatus.FAILED ? (
        alert(`${stepsDiseaseSymptomMappingError} => Navigating to home...`)
      ) : null}
      {stepsDiseaseSymptomMappingStatus === StateStatus.SUCCESS ? (
        <div className="container mt-4">
          <Alert variant="warning" className="text-center">
            1️⃣{" "}
            <Badge pill bg="warning">
              Identify:
            </Badge>{" "}
            Select a possible condition based on your symptoms.
          </Alert>
          
          <Row>
            {stepsDiseaseSymptomMappingData?.map((disease) => (
              <Col md={4} key={disease.diseaseId} className="mb-3">
                <Card
                  className="shadow-lg h-100"
                  onClick={() =>
                    handleOnClick(disease.diseaseId, disease.transactionId)
                  }
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-primary">
                      {disease.diseaseTitle}
                    </Card.Title>
                    <Card.Text className="flex-grow-1">
                      {disease.diseaseDescription}
                    </Card.Text>
                    <ListGroup variant="flush">
                      {disease?.symptoms.map((symptom) => (
                        <ListGroup.Item key={symptom.symptomId}>
                          <Badge bg="info" className="me-2">
                            {symptom.symptomId}
                          </Badge>
                          {symptom.symptomTitle} - {symptom.symptomDescription}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : null}
    </>
  );
};

export default Step1;
