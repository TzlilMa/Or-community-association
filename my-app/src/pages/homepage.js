import React, { useEffect, useState } from "react";
import { db, doc, getDoc } from "../fireBase/firebase";
import BulletinBoard from "../components/NotificationComponent/BulletinBoard";
import ImageSlider from "../components/NotificationComponent/ImageSlider";
import Management from "../components/Management/Management"; // Correct import statement
import { useAuth } from "../fireBase/AuthContext";
import "../styles/Homepage.css";
import "../styles/ImageSlider.css";

const Homepage = () => {
  const { currentUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [showEditButtons, setShowEditButtons] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser || !currentUser.email) {
          console.error("Email is not provided.");
          return;
        }

        console.log("Fetching user data for email:", currentUser.email);

        const userDoc = await getDoc(doc(db, "users", currentUser.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data:", userData);
          setFirstName(userData.firstName);
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

  return (
    <div className="App">
      <div className="homepage">
        <div className="main-content">
          <h1>"לעיתים צריכים רק אור קטן בשביל לעשות שינוי גדול"</h1>
          <div className="content-container">
            <div className="bulletin-board-container">
              <BulletinBoard showEditButtons={showEditButtons} />
            </div>
            <div className="image-slider-container">
              <ImageSlider />
            </div>
          </div>
          <div className="management-container">
            <Management isAdmin={showEditButtons} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
