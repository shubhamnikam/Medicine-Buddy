import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { authReducerLoginStateData, authReducerLoginStateError, authReducerLoginStateStatus, handleAuthenticate } from "../../../core/stores/slices/authSlice";
import { AppDispatch } from "../../../core/stores";
import { StateStatus } from "../../../core/stores/stateStatus";
import { useNavigate } from "react-router";
import { isUserAuthenticated } from "../../../core/services/auth.service";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(authReducerLoginStateStatus);
  const data = useSelector(authReducerLoginStateData);
  const error = useSelector(authReducerLoginStateError);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (formData.username && formData.password) {
        dispatch(handleAuthenticate(formData))
    }
  };

  useEffect(()=> {
    if(status === StateStatus.SUCCESS && data.isAuthenticated){
		navigate('/main/home')
	} else if (status === StateStatus.FAILED && !isUserAuthenticated()) (
        console.error("Login failed", error)
	)
  }, [status, data])

  return (
    <Container className="h-100">
      {!data?.isAuthenticated && (
        <Row className="align-items-center h-100">
          <Col md={6} className="mx-auto">
            <Card className="my-5">
              <Card.Header className="text-center text-dark font-weight-bold">
                Medicine Buddy
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleLoginSubmit}>
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleChange}
                      isInvalid={!formData.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      Username is required
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!formData.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      Password is required
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between mt-4">
                    <Button type="submit" className="col-6" variant="primary" disabled={status === StateStatus.LOADING}>
                      {status === StateStatus.LOADING ? <Spinner animation="border" size="sm" /> : "Login"}
                    </Button>
                    <Button className="col-5" variant="outline-secondary">
                      Register
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Login;
