const animalTags = [
  {
    id: 28,
    text: 'Wymaga dużego mieszkania',
    collectionId: 4,
    conflicts: [29],
  }, //dom, mieszkanie wielopokojowe, szeregowiec
  {
    id: 29,
    text: 'Nie potrzebuje dużego mieszkania',
    collectionId: 4,
    conflicts: [28],
  }, //mieszk jednopokojowe
  { id: 30, text: 'Wymaga ogrodu', collectionId: 4, conflicts: [] },

  {
    id: 26,
    text: 'Może wchodzić po schodach',
    collectionId: 5,
    conflicts: [27],
  },
  {
    id: 27,
    text: 'Nie może wchodzić po schodach',
    collectionId: 5,
    conflicts: [26],
  },

  { id: 1, text: 'Spacerowicz', collectionId: 6, conflicts: [3] },
  { id: 2, text: 'Biegacz', collectionId: 6, conflicts: [3] },
  { id: 3, text: 'Leniuch', collectionId: 6, conflicts: [1, 2] },
  { id: 7, text: 'Energiczny', collectionId: 6, conflicts: [3] },

  { id: 4, text: 'Agresywny', collectionId: 7, conflicts: [5] },
  { id: 5, text: 'Przyjazny', collectionId: 7, conflicts: [4, 19] },
  { id: 19, text: 'Zdystansowany', collectionId: 7, conflicts: [5] },
  { id: 24, text: 'Towarzyski', collectionId: 7, conflicts: [25] },
  { id: 25, text: 'Mało towarzyski', collectionId: 7, conflicts: [24] },

  { id: 6, text: 'Niezależny', collectionId: 8, conflicts: [8] }, //jesli kogos jest malo w domu
  { id: 8, text: 'Źle znosi samotność', collectionId: 8, conflicts: [6] }, //jesli kogos jest malo w domu
  { id: 20, text: 'Wymaga specjalnej opieki', collectionId: 8, conflicts: [] }, // czy jestes w stanie zaoferowac specjalna opieke (behawioralna, zdrowotna itp)

  { id: 9, text: 'Akceptuje dzieci', collectionId: 9, conflicts: [10] },
  { id: 10, text: 'Nie akceptuje dzieci', collectionId: 9, conflicts: [9] },

  { id: 11, text: 'Akceptuje psy', collectionId: 10, conflicts: [12] },
  { id: 12, text: 'Nie akceptuje psów', collectionId: 10, conflicts: [11] },
  { id: 13, text: 'Akceptuje koty', collectionId: 10, conflicts: [14] },
  { id: 14, text: 'Nie akceptuje kotów', collectionId: 10, conflicts: [13] },
  {
    id: 15,
    text: 'Akceptuje inne zwierzęta',
    collectionId: 10,
    conflicts: [31],
  },
  {
    id: 31,
    text: 'Nie akceptuje innych zwierząt',
    collectionId: 10,
    conflicts: [15],
  },

  { id: 16, text: 'Nie boi się hałasu', collectionId: 11, conflicts: [17] },
  { id: 17, text: 'Boi się hałasu', collectionId: 11, conflicts: [16] },
  { id: 18, text: 'Nie chce dotyku', collectionId: 11, conflicts: [] },
  { id: 23, text: 'Z traumą', collectionId: 11, conflicts: [] },

  {
    id: 21,
    text: 'Poszukuje domu tymczasowego',
    collectionId: 12,
    conflicts: [],
  },
  { id: 22, text: 'Poszukuje domu na stałe', collectionId: 12, conflicts: [] },
];

export default animalTags;