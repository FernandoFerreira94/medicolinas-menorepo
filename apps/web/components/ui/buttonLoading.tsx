import { Loader2Icon } from "lucide-react";

import { Button } from "../ui/button";

export function ButtonLoading() {
  return (
    <Button className="h-" disabled>
      <Loader2Icon className="animate-spin" />
      Please wait
    </Button>
  );
}
