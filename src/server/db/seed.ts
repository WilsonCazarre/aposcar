import { db } from "@/server/db";
import { dbtCategory, dbtNominee } from "@/server/db/schema/aposcar";

const categories = [
  {
    name: "Actor In A Leading Role",
  },
  {
    name: "Actor In A Supporting Role",
  },
  {
    name: "Actress In A Leading Role",
  },
  {
    name: "Actress In A Supporting Role",
  },
  {
    name: "Animated Feature Film",
  },
  {
    name: "Cinematography",
  },
  {
    name: "Costume Design",
  },
  {
    name: "Directing",
  },
  {
    name: "Documentary Feature Film",
  },
  {
    name: "Documentary Short Film",
  },
  {
    name: "Film Editing",
  },
  {
    name: "International Feature Film",
  },
  {
    name: "Makeup And Hairstyling",
  },
  {
    name: "Music (Original Score)",
  },
  {
    name: "Music (Original Song)",
  },
  {
    name: "Best Picture",
  },
  {
    name: "Production Design",
  },
  {
    name: "Animated Short Film",
  },
  {
    name: "Live Action Short Film",
  },
  {
    name: "Sound",
  },
  {
    name: "Visual Effects",
  },
  {
    name: "Writing (Adapted Screenplay)",
  },
  {
    name: "Writing (Original Screenplay)",
  },
].map((c) => ({
  ...c,
  slug: c.name
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
    .replaceAll(" ", "-"),
}));

const nominees = [
  {
    name: "The Amazing Spider-Man 2",
    slug: "the-amazing-spider-man-2",
    tagline: "His greatest battle begins.",
    description:
      "For Peter Parker, life is busy. Between taking out the bad guys as Spider-Man and spending time with the person he loves, Gwen Stacy, high school graduation cannot come quickly enough. Peter has not forgotten about the promise he made to Gwen’s father to protect her by staying away, but that is a promise he cannot keep. Things will change for Peter when a new villain, Electro, emerges, an old friend, Harry Osborn, returns, and Peter uncovers new clues about his past.",
    image: "https://a.ltrbxd.com/resized/sm/upload/fs/xh/ms/hx/9HFdUfEuvbsaBfroPZNeDiA9W9-0-1000-0-1500-crop.jpg?v=4bb266c754",
    backdrop: "https://a.ltrbxd.com/resized/sm/upload/8g/vh/5j/hp/the-amazing-spider-man-2-1200-1200-675-675-crop-000000.jpg",
    letterboxd: "https://letterboxd.com/film/the-amazing-spider-man-2/",
  },
  {
    name: "Emma Stone",
    slug: "emma-stone",
    tagline: "Emma Stone as Gwen Stacy in",
    image: "https://image.tmdb.org/t/p/w342/8NwSfyYWIIUE1cI9Xhz92b0w7WD.jpg",
    letterboxd: "https://letterboxd.com/actor/emma-stone/",
    type: "person" as const,
  },
];

void (async () => {
  await db
    .insert(dbtCategory)
    .values(categories)
    .onConflictDoNothing({ target: dbtCategory.slug });
  console.log("Inserted categories: ", { categories });

  await db
    .insert(dbtNominee)
    .values(nominees)
    .onConflictDoNothing({ target: dbtNominee.slug });
  console.log("Inserted nominees: ", { nominees });
})();
