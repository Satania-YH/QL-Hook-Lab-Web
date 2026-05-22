import type { HookItem } from "@/lib/types";
import HookCard from "./HookCard";

interface HookGridProps {
  hooks: HookItem[];
}

export default function HookGrid({ hooks }: HookGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {hooks.map((hook, index) => (
        <HookCard key={hook.id} hook={hook} index={index} />
      ))}
    </div>
  );
}
