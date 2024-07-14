import React, { useEffect, useState, useRef } from "react";
import { db, doc, getDoc, collection, query, where, getDocs } from "../fireBase/firebase";
import BulletinBoard from "../components/NotificationComponent/BulletinBoard";
import ImageSlider from "../components/NotificationComponent/ImageSlider";
import Management from "../components/Management/Management";
import InstagramPhotos from "../components/InstagramPhotos";
import StoryCarousel from "../components/StoryCarousel";
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
          userId: doc.data().userId,
          name: `${doc.data().firstName} ${doc.data().lastName}`,
          story: doc.data().personalStory,
        }));
        console.log("Fetched stories:", storyData);
        setStories(storyData);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchUserData();
    fetchStories();
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
          <div className="homepage-main-content">
          <div ref={(el) => (sectionRefs.current[0] = el)} className="homepage-section homepage-gradient-background-1">
            <div className="homepage-content-container">
              <div className="homepage-component-container">
                <BulletinBoard showEditButtons={showEditButtons} />
              </div>
                <InstagramPhotos />
            </div>
          </div>

          <div ref={(el) => (sectionRefs.current[1] = el)} className="homepage-section homepage-gradient-background-2">
            <Management isAdmin={showEditButtons} />
          </div>

          <div ref={(el) => (sectionRefs.current[2] = el)} className="homepage-section homepage-gradient-background-3">
            <ImageSlider />
          </div>

          <div ref={(el) => (sectionRefs.current[3] = el)} className="homepage-section homepage-gradient-background-4">
            <StoryCarousel stories={stories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
