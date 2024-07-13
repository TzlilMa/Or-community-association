import React, { useEffect, useState } from "react";
import { db, doc, getDoc, collection, query, where, getDocs } from "../fireBase/firebase";
import BulletinBoard from "../components/NotificationComponent/BulletinBoard";
import ImageSlider from "../components/NotificationComponent/ImageSlider";
import Management from "../components/Management/Management";
import InstagramPhotos from "../components/InstagramPhotos";
import StoryCarousel from "../components/StoryCarousel"; // Ensure this import is correct
import { useAuth } from "../fireBase/AuthContext";
import "../styles/Homepage.css";
import "../styles/BulletinBoard.css";
import "../styles/ImageSlider.css";
import "../styles/InstagramPhotos.css";
import "../styles/StoryCarousel.css";
import "../styles/storyCard.css";

const Homepage = () => {
  const { currentUser } = useAuth();
  const [showEditButtons, setShowEditButtons] = useState(false);
  const [stories, setStories] = useState([]);

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
          console.error("User document does not exist for email:", currentUser.email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchStories = async () => {
      try {
        const q = query(collection(db, "users"), where("isStoryPublic", "==", true));
        const querySnapshot = await getDocs(q);
        const storyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          userId: doc.data().userId, // Ensure userId is included
          name: `${doc.data().firstName} ${doc.data().lastName}`,
          story: doc.data().personalStory,
        }));
        console.log("Fetched stories:", storyData); // Add this line to check fetched stories
        setStories(storyData);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchUserData();
    fetchStories();
  }, [currentUser]);

  return (
    <div className="App">
      <div className="homepage">
        <div className="homepage-main-content">
          <h1>"לעיתים צריכים רק אור קטן בשביל לעשות שינוי גדול"</h1>

          <div className="homepage-section homepage-gradient-background-1">
            <div className="homepage-content-container">
              <div className="homepage-component-container">
                <BulletinBoard showEditButtons={showEditButtons} />
              </div>
              <div className="homepage-component-container">
                <InstagramPhotos />
              </div>
            </div>
          </div>

          <div className="homepage-section homepage-gradient-background-2">
            <div className="homepage-content-container">
              <div className="homepage-component-container">
                <Management isAdmin={showEditButtons} />
              </div>
              <div className="homepage-component-container">
                <ImageSlider />
              </div>
            </div>
          </div>
          
          <div className="homepage-story-carousel-container">
            <StoryCarousel stories={stories} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Homepage;
