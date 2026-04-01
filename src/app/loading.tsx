export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-4 w-12 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-100 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>

      {/* Heading skeleton */}
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-5 bg-gray-100 rounded w-1/2 mb-10" />

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-9 bg-gray-200 rounded-lg mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
