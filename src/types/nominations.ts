export interface Nomination {
  id: string;
  description: string | null;
  isWinner: boolean;
  category: string;
  categoryName?: string | null;
  movie: {
    id: string;
    poster: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    tagline: string | null;
    backdrop: string | null;
    letterboxd: string | null;
  };
  receiver: {
    id: string;
    name: string | null;
    image: string | null;
    slug: string | null;
    letterboxd: string | null;
  } | null;
}