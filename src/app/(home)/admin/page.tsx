import { db } from "@/server/db";
import { dbtNomination } from "@/server/db/schema/aposcar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

async function createNomination(formData: FormData) {
  "use server";

  const categoryId = formData.get("category") as string;
  const primaryNomineeId = formData.get("primaryNominee") as string;
  const secondaryNomineeId = formData.get("secondaryNominee") as string | null;
  const isWinner = formData.get("winner") === "on";

  if (!categoryId || !primaryNomineeId) {
    throw new Error("Missing required fields");
  }

  await db.insert(dbtNomination).values({
    category: categoryId,
    primaryNominee: primaryNomineeId,
    secondaryNominee: secondaryNomineeId || null,
    isWinner,
  });

  revalidatePath("/admin");
}

export default async function AdminPage() {
  const categories = await db.query.dbtCategory.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  const movieNominees = await db.query.dbtNominee.findMany({
    where: (nominees, { eq }) => eq(nominees.type, "movie"),
    orderBy: (nominees, { asc }) => [asc(nominees.name)],
  });

  const personNominees = await db.query.dbtNominee.findMany({
    where: (nominees, { eq }) => eq(nominees.type, "person"),
    orderBy: (nominees, { asc }) => [asc(nominees.name)],
  });

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Add Nomination</h1>

      <form action={createNomination} className="grid gap-6">
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select name="category">
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Primary Nominee</Label>
          <Select name="primaryNominee">
            <SelectTrigger>
              <SelectValue placeholder="Select nominee" />
            </SelectTrigger>
            <SelectContent>
              {movieNominees.map((nominee) => (
                <SelectItem key={nominee.id} value={nominee.id}>
                  {nominee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Secondary Nominee</Label>
          <Select name="secondaryNominee">
            <SelectTrigger>
              <SelectValue placeholder="Select nominee (optional)" />
            </SelectTrigger>
            <SelectContent>
              {personNominees.map((nominee) => (
                <SelectItem key={nominee.id} value={nominee.id}>
                  {nominee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="winner" name="winner" />
          <Label htmlFor="winner">Winner</Label>
        </div>

        <Button type="submit">Save Nomination</Button>
      </form>
    </div>
  );
}
