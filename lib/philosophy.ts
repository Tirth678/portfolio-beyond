/** Images are kept in the order supplied for the Philosophy chapter. */
export const philosophyImages = [
  { width: 1014, height: 518, alt: 'A reflection on the night sky and inner peace.' },
  { width: 996, height: 591, alt: 'A poem beginning “You’re the sky I wanna stay beneath forever.”' },
  { width: 1179, height: 1175, alt: 'A reflection on emotion and peace over a photograph of the sky.' },
  { width: 1179, height: 2017, alt: 'A reflection titled The dilemma over clouds in a blue sky.' },
  { width: 1179, height: 2061, alt: 'A poem about a storm within, over an image of a figure between clouds and stars.' },
  { width: 1179, height: 2064, alt: 'A reflection about becoming the person philosophy tried to make you, over sunset clouds.' },
  { width: 1179, height: 2001, alt: 'A poem beginning “My heart is in a place, where it will never be found.”' },
  { width: 627, height: 758, alt: 'A poem about learning to apologise and forgive.' },
  { width: 1179, height: 955, alt: 'A reflection on life, chaos and peace, dated 15 May 2025.' },
  { width: 1179, height: 2043, alt: 'A reflection on perception and the mind, over a streetlight in the dark.' },
  { width: 1179, height: 2091, alt: 'A poem about feeling broken, over a photograph of a car in a forest.' },
  { width: 1179, height: 2072, alt: 'A poem about love and keeping someone safe, over a photograph of a journal and flowers.' },
  { width: 1179, height: 2055, alt: 'Reflections on character and inner strength, over a star-filled landscape.' },
  { width: 1179, height: 2039, alt: 'A poem about the night and hope for something brighter, over a photograph of a lamp.' },
  { width: 1179, height: 2036, alt: 'A poem about the night, solitude and peace, over a star-filled landscape.' },
].map((image, index) => ({ ...image, src: `/images/philosophy/${index + 1}.jpeg` }));
