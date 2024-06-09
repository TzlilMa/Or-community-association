// src/components/Documents.js
import React from 'react';
import '../styles/Documents.css';

const Documents = () => {
  return (
    <div className="documents-container">
      <h1>מסמכים</h1>
      <section>
        <h2>מיצוי זכויות</h2>
        <ul>
          <li><a href="https://www.btl.gov.il/benefits/Vocational_Rehabilitation/Vocational_Rehabilitation_disabeld/Pages/default.aspx" target="_blank" rel="noopener noreferrer">שיקום לאנשים עם מוגבלות לפי חוק נכות כללית</a></li>
          <li><a href="https://www.kolzchut.org.il/he/%D7%94%D7%A0%D7%97%D7%94_%D7%91%D7%A2%D7%9E%D7%9C%D7%95%D7%AA_%D7%94%D7%91%D7%A0%D7%A7%D7%99%D7%9D_%D7%9C%D7%A0%D7%9B%D7%99%D7%9D" target="_blank" rel="noopener noreferrer">הנחה בעמלות הבנקים לנכים</a></li>
          <li><a href="https://www.kolzchut.org.il/he/%D7%A0%D7%A7%D7%95%D7%93%D7%95%D7%AA_%D7%96%D7%99%D7%9B%D7%95%D7%99_%D7%9E%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9C%D7%9E%D7%99_%D7%A9%D7%9E%D7%A4%D7%A8%D7%A0%D7%A1%D7%99%D7%9D_%D7%90%D7%AA_%D7%91%D7%A0%D7%99_%D7%96%D7%95%D7%92%D7%9D" target="_blank" rel="noopener noreferrer">נקודות זיכוי ממס הכנסה למי שמפרנסים את בני זוגם</a></li>
          <li><a href="https://www.kolzchut.org.il/he/%D7%94%D7%A0%D7%97%D7%94_%D7%91%D7%90%D7%A8%D7%A0%D7%95%D7%A0%D7%94_%D7%9C%D7%A0%D7%9B%D7%99%D7%9D" target="_blank" rel="noopener noreferrer">הנחה בארנונה לנכים</a></li>
          <li><a href="https://www.kolzchut.org.il/he/%D7%94%D7%A0%D7%97%D7%94_%D7%91%D7%AA%D7%97%D7%91%D7%95%D7%A8%D7%94_%D7%94%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%AA_%D7%9C%D7%90%D7%A0%D7%A9%D7%99%D7%9D_%D7%A2%D7%9D_%D7%A0%D7%9B%D7%95%D7%AA" target="_blank" rel="noopener noreferrer">הנחה בתחבורה הציבורית לאנשים עם נכות</a></li>

        </ul>
      </section>
      <section>
        <h2>רפואי</h2>
        <ul>
          <li><a href="https://meroshu.com/" target="_blank" rel="noopener noreferrer">מידע על שיקום לאחר פגיעה מוחית</a></li>
        </ul>
      </section>
      <section>
        <h2>תעסוקה</h2>
        <ul>
          <li><a href="https://taasukashava.org.il/ " target="_blank" rel="noopener noreferrer">תעסוקה שווה - משרד העבודה</a></li>
        </ul>
      </section>
      <section>
        <h2>אקדמיה</h2>
        <ul>
          <li><a href="https://www.kolzchut.org.il/he/%D7%A9%D7%99%D7%A7%D7%95%D7%9D_%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%D7%99_%D7%95%D7%A1%D7%99%D7%95%D7%A2_%D7%91%D7%9C%D7%99%D7%9E%D7%95%D7%93%D7%99%D7%9D_%D7%9C%D7%90%D7%A0%D7%A9%D7%99%D7%9D_%D7%A2%D7%9D_%D7%A0%D7%9B%D7%95%D7%AA" target="_blank" rel="noopener noreferrer">שיקום מקצועי וסיוע בלימודים לאנשים עם נכות</a></li>
        </ul>
      </section>
      <p className="disclaimer">המידע כללי בלבד ואינו מהווה חוות דעת רפואית או משפטית או תחליף לייעוץ רפואי או משפטי</p>
    </div>
  );
};

export default Documents;
