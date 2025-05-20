const mockUser = {
  id: 1,
  name: 'Anna',
  lastname: 'Nowak',
  email: 'anna.nowak@example.com',
  avatar: '/img/profile.png',
  city: 'Warszawa',
  about:
    'Jestem miłośniczką zwierząt od dziecka. Obecnie opiekuję się dwoma kotami, ale chętnie pomogę też innym zwierzakom w potrzebie. Pracuję zdalnie, więc mam dużo czasu dla moich pupili.',
  tags: [
    { id: 2, text: 'Mieszkanie wielopokojowe', collectionId: 1 },
    { id: 6, text: 'Balkon', collectionId: 1 },
    { id: 45, text: 'Winda', collectionId: 2 },
    { id: 9, text: 'Lubię spacery', collectionId: 3 },
    { id: 10, text: 'Towarzyski', collectionId: 4 },
    { id: 14, text: 'Większość dnia spędzam w domu', collectionId: 5 },
    { id: 22, text: 'Brak dzieci', collectionId: 6 },
    { id: 24, text: 'Mam kota', collectionId: 7 },
    { id: 19, text: 'Moje otoczenie jest ciche, spokojne', collectionId: 8 },
  ],
  preferences: {
    animalType: ['Koty', 'Małe psy'],
    locationRadius: 50,
  },
};

export default mockUser;
