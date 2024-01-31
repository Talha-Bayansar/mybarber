import { SearchX } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="mt-20 flex flex-col items-center gap-4">
      <SearchX className="text-primary" size={60} />
      <p className="text-center">No results were found.</p>
    </div>
  );
};
