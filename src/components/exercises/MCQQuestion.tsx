'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Loader2 } from 'lucide-react'

interface MCQQuestionProps {
    exerciseId: string
    question: string
    options: { [key: string]: string }
    points: number
}

export function MCQQuestion({ exerciseId, question, options, points }: MCQQuestionProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string>('')
    const [submitted, setSubmitted] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [previousSubmission, setPreviousSubmission] = useState<any>(null)

    useEffect(() => {
        fetchPreviousSubmission()
    }, [exerciseId])

    const fetchPreviousSubmission = async () => {
        try {
            const res = await fetch(`/api/exercises/${exerciseId}/submit`)
            const data = await res.json()
            if (data.submission) {
                setPreviousSubmission(data.submission)
                setSelectedAnswer(data.submission.answer)
                setSubmitted(true)
                setResult({
                    score: data.submission.score,
                    maxScore: points,
                    correct: data.submission.score === points
                })
            }
        } catch (error) {
            console.error('Failed to fetch submission:', error)
        }
    }

    const handleSubmit = async () => {
        if (!selectedAnswer) return

        setLoading(true)
        try {
            const res = await fetch(`/api/exercises/${exerciseId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer: selectedAnswer })
            })

            const data = await res.json()
            setResult(data)
            setSubmitted(true)
        } catch (error) {
            console.error('Submit error:', error)
            alert('Failed to submit answer')
        } finally {
            setLoading(false)
        }
    }

    const optionKeys = Object.keys(options)

    return (
        <div className="glass-card p-8 space-y-6">
            {/* Question */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display font-bold text-foreground">
                        {question}
                    </h3>
                    <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">
                        {points} points
                    </span>
                </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {optionKeys.map((key) => (
                    <motion.label
                        key={key}
                        whileHover={{ x: 4 }}
                        className={`
              flex items-center gap-4 p-4 rounded-lg cursor-pointer border-2 transition-all
              ${selectedAnswer === key
                                ? 'bg-primary/10 border-primary'
                                : 'bg-secondary/30 border-border/30 hover:border-border'
                            }
              ${submitted && result?.correct && selectedAnswer === key
                                ? 'bg-neon-green/10 border-neon-green'
                                : ''
                            }
              ${submitted && !result?.correct && selectedAnswer === key
                                ? 'bg-destructive/10 border-destructive'
                                : ''
                            }
            `}
                    >
                        <input
                            type="radio"
                            name={`mcq-${exerciseId}`}
                            value={key}
                            checked={selectedAnswer === key}
                            onChange={(e) => setSelectedAnswer(e.target.value)}
                            disabled={submitted}
                            className="w-5 h-5 accent-primary"
                        />
                        <span className="flex-1 font-medium text-foreground">
                            <span className="font-bold text-primary mr-2">{key}.</span>
                            {options[key]}
                        </span>
                        {submitted && selectedAnswer === key && (
                            result?.correct ? (
                                <Check className="w-5 h-5 text-neon-green" />
                            ) : (
                                <X className="w-5 h-5 text-destructive" />
                            )
                        )}
                    </motion.label>
                ))}
            </div>

            {/* Submit Button */}
            {!submitted && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!selectedAnswer || loading}
                    className="w-full button-glow bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-display font-bold uppercase text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Answer'
                    )}
                </motion.button>
            )}

            {/* Result */}
            {submitted && result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border-2 ${result.correct
                            ? 'bg-neon-green/10 border-neon-green'
                            : 'bg-destructive/10 border-destructive'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {result.correct ? (
                                <Check className="w-6 h-6 text-neon-green" />
                            ) : (
                                <X className="w-6 h-6 text-destructive" />
                            )}
                            <span className="font-display font-bold text-lg">
                                {result.correct ? 'Correct!' : 'Incorrect'}
                            </span>
                        </div>
                        <span className="font-display font-bold text-lg">
                            {result.score}/{result.maxScore} points
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
