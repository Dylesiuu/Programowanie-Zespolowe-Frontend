const tags = [
  // Warunki mieszkaniowe
  {
    id: 1,
    text: 'Dom',
    collectionId: 1,
    conflicts: [2, 3, 4],
    animalTraits: [28],
  },
  {
    id: 2,
    text: 'Mieszkanie wielopokojowe',
    collectionId: 1,
    conflicts: [1, 3, 4],
    animalTraits: [28],
  },
  {
    id: 3,
    text: 'Mieszkanie jednopokojowe',
    collectionId: 1,
    conflicts: [1, 2, 4],
    animalTraits: [29],
  },
  {
    id: 4,
    text: 'Dom szeregowy',
    collectionId: 1,
    conflicts: [1, 2, 3],
    animalTraits: [28],
  },
  { id: 5, text: 'Ogród', collectionId: 1, conflicts: [], animalTraits: [30] },
  { id: 6, text: 'Balkon', collectionId: 1, conflicts: [], animalTraits: [] },

  {
    id: 7,
    text: 'Schody',
    collectionId: 2,
    conflicts: [44],
    animalTraits: [26],
  },
  {
    id: 45,
    text: 'Winda',
    collectionId: 2,
    conflicts: [44],
    animalTraits: [27],
  },
  {
    id: 44,
    text: 'Brak schodów i windy',
    collectionId: 2,
    conflicts: [7, 45],
    animalTraits: [26, 27],
  },

  // Aktywnosci
  {
    id: 8,
    text: 'Jestem bardzo aktywny',
    collectionId: 3,
    conflicts: [46],
    animalTraits: [1, 2, 7],
  },
  {
    id: 46,
    text: 'Nie uprawiam sportów',
    collectionId: 3,
    conflicts: [8],
    animalTraits: [1, 3],
  },
  {
    id: 9,
    text: 'Lubię spacery',
    collectionId: 3,
    conflicts: [],
    animalTraits: [1, 7],
  },

  // Charakter zwierzaka i twoj
  {
    id: 10,
    text: 'Towarzyski',
    collectionId: 4,
    conflicts: [11],
    animalTraits: [24, 5, 19, 16],
  },
  {
    id: 11,
    text: 'Introwertyczny',
    collectionId: 4,
    conflicts: [10],
    animalTraits: [25, 5, 4, 19, 16, 17],
  },

  //Czas poswiecobt zwierzeciu i
  {
    id: 12,
    text: 'Jestem w stanie zapewnic specjalna opiekę',
    collectionId: 5,
    conflicts: [],
    animalTraits: [20, 18, 23],
  },
  {
    id: 13,
    text: 'Często podróżuję',
    collectionId: 5,
    conflicts: [14, 16],
    animalTraits: [6, 18, 23],
  },
  {
    id: 14,
    text: 'Większość dnia spędzam w domu',
    collectionId: 5,
    conflicts: [13, 15, 16],
    animalTraits: [6, 18, 23, 8],
  },
  {
    id: 15,
    text: 'Większość dnia spędzam poza domem',
    collectionId: 5,
    conflicts: [14, 16],
    animalTraits: [6, 18, 23],
  },
  {
    id: 16,
    text: 'Zrównoważony czas między domem a wyjściami',
    collectionId: 5,
    conflicts: [14, 15, 13],
    animalTraits: [6, 18, 23],
  },
  //
  // dzieci
  {
    id: 20,
    text: 'Dzieci poniżej 13 roku życia',
    collectionId: 6,
    conflicts: [22],
    animalTraits: [9],
  },
  {
    id: 21,
    text: 'Dzieci powyżej 13 roku życia',
    collectionId: 6,
    conflicts: [22],
    animalTraits: [9, 10],
  },
  {
    id: 22,
    text: 'Brak dzieci',
    collectionId: 6,
    conflicts: [20, 22],
    animalTraits: [9, 10],
  },
  // Inne zwierzęta
  {
    id: 23,
    text: 'Mam psa',
    collectionId: 7,
    conflicts: [25],
    animalTraits: [11, 15, 14],
  },
  {
    id: 24,
    text: 'Mam kota',
    collectionId: 7,
    conflicts: [25],
    animalTraits: [13, 12, 15],
  },
  {
    id: 25,
    text: 'Nie mam zwierząt',
    collectionId: 7,
    conflicts: [23, 24, 26],
    animalTraits: [11, 13, 12, 14, 15, 31],
  },
  {
    id: 26,
    text: 'Mam inne zwierzę',
    collectionId: 7,
    conflicts: [25],
    animalTraits: [11, 13, 12, 14, 15],
  },

  //OTOCZENIE
  {
    id: 18,
    text: 'Moje otoczenie jest głośne, hałaśliwe',
    collectionId: 8,
    conflicts: [19],
    animalTraits: [16],
  },
  {
    id: 19,
    text: 'Moje otoczenie jest ciche, spokojne',
    collectionId: 8,
    conflicts: [18],
    animalTraits: [17, 16, 23, 18],
  },
];

export default tags;
