export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
      <div className="mb-4 h-6 w-1/2 rounded bg-gray-200" />
      <div className="mb-3 flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-4 rounded bg-gray-200" />
        ))}
      </div>
      <div className="h-4 w-2/3 rounded bg-gray-100" />
    </div>
  );
}
