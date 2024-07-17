import React, { useState, useEffect } from 'react';
import { auth, db, collection, getDocs, addDoc, deleteDoc, query, where } from '../fireBase/firebase';
import '../styles/Documents.css';
import Notification from './General/Notification';
import documentImage from '../assets/document_pic.png';
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import BulletinBoardAdModal from './General/BulletinBoardAdModal';

const Documents = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newLinkText, setNewLinkText] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [linkToRemove, setLinkToRemove] = useState({ subject: '', link: '' });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showAdModal, setShowAdModal] = useState(false);
  const [defaultAdText, setDefaultAdText] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUserAndLinks = async () => {
      const user = auth.currentUser;
      if (user) {
        const userQuerySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
        if (!userQuerySnapshot.empty) {
          const userData = userQuerySnapshot.docs[0].data();
          setIsAdmin(userData.isAdmin || false);
        }
      }
      fetchLinks();
    };

    fetchUserAndLinks();

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchLinks(); // Fetch links whenever the auth state changes
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchLinks = async () => {
    try {
      const linksSnapshot = await getDocs(collection(db, 'links'));
      const linksData = {};
      linksSnapshot.forEach(doc => {
        const { name, link, subject } = doc.data();
        if (!linksData[subject]) {
          linksData[subject] = [];
        }
        linksData[subject].push({ text: name, url: link });
      });
      setData(linksData);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching links: ", error);
    }
  };

  const checkUrl = (url) => {
    if (!url) return 'empty';
    if (!(url.startsWith('https://') || url.startsWith('http://'))) return 'invalid';
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(url) ? 'valid' : 'invalid';
  };

  const handleAddLink = async () => {
    console.log("handleAddLink called");
    console.log("newLinkUrl:", newLinkUrl);
    console.log("newLinkText:", newLinkText);
    console.log("selectedSubject:", selectedSubject);
    console.log("newSubject:", newSubject);

    const urlCheck = checkUrl(newLinkUrl);

    if (urlCheck === 'empty' || !newLinkText || (!selectedSubject && !newSubject) || urlCheck === 'empty') {
      setNotification({ message: 'יש למלא את כל השדות', type: 'error' });
      return;
    }

    if (urlCheck === 'invalid') {
      setNotification({ message: 'יש להזין כתובת URL חוקית', type: 'error' });
      return;
    }

    const subject = selectedSubject || newSubject;
    try {
      await addDoc(collection(db, 'links'), {
        name: newLinkText,
        link: newLinkUrl,
        subject: subject
      });
      console.log("Link added successfully");
      fetchLinks();
      setShowModal(false);
      setNewSubject('');
      setNewLinkText('');
      setNewLinkUrl('');
      setSelectedSubject('');
      setNotification({ message: 'הקישור נוסף בהצלחה!', type: 'success' });
      setDefaultAdText(`מסמך חדש בנושא ${subject} נוסף! בקרו בטפסים ומידע לפרטים.`);
      setShowAdModal(true);
    } catch (error) {
      console.error("Error adding link: ", error);
    }
  };

  const handleRemoveLink = async () => {
    const { subject, link } = linkToRemove;
    if (!subject || !link) {
      setNotification({ message: 'יש למלא את כל השדות', type: 'error' });
      return;
    }

    try {
      const linksQuery = query(collection(db, 'links'), where('link', '==', link), where('subject', '==', subject));
      const linksSnapshot = await getDocs(linksQuery);
      linksSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      fetchLinks();
      setShowRemoveModal(false);
      setLinkToRemove({ subject: '', link: '' });
      setNotification({ message: 'הקישור הוסר בהצלחה!', type: 'success' });
    } catch (error) {
      console.error("Error removing link: ", error);
    }
  };

  return (
    <div className="documents-page">
      <img src={documentImage} alt="Document" className="documents-image" />
      <div className="documents-container">
        <h1>טפסים ומידע</h1>
        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" role="status">
            </Spinner>
          </div>
        ) : (
          Object.entries(data).map(([subject, links]) => (
            <section key={subject}>
              <h2>{subject}</h2>
              <ul>
                {links.map((link, index) => (
                  <li key={index}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a></li>
                ))}
              </ul>
            </section>
          ))
        )}
        {isAdmin && (
          <div>
            <button className="add-document-button" onClick={() => setShowModal(true)}>הוספת קישור</button>
            <button className="remove-document-button" onClick={() => setShowRemoveModal(true)}>הסרת קישור</button>
            {showModal && (
              <>
                <div className="document-modal-overlay" onClick={() => setShowModal(false)}></div>
                <div className="document-modal show">
                  <h2>הוספת קישור חדש</h2>
                  <label>
                    <input type="radio" checked={!isAddingNewSubject} onChange={() => setIsAddingNewSubject(false)} />
                    הוספה לנושא קיים
                  </label>
                  <label>
                    <input type="radio" checked={isAddingNewSubject} onChange={() => setIsAddingNewSubject(true)} />
                    יצירת נושא חדש
                  </label>
                  {!isAddingNewSubject && (
                    <label>
                      בחר נושא:
                      <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                        <option value="">בחר נושא</option>
                        {Object.keys(data).map((subject) => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  {isAddingNewSubject && (
                    <label>
                      נושא חדש:
                      <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
                    </label>
                  )}
                  <label>
                    טקסט קישור:
                    <input type="text" value={newLinkText} onChange={(e) => setNewLinkText(e.target.value)} />
                  </label>
                  <label>
                    URL קישור:
                    <input type="text" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} />
                  </label>
                  <button className="confirm-button" onClick={handleAddLink}>הוספה</button>
                  <button className="cancel-button" onClick={() => {
                    setShowModal(false);
                    setNewSubject('');
                    setNewLinkText('');
                    setNewLinkUrl('');
                    setSelectedSubject('');
                    setNotification({ message: '', type: '' }); // Clear any existing notification
                  }}>ביטול</button>
                </div>
              </>
            )}
            {showRemoveModal && (
              <>
                <div className="document-modal-overlay" onClick={() => setShowRemoveModal(false)}></div>
                <div className="document-modal show">
                  <h2>הסרת קישור</h2>
                  <label>
                    בחר נושא:
                    <select value={linkToRemove.subject} onChange={(e) => setLinkToRemove({ ...linkToRemove, subject: e.target.value })}>
                      <option value="">בחר נושא</option>
                      {Object.keys(data).map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    בחר קישור:
                    <select value={linkToRemove.link} onChange={(e) => setLinkToRemove({ ...linkToRemove, link: e.target.value })}>
                      <option value="">בחר קישור</option>
                      {linkToRemove.subject && data[linkToRemove.subject].map((link, index) => (
                        <option key={index} value={link.url}>{link.text}</option>
                      ))}
                    </select>
                  </label>
                  <button className="confirm-button" onClick={handleRemoveLink}>הסר</button>
                  <button className="cancel-button" onClick={() => setShowRemoveModal(false)}>ביטול</button>
                </div>
              </>
            )}
          </div>
        )}
        <p className="disclaimer">המידע כללי בלבד ואינו מהווה חוות דעת רפואית או משפטית או תחליף לייעוץ רפואי או משפטי</p>
        {notification.message && (
          <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
        )}
        <BulletinBoardAdModal
          show={showAdModal}
          handleClose={() => setShowAdModal(false)}
          defaultAdText={defaultAdText}
      />
      </div>
    </div>
  );
};

export default Documents;
