import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/BorderHeader.css';

function BorderHeader() {
  return (
      <div>
        <hr className="border-header" />
      </div>
  );
}

export default BorderHeader;