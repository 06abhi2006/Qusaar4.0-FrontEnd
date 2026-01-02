import { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion, useSpring, useInView } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [spring, value, inView]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [spring]);

  return <span ref={ref} />;
}

export function StatCard({ title, value, icon: Icon, iconColor, iconBg }: StatCardProps) {
  // Attempt to parse value as number for animation
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
  const isNumber = !isNaN(numericValue) && numericValue >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {isNumber ? <Counter value={numericValue} /> : value}
          </p>
        </div>
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          className={`${iconBg} p-3 rounded-xl`}
        >
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </motion.div>
      </div>
    </motion.div>
  );
}
