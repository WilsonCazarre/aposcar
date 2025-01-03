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

// Add the best films ever made to use as test nominees
// Run the scripts in the scrapper branch to get and load the "real" nominees
const nominees = [
  {
    name: "The Amazing Spider-Man 2",
    slug: "TEST-the-amazing-spider-man-2",
    tagline: "His greatest battle begins.",
    description:
      "For Peter Parker, life is busy. Between taking out the bad guys as Spider-Man and spending time with the person he loves, Gwen Stacy, high school graduation cannot come quickly enough. Peter has not forgotten about the promise he made to Gwen’s father to protect her by staying away, but that is a promise he cannot keep. Things will change for Peter when a new villain, Electro, emerges, an old friend, Harry Osborn, returns, and Peter uncovers new clues about his past.",
    image: "https://a.ltrbxd.com/resized/sm/upload/fs/xh/ms/hx/9HFdUfEuvbsaBfroPZNeDiA9W9-0-1000-0-1500-crop.jpg?v=4bb266c754",
    backdrop: "https://a.ltrbxd.com/resized/sm/upload/8g/vh/5j/hp/the-amazing-spider-man-2-1200-1200-675-675-crop-000000.jpg",
    letterboxd: "https://letterboxd.com/film/the-amazing-spider-man-2/",
  },
  {
    name: "Emma Stone",
    slug: "TEST-emma-stone",
    tagline: "Emma Stone as Gwen Stacy in",
    image: "https://image.tmdb.org/t/p/w342/8NwSfyYWIIUE1cI9Xhz92b0w7WD.jpg",
    letterboxd: "https://letterboxd.com/actor/emma-stone/",
    type: "person" as const,
  },
  {
    name: "Overwatch: Honor and Glory",
    slug: "TEST-overwatch-honor-and-glory",
    tagline: "Live with honor. Die with glory.",
    description: "The story follows Reinhardt through the Crusaders fated last battle at Eichenwalde, as well as his response to Winston’s call to action in the present.",
    image: "https://a.ltrbxd.com/resized/film-poster/1/2/3/0/7/1/9/1230719-overwatch-honor-and-glory-0-1000-0-1500-crop.jpg?v=82c427be7c",
    letterboxd: "https://letterboxd.com/film/overwatch-honor-and-glory/",
  },
  {
    name: "Reinhardt",
    slug: "TEST-reinhardt",
    tagline: "Reinhardt as himself in",
    image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/overwatch/0/02/Reinhardtskin1.jpg?width=325",
    letterboxd: "https://letterboxd.com/actor/reinhardt/",
    type: "person" as const,  
  },
  {
    name: "Avengers: Age of Ultron",
    slug: "TEST-avengers-age-of-ultron",
    tagline: "A New Age Has Come.",
    description: "When Tony Stark tries to jumpstart a dormant peacekeeping program, things go awry and Earth’s Mightiest Heroes are put to the ultimate test as the fate of the planet hangs in the balance. As the villainous Ultron emerges, it is up to The Avengers to stop him from enacting his terrible plans, and soon uneasy alliances and unexpected action pave the way for an epic and unique global adventure.",
    image: "https://a.ltrbxd.com/resized/film-poster/8/1/6/0/5/81605-avengers-age-of-ultron-0-1000-0-1500-crop.jpg?v=d315efaff1",
    backdrop: "https://a.ltrbxd.com/resized/sm/upload/gz/xu/8d/m4/avengers-age-of-ultron-1200-1200-675-675-crop-000000.jpg",
    letterboxd: "https://letterboxd.com/film/avengers-age-of-ultron/",
  },
  {
    name:	"Brian Tyler",
    slug: "TEST-brian-tyler",
    tagline: '"Avengers: Age of Ultron Title" by Brian Tyler',
    letterboxd: "https://letterboxd.com/composer/brian-tyler/",
    type: "person" as const,
  },
  {
    name: "history of the entire world, i guess",
    slug: "TEST-history-of-the-entire-world-i-guess",
    tagline: "You can make a religion out of this.",
    description: "Hi, you’re on a rock, floating in space. Pretty cool, huh? Some of it is water. Actually most of it is water. I can’t even get from here to there without buying a boat. It’s sad. I’m sad. How did this happen?",
    image: "https://a.ltrbxd.com/resized/film-poster/6/6/3/6/7/9/663679-history-of-the-entire-world-i-guess-0-1000-0-1500-crop.jpg?v=c8b3ba689e",
    backdrop: "https://a.ltrbxd.com/resized/sm/upload/8h/bo/f2/33/Screen%20Shot%202023-03-15%20at%2016.47.26-1200-1200-675-675-crop-000000.jpg",
    letterboxd: "https://letterboxd.com/film/history-of-the-entire-world-i-guess/",
  },
  {
    name: "Bill Wurtz",
    slug: "TEST-bill-wurtz",
    tagline: "Bill Wurtz for",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Youtube_logo_Bill_Wurtz_17_June_2018.svg/1200px-Youtube_logo_Bill_Wurtz_17_June_2018.svg.png",
    letterboxd: "https://letterboxd.com/director/bill-wurtz-2/",
    type: "person" as const,
  },
  {
    name: "Megamind",
    slug: "TEST-megamind",
    tagline: "SHOOT THEM WITH THE DEHYDRATION GUN",
    description: "After Megamind, a highly intelligent alien supervillain, defeats his long-time nemesis Metro Man, Megamind creates a new hero to fight, but must act to save the city when his “creation” becomes an even worse villain than he was.",
    image: "https://a.ltrbxd.com/resized/film-poster/2/6/4/7/6/26476-megamind-0-1000-0-1500-crop.jpg?v=d1296fb9f9",
    backdrop: "https://a.ltrbxd.com/resized/sm/upload/mg/7i/be/rb/megamind-150-1200-1200-675-675-crop-000000.jpg",
    letterboxd: "https://letterboxd.com/film/megamind/",
  },
  {
    name: "Brad Pitt",
    slug: "TEST-brad-pitt",
    tagline: "Brad Pitt as Metro Man in",
    image: "https://image.tmdb.org/t/p/w342/4rjnRCQ6bGFYdBb4UooOjsQy12c.jpg",
    letterboxd: "https://letterboxd.com/actor/brad-pitt/",
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
