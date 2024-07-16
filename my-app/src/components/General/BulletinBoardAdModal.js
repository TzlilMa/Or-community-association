import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../fireBase/firebase'; // Adjust the import path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/BulletinBoardAdModal.css'; // Importing the new CSS

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
      <div className="BulletinBoardAdModal-modal-content">
        <h2>הוסף מודעה ללוח מודעות</h2>
        <hr className="BulletinBoardAdModal-underline" />
        <Form>
          <Form.Group controlId="formAdText">
            <Form.Label className="BulletinBoardAdModal-label">מודעה:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={adText}
              onChange={(e) => setAdText(e.target.value)}
              className="BulletinBoardAdModal-textarea"
            />
          </Form.Group>
          <Form.Group controlId="formDaysToPresent">
            <Form.Label className="BulletinBoardAdModal-label">מספר ימים להצגה:</Form.Label>
            <Form.Control
              as="select"
              value={daysToPresent}
              onChange={(e) => setDaysToPresent(Number(e.target.value))}
              className="BulletinBoardAdModal-input"
            >
              {[...Array(7).keys()].map((day) => (
                <option key={day + 1} value={day + 1}>
                  {day + 1}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
        <div className="BulletinBoardAdModal-buttons">
          <Button variant="secondary" onClick={handleClose} className="BulletinBoardAdModal-cancel-button">
            ביטול
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="BulletinBoardAdModal-submit-button">
            אישור
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BulletinBoardAdModal;
