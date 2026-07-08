const Skeleton = ({ className = "" }) => (
  <div className={`bg-gray-200 animate-pulse rounded-2xl ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="w-[280px] sm:w-[260px] md:w-[280px] h-[480px] rounded-3xl bg-white border border-gray-100 overflow-hidden">
    <Skeleton className="h-[240px] rounded-none" />
    <div className="p-2.5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="border-b border-gray-100 bg-gray-50/50 p-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="border-b border-gray-50 p-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-4" />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
