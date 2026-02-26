export const MOCK_CONTACT_PHOTO_FALLBACK = '/mock-people/person-1.svg';

const PHOTO_IDS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];

const MOCK_PHOTOS = PHOTO_IDS.map((id) => `https://i.pravatar.cc/200?img=${id}`);

export const getMockContactPhoto = (contactId?: string): string => {
  if (!contactId) return MOCK_PHOTOS[0];

  const hash = Array.from(contactId).reduce(
    (acc, char, index) => acc + char.charCodeAt(0) * (index + 1),
    0
  );

  return MOCK_PHOTOS[Math.abs(hash) % MOCK_PHOTOS.length];
};

