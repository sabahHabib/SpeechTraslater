import React from 'react';
import { Container,Row, Col } from "react-bootstrap";
import AudioRecoder from './services/AudioRecoder';
import TextToSpeech from './services/TextRecoder';
import NavbarPage from './pages/Navbar'
import './App.css';

function App() {
  return (
     <>
     <NavbarPage/>
      <Container>
      <Row className="mt-5">
        <Col lg={6} md={12}>
          <AudioRecoder />
        </Col>
        <Col lg={6} md={12}>
          <TextToSpeech />
        </Col>
      </Row>
    </Container>
</>
  );
}

export default App;
