import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-md",
                "before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-br before:from-white/10 before:to-transparent",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
