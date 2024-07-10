// src/components/InstagramPhotos.js
import React, { useEffect, useState } from 'react';
import { fetchInstagramPhotos } from '../instagramService';
import '../styles/InstagramPhotos.css';

const InstagramPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const photos = await fetchInstagramPhotos();
        setPhotos(photos);
      } catch (error) {
        console.error('Error fetching photos', error);
      }
    };

    getPhotos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (photos.length > 0 ? (prevIndex + 1) % photos.length : 0));
    }, 9000); // Change photo every 3 seconds

    return () => clearInterval(interval);
  }, [photos]);

  if (photos.length === 0) {
    return <div>Loading...</div>;
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="instagram-photos">
      <div className="photo">
        <a href={currentPhoto.permalink} target="_blank" rel="noopener noreferrer">
          <img src={currentPhoto.media_url} alt={currentPhoto.caption || 'Instagram photo'} />
        </a>
        {currentPhoto.caption && <div className="caption">{currentPhoto.caption}</div>}
      </div>
    </div>
  );
};

export default InstagramPhotos;
