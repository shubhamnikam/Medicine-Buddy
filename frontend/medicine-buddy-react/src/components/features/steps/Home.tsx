import { FC } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";

const Home:FC = () => {
    const navigate = useNavigate();
    const handleStartDiagnosis = () => {
        navigate("/main/steps")
      };
    
      return (
        <Card className="shadow p-4 mt-4 rounded-4 custom-card-bg-main">
          <Card.Body>
            <Card.Title className="mb-3 fs-4 fw-bold">
              ✨ Get a quick diagnosis for symptoms in 3 simple steps!
            </Card.Title>
    
            <div className="mb-3">
              <Badge pill bg="warning" className="mx-1">
                Identify
              </Badge>
              <p className="mt-2 mb-4">
                Describe your symptoms clearly. Our system helps you identify potential issues based on what you're experiencing.
              </p>
    
              <Badge pill bg="primary" className="mx-1">
                Respond
              </Badge>
              <p className="mt-2 mb-4">
                Answer a few follow-up questions to refine your diagnosis. These responses help us provide a more accurate result.
              </p>
    
              <Badge pill bg="danger" className="mx-1">
                Receive
              </Badge>
              <p className="mt-2 mb-4">
                Instantly receive a possible diagnosis with next steps or suggestions on what to do next, including doctor visit recommendations if needed.
              </p>
            </div>
    
            <div className="text-center">
              <Button variant="outline-success" size="lg" onClick={handleStartDiagnosis}>
                Start Diagnosis
              </Button>
            </div>
          </Card.Body>
        </Card>
      );
    };
    

export default Home;