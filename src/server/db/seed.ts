import { db } from "@/server/db";
import {
  dbtCategory,
  dbtCategoryTypesPoints,
  dbtMovie,
  dbtReceiver,
  dbtNomination,
} from "@/server/db/schema/aposcar";

// TODO: Order these in a more logical way
const categories = [
  {
    name: "Actor In A Leading Role",
    type: "main",
    description:
      "Recognizing the best performance by an actor in a leading role.",
  },
  {
    name: "Actor In A Supporting Role",
    type: "main",
    description:
      "Recognizing the best performance by an actor in a supporting role.",
  },
  {
    name: "Actress In A Leading Role",
    type: "main",
    description:
      "Recognizing the best performance by an actress in a leading role.",
  },
  {
    name: "Actress In A Supporting Role",
    type: "main",
    description:
      "Recognizing the best performance by an actress in a supporting role.",
  },
  {
    name: "Animated Feature Film",
    type: "main",
    description: "The best full-length film primarily created using animation.",
  },
  {
    name: "Cinematography",
    description:
      "Honoring outstanding achievement in motion picture photography.",
  },
  {
    name: "Costume Design",
    description:
      "Recognizing excellence in the creation of costumes for a film.",
  },
  {
    name: "Directing",
    type: "main",
    description: "Honoring the best achievement in film direction.",
  },
  {
    name: "Documentary Feature Film",
    description:
      "The best non-fiction film with a running time of 40 minutes or longer.",
  },
  {
    name: "Documentary Short Film",
    description:
      "The best non-fiction film with a running time of 40 minutes or less.",
  },
  {
    name: "Film Editing",
    description:
      "Recognizing outstanding achievement in the editing of a film.",
  },
  {
    name: "International Feature Film",
    type: "main",
    description:
      "The best feature-length film produced outside the United States with a predominantly non-English dialogue track.",
  },
  {
    name: "Makeup And Hairstyling",
    description: "Honoring excellence in makeup and hairstyling for a film.",
  },
  {
    name: "Music (Original Score)",
    description:
      "The best original musical score created specifically for a film.",
  },
  {
    name: "Music (Original Song)",
    description: "The best original song written specifically for a film.",
  },
  {
    name: "Best Picture",
    type: "main",
    description:
      "Honoring the producers of the year's most outstanding motion picture.",
  },
  {
    name: "Production Design",
    description:
      "Recognizing excellence in the visual environment and set design of a film.",
  },
  {
    name: "Animated Short Film",
    description: "The best short film primarily created using animation.",
  },
  {
    name: "Live Action Short Film",
    description: "The best short film not primarily animated.",
  },
  {
    name: "Sound",
    description:
      "Honoring excellence in the creation, recording, mixing, and design of a film's sound.",
  },
  {
    name: "Visual Effects",
    description: "Recognizing outstanding achievement in visual effects.",
  },
  {
    name: "Writing (Adapted Screenplay)",
    type: "main",
    description:
      "The best screenplay adapted from previously published or produced material.",
  },
  {
    name: "Writing (Original Screenplay)",
    type: "main",
    description:
      "The best screenplay not based upon previously published material.",
  },
].map((c) => ({
  ...c,
  slug: c.name
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
    .replaceAll(" ", "-"),
}));

const points = [
  {
    categoryType: "main",
    points: 10,
  },
  {
    categoryType: "regular",
    points: 5,
  },
  {
    categoryType: "secondary",
    points: 3,
  },
];

