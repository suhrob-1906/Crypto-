import { useEffect, useState } from 'react'

export default function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1000 }) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        if (!value) return

        const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
        if (isNaN(numValue)) return

        const startValue = displayValue
        const endValue = numValue
        const startTime = Date.now()

        const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic

            const current = startValue + (endValue - startValue) * easeProgress
            setDisplayValue(current)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        animate()
    }, [value])

    const formatNumber = (num) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(2)
        if (num >= 1000000) return (num / 1000000).toFixed(2)
        if (num >= 1000) return (num / 1000).toFixed(2)
        return num.toFixed(2)
    }

    return (
        <span>
            {prefix}{formatNumber(displayValue)}{suffix}
        </span>
    )
}
