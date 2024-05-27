import React from 'react';
import ImageSlider from './ImageSlider'; // Import the ImageSlider component
import TextMarquee from './TextMarquee'; // Import the TextMarquee component
import '../styles/Homepage.css'; // Import the CSS file for styling the homepage content

const ContentLayout = () => {
  return (
    <div className="homepage-content">
      <div className="left-side">
        <TextMarquee text={`"קהילת אור" מאגדת אנשים שעברו פגיעה מוחית במהלך ולאחר תוכנית השיקום
מטרתה הקהילה- ליצור קהילת עמיתים, שתסייע לחבריה להשתלב במעגל המשפחתי, חברתי והתעסוקתי.
מטרת קבוצת הפייסבוק- להוות מרחב לשיתוף מידע מקצועי ומידע המבוסס על ניסיון אישי: לרבות זכויות סוציאליות ותעסוקה, שיתוף בהליך השיקום ומתן ייעוץ ותמיכה.
אם אתם אנשים שעברו פגיעה מוחית או מתנדבים שרוצים לסייע לקהילת אור, ברוכים הבאים לקהילה!
לעיתים חיינו מורכבים, אך לפחות נתמודד בקשיים אלו יחדיו.
"לעיתים צריכים רק אור קטן בשביל לעשות שינוי גדול"`} />
      </div>
      <div className="right-side">
        <ImageSlider /> {/* Add the ImageSlider component */}
      </div>
    </div>
  );
};

export default ContentLayout;
