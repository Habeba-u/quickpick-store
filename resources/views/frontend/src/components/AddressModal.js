import React from 'react';
import { Modal, Card, Button, Form, Row, Col } from 'react-bootstrap';

function AddressModal({
  showAddressModal,
  handleAddressModalClose,
  addresses,
  handleSelectAddress,
  showAddAddressForm,
  setShowAddAddressForm,
  newAddress,
  handleNewAddressChange,
  handleAddressTypeChange,
  handleSaveNewAddress,
}) {
  return (
    <Modal show={showAddressModal} onHide={handleAddressModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addresses.length > 0 ? (
          <>
            <h5>Saved Addresses</h5>
            {addresses.map((address) => (
              <Card key={address.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{address.label}</strong>
                      <p>{address.street}, {address.aptNo ? `Apt ${address.aptNo}, ` : ''}{address.floor ? `Floor ${address.floor}` : ''}</p>
                      <p>{address.description}</p>
                    </div>
                    <Button variant="success" onClick={() => handleSelectAddress(address)}>
                      Select
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </>
        ) : (
          <p>No saved addresses found.</p>
        )}
        {!showAddAddressForm && (
          <Button
            variant="outline-success"
            className="mt-3"
            onClick={() => setShowAddAddressForm(true)}
          >
            Add New Address00
          </Button>
        )}
        {showAddAddressForm && (
          <>
            <h5>Add New Address</h5>
            <div className="map-placeholder mb-3"></div>
            <div className="address-type mb-3">
              <Button
                variant={newAddress.type === 'Apartment' ? 'success' : 'outline-success'}
                className="me-2"
                onClick={() => handleAddressTypeChange('Apartment')}
              >
                Apartment
              </Button>
              <Button
                variant={newAddress.type === 'House' ? 'success' : 'outline-success'}
                className="me-2"
                onClick={() => handleAddressTypeChange('House')}
              >
                House
              </Button>
              <Button
                variant={newAddress.type === 'Work' ? 'success' : 'outline-success'}
                className="me-2"
                onClick={() => handleAddressTypeChange('Work')}
              >
                Work
              </Button>
              <Button
                variant={newAddress.type === 'Other' ? 'success' : 'outline-success'}
                onClick={() => handleAddressTypeChange('Other')}
              >
                Other
              </Button>
            </div>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Label *</Form.Label>
                <Form.Control
                  type="text"
                  name="label"
                  value={newAddress.label}
                  onChange={handleNewAddressChange}
                  placeholder="e.g., Home"
                  required
                />
              </Form.Group>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Apt No.</Form.Label>
                    <Form.Control
                      type="text"
                      name="aptNo"
                      value={newAddress.aptNo}
                      onChange={handleNewAddressChange}
                      placeholder="Apartment Number"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Floor</Form.Label>
                    <Form.Control
                      type="text"
                      name="floor"
                      value={newAddress.floor}
                      onChange={handleNewAddressChange}
                      placeholder="Floor Number"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Street *</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleNewAddressChange}
                  placeholder="Street Name"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={newAddress.description}
                  onChange={handleNewAddressChange}
                  placeholder="Additional details"
                />
              </Form.Group>
            </Form>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleAddressModalClose}>
          Close
        </Button>
        {showAddAddressForm && (
          <Button variant="success" onClick={handleSaveNewAddress}>
            Save Address
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AddressModal;