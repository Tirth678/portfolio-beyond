/**
 * Add photographs here after placing them under public/images (or by using an
 * existing local image URL). Record the date and time as supplied, rather than
 * guessing a capture time or timezone.
 */
export type Shot = {
  src: string;
  alt: string;
  date: string;
  time: string;
};

export const shots: Shot[] = [];
