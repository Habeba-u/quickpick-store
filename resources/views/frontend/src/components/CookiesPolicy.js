import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CookiesPolicy.css'; // Custom styles

function CookiesPolicy() {
  return (
    <div className="cookies-page">


      {/* Main Content */}
      <Container className="py-5">
        <h1 className="cookies-title">Cookies Policy</h1>
        <p className="cookies-welcome">
          Welcome to QuickPick – your trusted online grocery platform in Egypt.
          <br />
          QuickPick uses cookies to enhance your experience on our website.
        </p>

        {/* Accordion for Cookies Sections */}
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>What Are Cookies?</Accordion.Header>
            <Accordion.Body>
              Cookies are small files saved to your device to store preferences and enable functionality.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Why We Use Them</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>Essential site functionality (e.g., Google Analytics)</li>
                <li>Personalized marketing and offers (if enabled)</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Managing Cookies</Accordion.Header>
            <Accordion.Body>
              You can adjust cookie settings in your browser. Disabling cookies may affect how the website functions.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Consent</Accordion.Header>
            <Accordion.Body>
              By using our website, you agree to our use of cookies as described.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </div>
  );
}

export default CookiesPolicy;