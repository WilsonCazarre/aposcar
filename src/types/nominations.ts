export interface Nomination {
  id: string;
  movie:
    | {
        id: string;
        poster: string | null;
        name: string | null;
        slug: string | null;
        description: string | null;
        tagline: string | null;
        backdrop: string | null;
        letterboxd: string | null;
      }
    | string;
  receiver:
    | {
        id: string;
        slug: string | null;
        image: string | null;
        name: string | null;
        letterboxd: string | null;
      }
    | string
    | null;
  isWinner: boolean;
  category: string;
  description: string | null;
}
