import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function CategoryCard({
  name,
  description,
  points,
}: {
  name: string;
  description: string | null;
  points?: number | undefined | null;
}) {
  return (
    <Card>
      <CardHeader>
        {points && (
          <span className="text-sm text-muted-foreground">
            ({points} points)
          </span>
        )}
        <CardTitle>{name}</CardTitle>
        <p className="pt-2 text-sm text-muted-foreground">{description}</p>
      </CardHeader>
    </Card>
  );
}
