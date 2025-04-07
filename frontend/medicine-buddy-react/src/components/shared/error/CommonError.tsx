import { FC } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router";

type Props = {
  title?: string;
  desc?: string;
  link?: string;
};

const CommonError: FC<Props> = ({
  title = "Page Not Found",
  desc = "404",
  link = "/login",
}) => {
  return (
    <>
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Col className="text-center">
          <Row>
            <h2 className="text-primary mb-4">{title}</h2>
            <h6 className="text-secondary mb-2">{desc}</h6>
            <Link to={link}>
              <Button variant="outline-primary">More info...</Button>
            </Link>
          </Row>
        </Col>
      </Container>
    </>
  );
};

export default CommonError;
