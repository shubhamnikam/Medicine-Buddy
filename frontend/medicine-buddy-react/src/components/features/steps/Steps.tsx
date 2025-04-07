import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useSelector } from "react-redux";
import { stepsReducerCurrentStep } from "../../../core/stores/slices/stepsSlice";
import { CurrentStep } from "../../../core/stores/currentStep";
import { useNavigate } from "react-router";

const Steps = () => {
  const navigate = useNavigate();
  const currentStepState = useSelector(stepsReducerCurrentStep);

  return (
    <>
      {(currentStepState === CurrentStep.ERROR ||
        currentStepState === CurrentStep.STEP_3_COMPLETE) &&
        navigate("/main/home")}
      {(currentStepState === CurrentStep.INIT ||
        currentStepState === CurrentStep.STEP_1_PROGRESS) && <Step1 />}
      {(currentStepState === CurrentStep.STEP_1_COMPLETE ||
        currentStepState === CurrentStep.STEP_2_PROGRESS) && <Step2 />}
      {(currentStepState === CurrentStep.STEP_2_COMPLETE ||
        currentStepState === CurrentStep.STEP_3_PROGRESS) && <Step3 />}
    </>
  );
};

export default Steps;
