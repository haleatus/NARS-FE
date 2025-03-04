import { Card, CardContent } from "@/components/ui/card";
import { Ambulance } from "lucide-react";

export default function EmptyState() {
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
        <div className="rounded-full bg-red-50 p-4">
          <Ambulance className="h-12 w-12 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            No Requests Yet
          </h3>
          <p className="text-sm text-muted-foreground">
            You currently have no ambulance requests. New requests will appear
            here when they arrive.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
