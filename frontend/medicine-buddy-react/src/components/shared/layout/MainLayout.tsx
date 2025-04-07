import { FC } from "react";
import { Container } from "react-bootstrap";
import NavbarLayout from "./NavbarLayout";
import { Outlet, useNavigate } from "react-router";
import { isUserAuthenticated } from "../../../core/services/auth.service";

const MainLayout: FC = () => {
  const isAuthenticated = isUserAuthenticated();
  const navigate = useNavigate();
  return (
    <>
      {isAuthenticated ? (
        <Container>
          <header>
            <NavbarLayout />
          </header>
          <section>
            <Outlet />
          </section>
        </Container>
      ) : (
        navigate("/auth/login")
      )}
    </>
  );
};

export default MainLayout;
