'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function CTA() {
    return (
        <section id="cta" className="relative py-24">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
                        {/* Background Glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />

                        <div className="max-w-3xl mx-auto relative z-10">
                            {/* Spinning Icon */}
                            <motion.div
                                className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-10 h-10 text-primary" />
                                <motion.div
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-green to-neon-purple"
                                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter text-foreground mb-4">
                                Ready to Start Learning?
                            </h2>

                            <p className="text-muted-foreground mb-8 text-lg">
                                Join thousands of students already learning on our platform.
                                Start your journey today with a free account.
                            </p>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/auth/signup"
                                    className="button-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-bold uppercase tracking-wider text-sm px-8 py-4 inline-flex items-center gap-2"
                                >
                                    Create Free Account
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
