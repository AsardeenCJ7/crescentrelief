import { motion } from "framer-motion";
import { useCountUp, useIntersection } from "../../hooks/index";
import { STATS } from "../../constants/data";

const StatCounter = ({ stat, isVisible }) => {
  const count = useCountUp(stat.value, 2200, isVisible);

  const display = () => {
    const formatted = count >= 1000000
      ? `${(count / 1000000).toFixed(1)}M`
      : count >= 1000
      ? `${Math.floor(count / 1000)}K`
      : count.toString();
    return `${stat.prefix || ""}${formatted}${stat.suffix || ""}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center p-6 lg:p-8"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
        <span className="material-symbols-outlined text-primary dark:text-primary-400 text-[22px]">{stat.icon}</span>
      </div>
      <span className="font-heading font-extrabold text-3xl lg:text-4xl text-neutral-900 dark:text-white tabular-nums transition-colors">
        {isVisible ? display() : "0"}
      </span>
      <span className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium transition-colors">{stat.label}</span>
    </motion.div>
  );
};

const LiveStatsSection = () => {
  const { ref, isVisible } = useIntersection(0.3);

  return (
    <section className="bg-white dark:bg-neutral-900 border-b border-border-light dark:border-neutral-800 transition-colors duration-300" ref={ref}>
      <div className="container-max">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border-light dark:divide-neutral-800 transition-colors duration-300">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <StatCounter stat={stat} isVisible={isVisible} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStatsSection;
