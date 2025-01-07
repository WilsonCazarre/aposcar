import { db } from "@/server/db";
import { dbtCategory, dbtNominee } from "@/server/db/schema/aposcar";

// Seed data gathered from https://theawards.vercel.app/docs
// Award edition ID: 94 (2021)

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
    name: "Documentary (Feature)",
  },
  {
    name: "Documentary (Short Subject)",
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
    name: "Short Film (Animated)",
  },
  {
    name: "Short Film (Live Action)",
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
    name: "Belfast",
    description:
      "Laura Berwick, Kenneth Branagh, Becca Kovacik and Tamar Thomas, Producers",
    note: null,
  },
  {
    name: "CODA",
    description:
      "Philippe Rousselet, Fabrice Gianfermi and Patrick Wachsberger, Producers",
    note: null,
  },
  {
    name: "Don't Look Up",
    description: "Adam McKay and Kevin Messick, Producers",
    note: null,
  },
  {
    name: "Drive My Car",
    description: "Teruhisa Yamamoto, Producer",
    note: null,
  },
  {
    name: "Dune",
    description: "Mary Parent, Denis Villeneuve and Cale Boyter, Producers",
    note: null,
  },
  {
    name: "King Richard",
    description: "Tim White, Trevor White and Will Smith, Producers",
    note: null,
  },
  {
    name: "Licorice Pizza",
    description: "Sara Murphy, Adam Somner and Paul Thomas Anderson, Producers",
    note: null,
  },
  {
    name: "Nightmare Alley",
    description:
      "Guillermo del Toro, J. Miles Dale and Bradley Cooper, Producers",
    note: null,
  },
  {
    name: "The Power of the Dog",
    description:
      "Jane Campion, Tanya Seghatchian, Emile Sherman, Iain Canning and Roger Frappier, Producers",
    note: null,
  },
  {
    name: "West Side Story",
    description: "Steven Spielberg and Kristie Macosko Krieger, Producers",
    note: null,
  },
  {
    name: "Kenneth Branagh",
    type: "person" as const,
  },
  {
    name: "Ryusuke Hamaguchi",
    type: "person" as const,
  },
  {
    name: "Paul Thomas Anderson",
    type: "person" as const,
  },
  {
    name: "Jane Campion",
    type: "person" as const,
  },
  {
    name: "Steven Spielberg",
    type: "person" as const,
  },
  {
    name: "Don't Look Up",
    note: null,
  },
  {
    name: "Dune",
    note: null,
  },
  {
    name: "King Richard",
    note: null,
  },
  {
    name: "The Power of the Dog",
    note: null,
  },
  {
    name: "tick, tick...BOOM!",
    note: null,
  },
].map((c) => ({
  ...c,
  slug: c.name
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
    .replaceAll(" ", "-"),
}));

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
