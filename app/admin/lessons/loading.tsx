import { Skeleton } from '../_components/skeleton'

export default function AdminLessonsLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-[480px]" />
    </div>
  )
}
