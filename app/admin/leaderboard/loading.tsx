import { Skeleton } from '../_components/skeleton'

export default function AdminLeaderboardLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-10 w-64 rounded-xl" />
      <Skeleton className="h-[480px]" />
    </div>
  )
}
