'use client'

interface Props {
  name:     string
  initials: string
  image:    string | null
}

export function UserMenu({ name, initials, image }: Props) {
  const firstName = name.split(' ')[0]

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/60">
      <div className="relative flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100 ring-offset-1 ring-offset-white"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold tracking-wide text-white shadow-sm shadow-blue-200 ring-2 ring-white">
            {initials}
          </div>
        )}
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      </div>
      <span className="hidden font-sans text-sm font-bold tracking-tight text-slate-800 sm:block">
        {firstName}
      </span>
    </div>
  )
}