// Add the best films ever made to use as test nominees
// Run the scripts in the scrapper branch to get and load the "real" nominees
const movies = [
  {
    name: "The Amazing Spider-Man 2",
    slug: "TEST-the-amazing-spider-man-2",
    tagline: "His greatest battle begins.",
    description:
      "For Peter Parker, life is busy. Between taking out the bad guys as Spider-Man and spending time with the person he loves, Gwen Stacy, high school graduation cannot come quickly enough. Peter has not forgotten about the promise he made to Gwen’s father to protect her by staying away, but that is a promise he cannot keep. Things will change for Peter when a new villain, Electro, emerges, an old friend, Harry Osborn, returns, and Peter uncovers new clues about his past.",
    poster:
      "https://a.ltrbxd.com/resized/sm/upload/fs/xh/ms/hx/9HFdUfEuvbsaBfroPZNeDiA9W9-0-1000-0-1500-crop.jpg?v=4bb266c754",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/8g/vh/5j/hp/the-amazing-spider-man-2-1200-1200-675-675-crop-000000.jpg",
    letterboxd: "https://letterboxd.com/film/the-amazing-spider-man-2/",
  },
  {
    name: "Overwatch: Honor and Glory",
    slug: "TEST-overwatch-honor-and-glory",
    tagline: "Live with honor. Die with glory.",
    description:
      "The story follows Reinhardt through the Crusaders fated last battle at Eichenwalde, as well as his response to Winston’s call to action in the present.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/1/2/3/0/7/1/9/1230719-overwatch-honor-and-glory-0-1000-0-1500-crop.jpg?v=82c427be7c",
    letterboxd: "https://letterboxd.com/film/overwatch-honor-and-glory/",
    backdrop:
      "https://cdnb.artstation.com/p/assets/images/images/047/668/671/large/david-luong-rh6290-2.jpg?1648140143",
  },
  {
    name: "Avengers: Age of Ultron",
    slug: "TEST-avengers-age-of-ultron",
    tagline: "A New Age Has Come.",
    description:
      "When Tony Stark tries to jumpstart a dormant peacekeeping program, things go awry and Earth’s Mightiest Heroes are put to the ultimate test as the fate of the planet hangs in the balance. As the villainous Ultron emerges, it is up to The Avengers to stop him from enacting his terrible plans, and soon uneasy alliances and unexpected action pave the way for an epic and unique global adventure.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/8/1/6/0/5/81605-avengers-age-of-ultron-0-1000-0-1500-crop.jpg?v=d315efaff1",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/gz/xu/8d/m4/avengers-age-of-ultron-1200-1200-675-675-crop-000000.jpg",
    letterboxd: "https://letterboxd.com/film/avengers-age-of-ultron/",
  },
  {
    name: "history of the entire world, i guess",
    slug: "TEST-history-of-the-entire-world-i-guess",
    tagline: "You can make a religion out of this.",
    description:
      "Hi, you’re on a rock, floating in space. Pretty cool, huh? Some of it is water. Actually most of it is water. I can’t even get from here to there without buying a boat. It’s sad. I’m sad. How did this happen?",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/6/6/3/6/7/9/663679-history-of-the-entire-world-i-guess-0-1000-0-1500-crop.jpg?v=c8b3ba689e",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/8h/bo/f2/33/Screen%20Shot%202023-03-15%20at%2016.47.26-1200-1200-675-675-crop-000000.jpg",
    letterboxd:
      "https://letterboxd.com/film/history-of-the-entire-world-i-guess/",
  },
  {
    name: "Megamind",
    slug: "TEST-megamind",
    tagline: "SHOOT THEM WITH THE DEHYDRATION GUN",
    description:
      "After Megamind, a highly intelligent alien supervillain, defeats his long-time nemesis Metro Man, Megamind creates a new hero to fight, but must act to save the city when his “creation” becomes an even worse villain than he was.",
    poster:
      "https://a.ltrbxd.com/resized/film-poster/2/6/4/7/6/26476-megamind-0-1000-0-1500-crop.jpg?v=d1296fb9f9",
    backdrop:
      "https://a.ltrbxd.com/resized/sm/upload/mg/7i/be/rb/megamind-150-1200-1200-675-675-crop-000000.jpg",
    letterboxd: "https://letterboxd.com/film/megamind/",
  },
];

const receivers = [
  {
    name: "Emma Stone",
    slug: "TEST-emma-stone",
    // tagline: "Emma Stone as Gwen Stacy in",
    image: "https://image.tmdb.org/t/p/w342/8NwSfyYWIIUE1cI9Xhz92b0w7WD.jpg",
    letterboxd: "https://letterboxd.com/actor/emma-stone/",
  },
  {
    name: "Reinhardt",
    slug: "TEST-reinhardt",
    // tagline: "Reinhardt as himself in",
    image:
      "https://oyster.ignimgs.com/mediawiki/apis.ign.com/overwatch/0/02/Reinhardtskin1.jpg?width=325",
    letterboxd: "https://letterboxd.com/actor/reinhardt/",
  },
  {
    name: "Brian Tyler",
    slug: "TEST-brian-tyler",
    // tagline: '"Avengers: Age of Ultron Title" by Brian Tyler',
    letterboxd: "https://letterboxd.com/composer/brian-tyler/",
  },
  {
    name: "Bill Wurtz",
    slug: "TEST-bill-wurtz",
    // tagline: "Bill Wurtz for",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Youtube_logo_Bill_Wurtz_17_June_2018.svg/1200px-Youtube_logo_Bill_Wurtz_17_June_2018.svg.png",
    letterboxd: "https://letterboxd.com/director/bill-wurtz-2/",
  },
  {
    name: "Brad Pitt",
    slug: "TEST-brad-pitt",
    // tagline: "Brad Pitt as Metro Man in",
    image: "https://image.tmdb.org/t/p/w342/4rjnRCQ6bGFYdBb4UooOjsQy12c.jpg",
    letterboxd: "https://letterboxd.com/actor/brad-pitt/",
  },
];

