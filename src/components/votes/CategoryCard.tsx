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
    <Card className="lg:min-h-44">
      <CardHeader className="p-4 lg:p-6">
        {points && (
          <span className="text-xs text-muted-foreground lg:text-sm">
            ({points} points)
          </span>
        )}
        <CardTitle className="text-xl lg:text-2xl">{name}</CardTitle>
        <p className="hidden pt-2 text-sm text-muted-foreground lg:block">
          {description}
        </p>
      </CardHeader>
    </Card>
  );
}
