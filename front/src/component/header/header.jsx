import React from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import MyImage from "../../assets/images/logo.png";
import "./header.css";

function Header() {
  return (
    <div className="Header">
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">
            <img className="image-logo" src={MyImage} alt="" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <NavLink
                exact={true}
                className="link"
                activeClassName="is-active"
                to="/"
              >
                Home
              </NavLink>
              <NavLink className="link" activeClassName="is-active" to="/alarm">
                Alarm
              </NavLink>
            </Nav>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <img className="image-avatar" src={MyImage} alt="" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className="brop-men" href="#/action-1">
                  Blabla
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="brop-men" href="#/action-2">
                  Abla
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="brop-men" href="#/action-3">
                  Disconnect
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
