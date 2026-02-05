export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-surface border border-border rounded-lg overflow-hidden ${className}`}>
      {title && <div className="px-4 py-2 border-b border-border font-medium">{title}</div>}
      <div className="p-4">{children}</div>
    </div>
  )
}
