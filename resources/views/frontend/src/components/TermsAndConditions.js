import { Container, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/TermsAndConditions.css'; // Custom styles

function TermsAndConditions() {
  return (
    <div className="terms-page">

      {/* Main Content */}
      <Container className="py-5">
        <h1 className="terms-title">Terms and Conditions</h1>
        <p className="terms-welcome">
          Welcome to QuickPick – your trusted online grocery platform in Egypt.
          <br />
          By using our website (<a href="http://www.quickpick.com">www.quickpick.com</a>), you agree to comply with these Terms and Conditions.
          If you do not accept the Terms and Conditions stated here, please refrain from using our website.
        </p>

        {/* Accordion for Terms Sections */}
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>About QuickPick</Accordion.Header>
            <Accordion.Body>
              QuickPick is an Egyptian online platform that delivers groceries and daily essentials directly to customers.
              We do not use third-party sellers. All products are offered by QuickPick.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Eligibility</Accordion.Header>
            <Accordion.Body>
              You must be at least 18 years old and legally competent under Egyptian law to use our website.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>User Account</Accordion.Header>
            <Accordion.Body>
              When registering, you must provide accurate and complete information.
              You are responsible for all activities under your account.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Pricing and Payment</Accordion.Header>
            <Accordion.Body>
              Prices are listed in Egyptian Pounds (EGP) and include applicable taxes. Payment must be made securely through the provided options (e.g., credit card, mobile wallets, or cash on delivery if available).
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>Delivery</Accordion.Header>
            <Accordion.Body>
              We deliver to selected locations within Egypt.
              Delivery times are estimated and may vary due to unforeseen circumstances.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="5">
            <Accordion.Header>Cancellations & Returns</Accordion.Header>
            <Accordion.Body>
              You may cancel or return an order in accordance with Egyptian Consumer Protection Law.
              Refunds are processed based on product condition and time of return request.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="6">
            <Accordion.Header>Intellectual Property</Accordion.Header>
            <Accordion.Body>
              All website content (logos, designs, data, etc.) is owned by QuickPick and protected under Egyptian intellectual property laws.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="7">
            <Accordion.Header>Liability Limitation</Accordion.Header>
            <Accordion.Body>
              QuickPick is not liable for indirect damages resulting from delays, product availability, or technical issues beyond our control.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="8">
            <Accordion.Header>Governing Law</Accordion.Header>
            <Accordion.Body>
              These Terms are governed by the laws of the Arab Republic of Egypt, and disputes shall be settled in Egyptian courts.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="9">
            <Accordion.Header>Updates to Terms</Accordion.Header>
            <Accordion.Body>
              We may modify these Terms at any time, and updates are effective immediately upon posting.
              Updated versions will be posted on this page.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </div>
  );
}

export default TermsAndConditions;