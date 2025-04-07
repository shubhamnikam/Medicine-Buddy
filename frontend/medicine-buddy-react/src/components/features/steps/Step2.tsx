import { Alert, Badge, Card, Form, Button } from "react-bootstrap";
import {
  handleCreateUserQuestionEntry,
  handleGetQuestions,
  stepsReducerQuestionsData,
  stepsReducerQuestionsError,
  stepsReducerQuestionsStatus,
  stepsReducerSelectedDiseaseSymptomMappingData,
  stepsReducerSelectedDiseaseSymptomMappingStatus,
} from "../../../core/stores/slices/stepsSlice";
import { IGetQuestionsTransactionModel } from "../../../core/models/transaction/IGetQuestionsTransactionModel";
import { AppDispatch } from "../../../core/stores";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { StateStatus } from "../../../core/stores/stateStatus";
import { authReducerLoginStateData } from "../../../core/stores/slices/authSlice";
import { ICreateUserDiseaseEntryOutputModel } from "../../../core/models/output/ICreateUserDiseaseEntryOutputModel";

const Step2 = () => {
  const authLoginStateData = useSelector(authReducerLoginStateData);
  const stepsSelectedDiseaseSymptomMappingStatus = useSelector(
    stepsReducerSelectedDiseaseSymptomMappingStatus
  );

  const stepsSelectedDiseaseSymptomMappingData: ICreateUserDiseaseEntryOutputModel =
    useSelector(stepsReducerSelectedDiseaseSymptomMappingData);

  const stepsQuestionsStatus = useSelector(stepsReducerQuestionsStatus);
  const stepsQuestionsData: IGetQuestionsTransactionModel[] = useSelector(
    stepsReducerQuestionsData
  );
  const stepsQuestionsError = useSelector(stepsReducerQuestionsError);

  const [formData, setFormData] = useState(stepsQuestionsData);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (formData?.length == 0 && stepsQuestionsData.length > 0) {
      setFormData(stepsQuestionsData);
    }
  }, [dispatch, formData, stepsQuestionsData]);

  useEffect(() => {
    if (stepsSelectedDiseaseSymptomMappingStatus === StateStatus.SUCCESS) {
      const transactionId =
        stepsSelectedDiseaseSymptomMappingData.transactionId;
      dispatch(handleGetQuestions(transactionId));
    }
  }, [
    dispatch,
    stepsSelectedDiseaseSymptomMappingData.transactionId,
    stepsSelectedDiseaseSymptomMappingStatus,
    stepsSelectedDiseaseSymptomMappingStatus.transactionId,
  ]);

  const handleOnChangeAnswer = (e, questionId, answerText) => {
    e.preventDefault();
    setFormData((prevState) => {
      return prevState.map((item) =>
        item.id === questionId ? { ...item, answer: answerText } : item
      );
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const rawInput = {
      userId: authLoginStateData.userId,
      transactionId: stepsSelectedDiseaseSymptomMappingData.transactionId,
      data: formData,
    };
    dispatch(handleCreateUserQuestionEntry(rawInput));
  };

  return (
    <>
      {stepsQuestionsStatus === StateStatus.LOADING ? (
        <h2>Loading...</h2>
      ) : null}
      {stepsQuestionsStatus === StateStatus.FAILED
        ? alert(`${stepsQuestionsError} => Navigating to home...`)
        : null}
      {stepsQuestionsStatus === StateStatus.SUCCESS ? (
        <div className="container mt-4">
          <Alert variant="primary" className="text-center">
            2️⃣{" "}
            <Badge pill bg="primary">
              Respond:
            </Badge>{" "}
            Answer a few quick health-related questions.
          </Alert>
          <Form onSubmit={handleOnSubmit}>
            {formData.map((question) => (
              <Card key={question.id} className="shadow-lg mb-3">
                <Card.Body>
                  <Card.Title>{question.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {question.description}
                  </Card.Text>
                  <Form.Group>
                    <Form.Label>Your Answer:</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.answer ?? ""}
                      onChange={(e) =>
                        handleOnChangeAnswer(e, question.id, e.target.value)
                      }
                      placeholder="Type your answer here..."
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            ))}
            <Button type="submit" variant="success" size="lg" className="w-100">
              Submit Responses
            </Button>
          </Form>
        </div>
      ) : null}
    </>
  );
};

export default Step2;
