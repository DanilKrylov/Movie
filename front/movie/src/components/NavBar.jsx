import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Context } from '..'

export const NavBar = observer(() => {
  const { userSession } = useContext(Context);
  console.log(userSession.user)

  const logout = () => {
    userSession.setIsAuth(false)
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>IMoview</Navbar.Brand>
          {!userSession.isAuth ? (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/reg">Register</Nav.Link>
            </Nav>) : (
            <Nav className="me-auto">
              <Nav.Link as={Link} onClick={logout} to="/login">Logout</Nav.Link>
            </Nav>
          )}
        
        {userSession.isAuth && <div>{userSession.user?.login}</div>}
      </Container>
    </Navbar>
  )
})
