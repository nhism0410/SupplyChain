import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import Identicon from "identicon.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../SiteNavbar/navbar.css";
import logo from "../images/logo.png"; // Adjust the path as needed

const SiteNavbar = ({ onViewChange, account }) => {
  return (
    <Navbar className="custom-navbar" expand="lg">
      <Navbar.Brand href="#home" onClick={() => onViewChange("home")}>
        <img src={logo} alt="Logo" style={{ height: "120px" }} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home" onClick={() => onViewChange("home")}>
            <i class="ri-home-heart-fill"></i>Home
          </Nav.Link>
          <Nav.Link
            href="#addProduct"
            onClick={() => onViewChange("addProduct")}
          >
            <i class="ri-function-add-fill"></i>
            Add Product
          </Nav.Link>
          <Nav.Link
            href="#productList"
            onClick={() => onViewChange("productList")}
          >
            <i class="ri-list-view"></i>
            Product List
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Nav.Item className="d-flex align-items-center ml-2">
        {account && (
          <>
            <img
              className="ml-2"
              width="40"
              height="40"
              src={`data:image/png;base64,${new Identicon(
                account,
                40
              ).toString()}`}
              alt="profile"
            />
            <span className="ml-2">{`${account.slice(0, 6)}...${account.slice(
              -4
            )}`}</span>
          </>
        )}
      </Nav.Item>
    </Navbar>
  );
};

export default SiteNavbar;
