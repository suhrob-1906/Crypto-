export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm text-muted mb-1">{label}</label>}
      <input
        className="w-full bg-surface border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-green"
        {...props}
      />
      {error && <p className="text-red text-sm mt-1">{error}</p>}
    </div>
  )
}
