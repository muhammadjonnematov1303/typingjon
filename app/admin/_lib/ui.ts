// Shared admin design-system tokens — keep every section visually consistent.

export const CARD =
  'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'

export const TABLE_HEAD_ROW =
  'hidden border-b border-slate-100 bg-slate-50/80 px-6 py-2.5 dark:border-slate-800 dark:bg-slate-800/60 md:grid md:items-center md:gap-4'

export const TABLE_HEAD_LABEL =
  'text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'

// Row baseline: every table row shares the same height + vertical centering so
// badges, text and action buttons line up identically across all admin tables.
export const ROW =
  'grid min-h-[64px] grid-cols-1 items-center gap-3 px-6 py-3 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30 md:gap-4'

// Shared column-width fragments — every table composes its grid from these so
// same-purpose columns (tag/meta/actions) are pixel-identical across pages.
// icon: narrow leading index/avatar slot · primary: name+subtitle · tag: badge ·
// meta: secondary text (date/category) · actions: trailing controls, right-aligned
//
// NOTE: Tailwind only generates CSS for class names it can find as literal strings
// in source files — it cannot see classes assembled at runtime via interpolation
// (e.g. `md:grid-cols-[${COL_PRIMARY}_...]`). Each grid below is therefore written
// out as one static literal so the arbitrary-value utility actually gets compiled.

// Foydalanuvchi · Rol · Holat · Qo'shilgan · Amallar
export const GRID_USERS =
  'md:grid-cols-[minmax(0,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(110px,1fr)_minmax(120px,auto)]'

// Checkbox · Foydalanuvchi · Dars progressi · Rol · Holat · Qo'shilgan · Amallar
// Compact responsive grid — every column fits without horizontal scroll;
// only "Foydalanuvchi" stretches to fill remaining space.
export const GRID_USERS_FIXED =
  'grid-cols-[40px_minmax(140px,1fr)_104px_116px_100px_92px_120px]'
// # · Dars · Daraja · Kategoriya · Amallar
// Fixed-width trailing columns (like GRID_USERS_FIXED) so the header row's
// independent grid sizes identically to each data row's grid — an `auto`
// track here would size differently per row (e.g. when delete-confirm is
// open) and shift Daraja/Kategoriya out of alignment with the header.
export const GRID_LESSONS =
  'md:grid-cols-[44px_minmax(160px,1fr)_120px_140px_240px]'
// Dars · Yakunlagan · Foiz
export const GRID_STATS_LESSONS =
  'md:grid-cols-[minmax(0,2fr)_minmax(100px,1fr)_minmax(160px,2fr)]'

// # · Dars nomi · Turkumi · Tezligi · Aniqligi · O'tkazish · Qaytarish
export const GRID_USER_LESSONS =
  'md:grid-cols-[44px_minmax(160px,1fr)_120px_90px_90px_124px_124px]'

export const TABLE_CELL_ACTIONS = 'flex w-fit items-center md:justify-self-end'

// Ranked-list rows (leaderboard, top performers) — same height/centering baseline as ROW
export const LIST_ROW =
  'flex min-h-[64px] items-center gap-4 px-6 py-3 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30'

export const BADGE =
  'inline-flex w-fit items-center rounded-lg px-2.5 py-1 text-xs font-semibold leading-none'

export const INPUT =
  'h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-sans text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-blue-700 dark:focus:ring-blue-900/40'

export const SELECT =
  'h-10 rounded-xl border border-slate-200 bg-white px-3 font-sans text-xs font-semibold text-slate-600 outline-none transition-colors focus:border-blue-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:focus:border-blue-700'

export const BTN_PRIMARY =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 font-sans text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'

export const BTN_SECONDARY =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 font-sans text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'

export const PAGE_TITLE = 'flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white'
export const PAGE_SUBTITLE = 'text-sm text-slate-500 dark:text-slate-400'

export const TAB_BAR =
  'flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900'

export function tabClass(active: boolean) {
  return active
    ? 'rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white transition-colors dark:bg-white dark:text-slate-900'
    : 'rounded-lg px-4 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200'
}
