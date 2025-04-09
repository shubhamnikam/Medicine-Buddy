import { FC, useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Form } from "react-router";

const Register:FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        passwordEncrypted: "",
        age: "",
        height: "",
        weight: "",
      } as any);
    
      const [errors, setErrors] = useState({});
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [successMessage, setSuccessMessage] = useState("");
      const [errorMessage, setErrorMessage] = useState("");
    
      const validate = () => {
        const newErrors = {} as any;
        if (!formData.firstName || formData.firstName.length < 2)
          newErrors.firstName = "First Name must be at least 2 characters.";
        if (!formData.lastName || formData.lastName.length < 2)
          newErrors.lastName = "Last Name must be at least 2 characters.";
        if (!formData.passwordEncrypted || formData.passwordEncrypted.length < 6)
          newErrors.passwordEncrypted = "Password must be at least 6 characters.";
        if (!formData.age || formData.age < 1 || formData.age > 150)
          newErrors.age = "Age must be between 1 and 150.";
        if (!formData.height || formData.height < 30 || formData.height > 250)
          newErrors.height = "Height must be between 30 and 250 cm.";
        if (!formData.weight || formData.weight < 10 || formData.weight > 300)
          newErrors.weight = "Weight must be between 10 and 300 kg.";
    
        return newErrors;
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        const validationErrors = validate();
    
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
    
        setIsSubmitting(true);
        setErrors({});
        try {
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
    
          const result = await res.json();
    
          if (res.ok) {
            setSuccessMessage(`Registration Success for Username: ${result.model}`);
            setFormData({
              firstName: "",
              lastName: "",
              passwordEncrypted: "",
              age: "",
              height: "",
              weight: "",
            });
          } else {
            setErrorMessage("Registration failed. Please try again.");
          }
        } catch (error) {
          setErrorMessage("Something went wrong.");
        } finally {
          setIsSubmitting(false);
        }
      };
    
      const handleGoToLogin = () => {
        window.location.href = "/auth";
      };
    
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <Card className="shadow-lg">
                <Card.Body>
                  <h3 className="text-center text-primary">Register</h3>
                  <Form onSubmit={handleSubmit}>
                    {["firstName", "lastName", "passwordEncrypted", "age", "height", "weight"].map((field) => (
                      <Form.Group className="mb-3" key={field}>
                        <Form.Label>
                          {field === "passwordEncrypted"
                            ? "Password"
                            : field.charAt(0).toUpperCase() + field.slice(1)}
                        </Form.Label>
                        <Form.Control
                          type={field === "passwordEncrypted" ? "password" : field === "age" || field === "height" || field === "weight" ? "number" : "text"}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          isInvalid={!!errors[field]}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors[field]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    ))}
    
                    <div className="d-flex justify-content-between">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-50 me-1"
                        disabled={isSubmitting}
                      >
                        {!isSubmitting ? "Register" : <span className="spinner-border spinner-border-sm" />}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        className="w-50"
                        disabled={isSubmitting}
                        onClick={handleGoToLogin}
                      >
                        {!isSubmitting ? "Go to Login" : <span className="spinner-border spinner-border-sm" />}
                      </Button>
                    </div>
    
                    {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      );
}

export default Register;