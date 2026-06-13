import { Skeleton } from '../_components/skeleton'

export default function AdminUsersLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[86px]" />
        <Skeleton className="h-[86px]" />
        <Skeleton className="h-[86px]" />
        <Skeleton className="h-[86px]" />
      </div>
      <Skeleton className="h-[60px]" />
      <Skeleton className="h-[560px]" />
    </div>
  )
}