const nominations = [
  // Best Picture nominations
  {
    category: categories.find((c) => c.name === "Best Picture")?.slug,
    movie: movies[0].slug, // Spider-Man 2
    isWinner: false,
  },
  {
    category: categories.find((c) => c.name === "Best Picture")?.slug,
    movie: movies[1].slug, // Overwatch
    isWinner: false,
  },
  {
    category: categories.find((c) => c.name === "Best Picture")?.slug,
    movie: movies[2].slug, // Age of Ultron
    isWinner: false,
  },
  {
    category: categories.find((c) => c.name === "Best Picture")?.slug,
    movie: movies[3].slug, // history of the world
    isWinner: false,
  },
  {
    category: categories.find((c) => c.name === "Best Picture")?.slug,
    movie: movies[4].slug, // Megamind
    isWinner: false,
  },

  // Directing nominations
  {
    category: categories.find((c) => c.name === "Directing")?.slug,
    movie: movies[0].slug, // Spider man 2
    receiver: receivers.find((r) => r.name === "Emma Stone")?.slug,
    description: "as Gwen Stacy in",
    isWinner: false,
  },
  {
    category: categories.find((c) => c.name === "Directing")?.slug,
    movie: movies[1].slug, // Overwatch
    receiver: receivers.find((r) => r.name === "Reinhardt")?.slug,
    description: "as himself in",
    isWinner: false,
  },
  {
    // Maybe in the case of song the receiver should be the song itself?
    // In that case the description would be "By Brian Tyler"
    category: categories.find((c) => c.name === "Directing")?.slug,
    movie: movies[2].slug, // Age of Ultron
    receiver: receivers.find((r) => r.name === "Brian Tyler")?.slug,
    description: 'for "Avengers: Age of Ultron Title"',
    isWinner: false,
  },
  {
    category: categories.find((c) => c.name === "Directing")?.slug,
    movie: movies[3].slug, // history of the world
    receiver: receivers.find((r) => r.name === "Bill Wurtz")?.slug,
    description: "for",
    isWinner: false,
  },
  {
    category: categories.find((c) => c.name === "Directing")?.slug,
    movie: movies[4].slug, // Megamind
    receiver: receivers.find((r) => r.name === "Brad Pitt")?.slug,
    description: "as Metro Man in",
    isWinner: false,
  },
];

void (async () => {
  await db
    .insert(dbtCategory)
    .values(categories)
    .onConflictDoNothing({ target: dbtCategory.slug });
  console.log("Inserted categories: ", { categories });

  await db
    .insert(dbtMovie)
    .values(movies)
    .onConflictDoNothing({ target: dbtMovie.slug });
  console.log("Inserted movies: ", { movies });

  await db
    .insert(dbtReceiver)
    .values(receivers)
    .onConflictDoNothing({ target: dbtReceiver.slug });
  console.log("Inserted movies: ", { receivers });

  await db
    .insert(dbtCategoryTypesPoints)
    .values(points)
    .onConflictDoNothing({ target: points.categoryType });
  console.log("Inserted points: ", { points });

  const dbCategories = await db.select().from(dbtCategory);
  const dbMovies = await db.select().from(dbtMovie);
  const dbReceivers = await db.select().from(dbtReceiver);

  const nominationsWithIds = nominations.map((nom) => {
    const categoryId = dbCategories.find((c) => c.slug === nom.category)?.id;
    const movieId = dbMovies.find((m) => m.slug === nom.movie)?.id;
    const receiverId = dbReceivers.find((r) => r.slug === nom.receiver)?.id;

    return {
      id: crypto.randomUUID(),
      isWinner: nom.isWinner,
      category: categoryId,
      movie: movieId,
      receiver: receiverId,
      description: nom.description,
    };
  });

  await db
    .insert(dbtNomination)
    .values(nominationsWithIds)
    .onConflictDoNothing();
  console.log("Inserted nominations: ", { nominationsWithIds });
})();
