import React, { useEffect, useState, useRef } from "react";
import {
  db,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "../fireBase/firebase";
import BulletinBoard from "../components/NotificationComponent/BulletinBoard";
import InstagramPhotos from "../components/InstagramPhotos";
import Management from "../components/Management/Management";
import { useAuth } from "../fireBase/AuthContext";
import "../styles/Homepage.css";
import "../styles/BulletinBoard.css";
import "../styles/InstagramPhotos.css";

const Homepage = () => {
  const { currentUser } = useAuth();
  const [showEditButtons, setShowEditButtons] = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser || !currentUser.email) {
          console.error("Email is not provided.");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setShowEditButtons(userData.isAdmin);
        } else {
          console.error(
            "User document does not exist for email:",
            currentUser.email
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="App">
      <div className="homepage">
        <div className="title-container">
          <h1>"לעיתים צריכים רק אור קטן בשביל לעשות שינוי גדול"</h1>
        </div>
        <div className="blue-background"></div>
        <div className="homepage-content-container">
          <div className="homepage-card-BulletinBoard">
            <BulletinBoard showEditButtons={showEditButtons} />
          </div>
          <div className="homepage-card-instegram">
            <InstagramPhotos />
          </div>
        </div>
        <div
          ref={(el) => (sectionRefs.current[0] = el)}
          className="homepage-section homepage-gradient-background-1 manager-section"
        >
          <div className="homepage-content-container">
            <Management isAdmin={showEditButtons} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
