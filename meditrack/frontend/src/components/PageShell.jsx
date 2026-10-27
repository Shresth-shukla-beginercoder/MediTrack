// Shared page layout: a centered container with an optional eyebrow badge,
// title, and subtitle. Used by every page in src/pages.

export default function PageShell({
  badge,
  title,
  subtitle,
  actions,
  children,
  wide = false,
}) {
  return (
    <div className="bg-[#F8FAFC] min-h-[70vh] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className={`${wide ? "max-w-7xl" : "max-w-5xl"} mx-auto`}>
        {(badge || title || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              {badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-200/60">
                  {badge}
                </span>
              )}
              {title && (
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between gap-4">
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="font-bold text-rose-800 hover:underline cursor-pointer shrink-0"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-sm font-medium">
      {message}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      <span className="text-sm font-semibold text-slate-400">Loading...</span>
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      {text && <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">{text}</p>}
      {action}
    </div>
  );
}

// Pulls a readable message out of an axios error.
export function apiErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}
