import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import {
  authReducerLoginStateData,
  authReducerLogoutStateData,
  authReducerLogoutStateStatus,
  handleLogout,
} from "../../../core/stores/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../core/stores";
import { useEffect } from "react";
import { StateStatus } from "../../../core/stores/stateStatus";
import MedicineBuddyLogo from "./../../../assets/medicine_buddy_logo.png";

const NavbarLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loginStateData = useSelector(authReducerLoginStateData);
  const logoutStateStatus = useSelector(authReducerLogoutStateStatus);
  const logoutStateData = useSelector(authReducerLogoutStateData);

  const handlerLogoutUser = () => {
    dispatch(handleLogout(loginStateData.userName));
  };

  useEffect(() => {
    if (logoutStateStatus === StateStatus.SUCCESS && logoutStateData === true) {
      navigate("/auth/login");
    }
  }, [logoutStateData, logoutStateStatus, navigate]);

  return loginStateData.isAuthenticated ? (
    <div className="navbar-bottom-padding">
      <Navbar fixed="top" className="custom-nav-bg-main">
        <Container fluid className="d-flex align-items-center">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/main/home" className="text-light fw-bold d-flex align-items-center gap-2">
            <img
              src={MedicineBuddyLogo} // Replace this with the actual logo path
              alt="Medicine Buddy Logo"
              width="32"
              height="32"
              className="d-inline-block align-top"
            />
            Medicine-Buddy
          </Navbar.Brand>

          {/* Right Side Nav Links & Dropdown */}
          <Nav className="ms-auto d-flex align-items-center">
            <NavLink
              to="/main/home"
              className={({ isActive }) =>
                isActive ? "active-link me-4" : "inactive-link me-4"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/main/history"
              className={({ isActive }) =>
                isActive ? "active-link me-4" : "inactive-link me-4"
              }
            >
              History
            </NavLink>
            <NavLink
              to="/main/profile"
              className={({ isActive }) =>
                isActive ? "active-link me-4" : "inactive-link me-4"
              }
            >
              Profile
            </NavLink>

            {/* User Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="warning" size="sm">
                <FaUser className="me-1" />
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item>
                  <FaUser className="me-2" />
                  {loginStateData.userName}
                </Dropdown.Item>
                <Dropdown.Item onClick={handlerLogoutUser} className="fw-bold">
                  <FaSignOutAlt className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
    </div>
  ) : null;
};

export default NavbarLayout;
