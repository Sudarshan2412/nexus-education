"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function Hero() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 bg-grid">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-neon-purple/10 to-neon-green/20"></div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center py-24 md:py-32">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Future of Learning
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tighter text-foreground mb-6 leading-[0.9]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Learn Without
              <motion.span
                className="block gradient-text"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Limits
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Access thousands of courses, code repositories, and learning
              materials crafted by industry experts. Master new skills at your
              own pace.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/courses"
                  className="group button-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-bold uppercase tracking-wider text-sm px-8 py-4 inline-flex items-center gap-2"
                >
                  Browse Courses
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              {!isAuthenticated && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/signup"
                    className="glass-card hover:bg-secondary text-foreground rounded-full font-display font-bold uppercase tracking-wider text-sm px-8 py-4 inline-block border border-border/50"
                  >
                    Get Started
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-border/50 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { value: "10K+", label: "Courses" },
                { value: "50K+", label: "Students" },
                { value: "500+", label: "Instructors" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
