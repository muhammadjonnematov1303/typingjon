import { Skeleton } from '../_components/skeleton'

export default function AdminStatsLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-[280px]" />
        <Skeleton className="h-[280px]" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-[280px]" />
        <Skeleton className="h-[280px]" />
      </div>
      <Skeleton className="h-[360px]" />
    </div>
  )
}
