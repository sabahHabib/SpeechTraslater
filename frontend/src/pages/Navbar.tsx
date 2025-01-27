import React from 'react'

import { Container, Navbar} from "react-bootstrap";


const NavbarPage:React.FC=()=>{
    return(
         <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Speech to Text & Text to Speech App</Navbar.Brand>
        </Container>
      </Navbar>
      );
 }

export default NavbarPage