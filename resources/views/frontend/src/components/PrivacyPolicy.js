import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/PrivacyPolicy.css'; // Custom styles

function PrivacyPolicy() {
  return (
    <div className="privacy-page">

      {/* Main Content */}
      <Container className="py-5">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-welcome">
          Welcome to QuickPick – your trusted online grocery platform in Egypt.
          <br />
          QuickPick values your privacy and protects your personal information in accordance with Egyptian data protection practices.
        </p>

        {/* Accordion for Privacy Sections */}
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Data Collected</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>Contact Information (Name, address, phone, email)</li>
                <li>Order and transaction details</li>
                <li>Usage data (through cookies and analytics tools)</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Use of Data</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>To process and deliver your orders</li>
                <li>To improve website performance and service</li>
                <li>To send updates or promotional offers (with your consent)</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Data Sharing</Accordion.Header>
            <Accordion.Body>
              We do not sell your data. We may share it only with:
              <ul>
                <li>Delivery providers</li>
                <li>Payment processors</li>
                <li>Government authorities, when required by Egyptian law</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Your Rights</Accordion.Header>
            <Accordion.Body>
              You have the right to:
              <ul>
                <li>Access, update, or request deletion of your personal data</li>
                <li>Contact us at support@quickpick.com for support</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>Data Protection</Accordion.Header>
            <Accordion.Body>
              We use encryption and secure servers to protect your information.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>

    </div>
  );
}

export default PrivacyPolicy;