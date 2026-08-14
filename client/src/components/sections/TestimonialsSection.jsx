import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "../../constants/data";

const StarRating = () => (
  <div className="flex gap-0.5 mb-4">
    {Array(5).fill(0).map((_, i) => (
      <span key={i} className="material-symbols-outlined text-amber-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
    ))}
  </div>
);

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.children[0].offsetWidth + 20; // width + gap (approx)
      const newActive = Math.round(scrollPosition / cardWidth);
      if (newActive !== active) {
        setActive(newActive);
      }
    }
  };

  const scrollTo = (index) => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const cardWidth = scrollRef.current.children[0].offsetWidth + 20;
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      setActive(index);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const cardWidth = scrollRef.current.children[0].offsetWidth + 20;
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const cardWidth = scrollRef.current.children[0].offsetWidth + 20;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="section-padding bg-white dark:bg-neutral-900 overflow-hidden transition-colors duration-300">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">Community Voices</span>
          <h2 className="section-title">What Our Donors Say</h2>
          <p className="section-subtitle mt-3 mx-auto">
            Thousands of donors trust us every day. Here are some of their stories.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Scroll Arrows (Desktop) */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shadow-lg border border-border-light dark:border-neutral-700 items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:scale-105 transition-all opacity-0 group-hover/carousel:opacity-100"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shadow-lg border border-border-light dark:border-neutral-700 items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:scale-105 transition-all opacity-0 group-hover/carousel:opacity-100"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          {/* Cards Row */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto no-scrollbar pb-6 pt-2 px-2 snap-x snap-mandatory"
          >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex-shrink-0 w-[320px] md:w-[380px] snap-start bg-white dark:bg-neutral-900 border border-border-light dark:border-neutral-800 rounded-3xl p-7 shadow-card dark:shadow-none hover:shadow-card-hover dark:hover:border-neutral-700 transition-all group"
            >
              <StarRating />
              <blockquote className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 flex-1">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border-light dark:border-neutral-800">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/10"
                />
                <div>
                  <p className="font-heading font-semibold text-neutral-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-neutral-400">{t.location}</p>
                </div>
                <div className="ml-auto">
                  <span className="badge badge bg-primary-50 dark:bg-primary-900/30 text-primary dark:text-primary-400 border-0 text-xs transition-colors">{t.donated}</span>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all ${active === i ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-neutral-200 dark:bg-neutral-700"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
