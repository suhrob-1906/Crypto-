export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded font-medium transition'
  const variants = { primary: 'bg-green hover:bg-green/90 text-black', danger: 'bg-red hover:bg-red/90 text-white', secondary: 'bg-surface border border-border hover:bg-border/50' }
  return <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>{children}</button>
}
