// src/components/Documents.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../fireBase/firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';
import '../styles/Documents.css';

const initialData = {
  'מיצוי זכויות': [
    { text: 'שיקום לאנשים עם מוגבלות לפי חוק נכות כללית', url: 'https://www.btl.gov.il/benefits/Vocational_Rehabilitation/Vocational_Rehabilitation_disabeld/Pages/default.aspx' },
    { text: 'הנחה בעמלות הבנקים לנכים', url: 'https://www.kolzchut.org.il/he/%D7%94%D7%A0%D7%97%D7%94_%D7%91%D7%A2%D7%9E%D7%9C%D7%95%D7%AA_%D7%94%D7%91%D7%A0%D7%A7%D7%99%D7%9D_%D7%9C%D7%A0%D7%9B%D7%99%D7%9D' },
    { text: 'נקודות זיכוי ממס הכנסה למי שמפרנסים את בני זוגם', url: 'https://www.kolzchut.org.il/he/%D7%A0%D7%A7%D7%95%D7%93%D7%95%D7%AA_%D7%96%D7%99%D7%9B%D7%95%D7%99_%D7%9E%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9C%D7%9E%D7%99_%D7%A9%D7%9E%D7%A4%D7%A8%D7%A0%D7%A1%D7%99%D7%9D_%D7%90%D7%AA_%D7%91%D7%A0%D7%99_%D7%96%D7%95%D7%92%D7%9D' },
    { text: 'הנחה בארנונה לנכים', url: 'https://www.kolzchut.org.il/he/%D7%94%D7%A0%D7%97%D7%94_%D7%91%D7%90%D7%A8%D7%A0%D7%95%D7%A0%D7%94_%D7%9C%D7%A0%D7%9B%D7%99%D7%9D' },
    { text: 'הנחה בתחבורה הציבורית לאנשים עם נכות', url: 'https://www.kolzchut.org.il/he/%D7%94%D7%A0%D7%97%D7%94_%D7%91%D7%AA%D7%97%D7%91%D7%95%D7%A8%D7%94_%D7%94%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%AA_%D7%9C%D7%90%D7%A0%D7%A9%D7%99%D7%9D_%D7%A2%D7%9D_%D7%A0%D7%9B%D7%95%D7%AA' },
  ],
  'רפואי': [
    { text: 'מידע על שיקום לאחר פגיעה מוחית', url: 'https://meroshu.com/' },
  ],
  'תעסוקה': [
    { text: 'תעסוקה שווה - משרד העבודה', url: 'https://taasukashava.org.il/' },
  ],
  'אקדמיה': [
    { text: 'שיקום מקצועי וסיוע בלימודים לאנשים עם נכות', url: 'https://www.kolzchut.org.il/he/%D7%A9%D7%99%D7%A7%D7%95%D7%9D_%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%D7%99_%D7%95%D7%A1%D7%99%D7%95%D7%A2_%D7%91%D7%9C%D7%99%D7%9E%D7%95%D7%93%D7%99%D7%9D_%D7%9C%D7%90%D7%A0%D7%A9%D7%99%D7%9D_%D7%A2%D7%9D_%D7%A0%D7%9B%D7%95%D7%AA' },
  ],
};

const Documents = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newLinkText, setNewLinkText] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [linkToRemove, setLinkToRemove] = useState({ subject: '', link: '' });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userQuerySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
        if (!userQuerySnapshot.empty) {
          const userData = userQuerySnapshot.docs[0].data();
          setIsAdmin(userData.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddLink = () => {
    if (!newLinkUrl || !newLinkText || (!selectedSubject && !newSubject)) {
      alert("All fields are required.");
      return;
    }

    if (Object.values(data).flat().some(link => link.url === newLinkUrl)) {
      alert("Link already exists!");
      return;
    }

    const subject = selectedSubject || newSubject;
    const updatedData = { ...data };

    if (!updatedData[subject]) {
      updatedData[subject] = [];
    }

    updatedData[subject].push({ text: newLinkText, url: newLinkUrl });
    setData(updatedData);
    setShowModal(false);
    setNewSubject('');
    setNewLinkText('');
    setNewLinkUrl('');
    setSelectedSubject('');
  };

  const handleRemoveLink = () => {
    const { subject, link } = linkToRemove;
    if (!subject || !link) {
      alert("All fields are required.");
      return;
    }

    const updatedData = { ...data };
    const filteredLinks = updatedData[subject].filter(item => item.url !== link);
    if (filteredLinks.length === 0) {
      delete updatedData[subject];
    } else {
      updatedData[subject] = filteredLinks;
    }
    setData(updatedData);
    setShowRemoveModal(false);
    setLinkToRemove({ subject: '', link: '' });
  };

  return (
    <div className="documents-container">
      <h1>מסמכים</h1>
      {Object.entries(data).map(([subject, links]) => (
        <section key={subject}>
          <h2>{subject}</h2>
          <ul>
            {links.map((link, index) => (
              <li key={index}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a></li>
            ))}
          </ul>
        </section>
      ))}
      {isAdmin && (
        <div>
          <button className="add-link-button" onClick={() => setShowModal(true)}>הוספת קישור</button>
          <button className="remove-link-button" onClick={() => setShowRemoveModal(true)}>הסרת קישור</button>
          {showModal && (
            <>
              <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
              <div className="modal">
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
                <button onClick={handleAddLink}>שלח</button>
                <button onClick={() => setShowModal(false)}>ביטול</button>
              </div>
            </>
          )}
          {showRemoveModal && (
            <>
              <div className="modal-overlay" onClick={() => setShowRemoveModal(false)}></div>
              <div className="modal">
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
                <button onClick={handleRemoveLink}>הסר</button>
                <button onClick={() => setShowRemoveModal(false)}>ביטול</button>
              </div>
            </>
          )}
        </div>
      )}
      <p className="disclaimer">המידע כללי בלבד ואינו מהווה חוות דעת רפואית או משפטית או תחליף לייעוץ רפואי או משפטי</p>
    </div>
  );
};

export default Documents;
