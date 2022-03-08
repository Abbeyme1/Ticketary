import React from "react";
import Link from "next/link";
import { Navbar, Container, Nav } from "react-bootstrap";

export default ({ currentUser }) => {
  const links = [
    currentUser && { label: "SignOut", url: "/auth/signout" },
    !currentUser && { label: "SignIn", url: "/auth/signin" },
    !currentUser && { label: "SignUp", url: "/auth/signup" },
  ]
    .filter((links) => links)
    .map(({ label, url }) => (
      <Nav.Link key={label}>
        <Link key={label} href={url}>
          {label}
        </Link>
      </Nav.Link>
    ));

  return (
    <header className="mb-3">
      <Navbar bg="light" variant="light" expand="lg" collapseOnSelect>
        <Container>
          <Link href="/">
            <Navbar.Brand href="/">Ticketary</Navbar.Brand>
          </Link>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            {links}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
