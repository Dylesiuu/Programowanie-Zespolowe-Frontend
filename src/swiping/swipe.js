// src/app/swipe.js
export function fetchAnimals() {
    return fetch('https://api.example.com/animals')
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching animals:', error);
        return [];
      });
  }