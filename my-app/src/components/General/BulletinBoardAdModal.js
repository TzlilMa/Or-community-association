import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../fireBase/firebase'; // Adjust the import path as needed
import 'bootstrap/dist/css/bootstrap.min.css';

const BulletinBoardAdModal = ({ show, handleClose, defaultAdText }) => {
  const [adText, setAdText] = useState('');
  const [daysToPresent, setDaysToPresent] = useState(1);

  useEffect(() => {
    if (defaultAdText) {
      setAdText(defaultAdText);
    }
  }, [defaultAdText]);

  const handleSubmit = async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate.setDate(currentDate.getDate() + daysToPresent));

    try {
      await addDoc(collection(db, 'bulletinBoard'), {
        text: adText,
        timestamp: Timestamp.fromDate(timestamp),
      });
      handleClose();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>הוסף מודעה ללוח מודעות</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formAdText">
            <Form.Label>מודעה:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={adText}
              onChange={(e) => setAdText(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDaysToPresent">
            <Form.Label>מספר ימים להצגה:</Form.Label>
            <Form.Control
              as="select"
              value={daysToPresent}
              onChange={(e) => setDaysToPresent(Number(e.target.value))}
            >
              {[...Array(7).keys()].map((day) => (
                <option key={day + 1} value={day + 1}>
                  {day + 1}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          ביטול
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          אישור
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BulletinBoardAdModal;
