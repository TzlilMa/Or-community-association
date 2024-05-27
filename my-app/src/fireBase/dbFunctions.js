// src/dbFunctions.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import path as needed

/**
 * Fetches the user data from the 'users' collection based on the provided email.
 *
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<Object|null>} - A promise that resolves to the user data object if found, otherwise null.
 * @throws {Error} - If the email is invalid or if an error occurs while fetching the user data.
 */
export const getUserDetails = async (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email provided');
  }

  try {
    const userDocRef = doc(db, 'users', email);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.error('User document does not exist.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
