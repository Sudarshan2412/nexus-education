'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Check, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EnrollButtonProps {
    courseId: string
    coursePrice: number
    className?: string
}

export function EnrollButton({ courseId, coursePrice, className = '' }: EnrollButtonProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [enrolled, setEnrolled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)

    // Check enrollment status
    useEffect(() => {
        if (session?.user) {
            checkEnrollment()
        } else {
            setLoading(false)
        }
    }, [session, courseId])

    const checkEnrollment = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}/enroll`)
            const data = await res.json()
            setEnrolled(data.enrolled)
        } catch (error) {
            console.error('Failed to check enrollment:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEnroll = async () => {
        if (!session) {
            router.push(`/auth/signin?callbackUrl=/courses/${courseId}`)
            return
        }

        setProcessing(true)

        try {
            const res = await fetch(`/api/courses/${courseId}/enroll`, {
                method: 'POST'
            })

            if (res.ok) {
                setEnrolled(true)
                // Show success notification
                router.refresh()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to enroll')
            }
        } catch (error) {
            console.error('Enroll error:', error)
            alert('Failed to enroll in course')
        } finally {
            setProcessing(false)
        }
    }

    const handleUnenroll = async () => {
        if (!confirm('Are you sure you want to unenroll from this course?')) {
            return
        }

        setProcessing(true)

        try {
            const res = await fetch(`/api/courses/${courseId}/enroll`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setEnrolled(false)
                router.refresh()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to unenroll')
            }
        } catch (error) {
            console.error('Unenroll error:', error)
            alert('Failed to unenroll from course')
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className={`glass-card px-6 py-3 rounded-full ${className}`}>
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
        )
    }

    if (enrolled) {
        return (
            <div className="flex gap-3">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <button
                        className="glass-card px-6 py-3 rounded-full font-display font-bold uppercase text-sm tracking-wider flex items-center gap-2 bg-neon-green/10 text-neon-green border border-neon-green/30"
                    >
                        <Check className="w-5 h-5" />
                        Enrolled
                    </button>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <button
                        onClick={handleUnenroll}
                        disabled={processing}
                        className="glass-card px-6 py-3 rounded-full font-display font-bold uppercase text-sm tracking-wider flex items-center gap-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border/30 hover:border-destructive/30 transition-all disabled:opacity-50"
                    >
                        {processing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <X className="w-5 h-5" />
                        )}
                        Unenroll
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <button
                onClick={handleEnroll}
                disabled={processing}
                className={`button-glow bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-display font-bold uppercase text-sm tracking-wider flex items-center gap-2 disabled:opacity-50 ${className}`}
            >
                {processing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        {coursePrice === 0 ? 'Enroll for FREE' : `Enroll for ₹${coursePrice}`}
                    </>
                )}
            </button>
        </motion.div>
    )
}
