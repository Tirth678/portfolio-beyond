/** Capture dates and times are displayed exactly as supplied, without guessing a year or timezone. */
export type Shot = {
  src: string;
  alt: string;
  date: string;
  time: string;
};

export const shots: Shot[] = [
  { src: '/images/shots/1.jpeg', alt: 'Cloudy sky framed by palms and trees', date: '29 August', time: '1:25 pm' },
  { src: '/images/shots/2.jpeg', alt: 'Buildings and greenery beneath a blue sky', date: '29 August', time: '4:42 pm' },
  { src: '/images/shots/3.jpeg', alt: 'Sunlight through clouds above a line of trees', date: '30 August', time: '11:44 pm' },
  { src: '/images/shots/4.jpeg', alt: 'Clouds over trees and a distant city', date: '30 August', time: '6:24 pm' },
  { src: '/images/shots/5.jpeg', alt: 'Pink evening sky over the city', date: '31 August', time: '7:12 pm' },
  { src: '/images/shots/6.jpeg', alt: 'A tree-lined road beneath an overcast sky', date: '3 September', time: '9:13 am' },
  { src: '/images/shots/7.jpeg', alt: 'Bright clouds above a road and trees', date: '3 September', time: '11:46 am' },
  { src: '/images/shots/8.jpeg', alt: 'Sunlight breaking through clouds in a blue sky', date: '3 September', time: '11:52 am' },
  { src: '/images/shots/9.jpeg', alt: 'Blue sky and clouds framed by leafy trees', date: '7 September', time: '1:08 pm' },
  { src: '/images/shots/10.jpeg', alt: 'Traffic and streetlights under an evening sky', date: '10 September', time: '7:08 pm' },
  { src: '/images/shots/11.jpeg', alt: 'Sun rays emerging from behind a cloud', date: '21 September', time: '12:57 pm' },
  { src: '/images/shots/12.jpeg', alt: 'A soft sunset over the city skyline', date: '27 September', time: '6:32 pm' },
];
