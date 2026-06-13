import { Skeleton } from './_components/skeleton'

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-[86px]" />)}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-[280px]" />
        <Skeleton className="h-[280px]" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-[320px]" />
        <Skeleton className="h-[320px]" />
      </div>
    </div>
  )
}
