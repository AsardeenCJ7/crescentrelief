import { useEffect, useRef } from 'react';

const Statistics = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-counter');
        }
      });
    }, observerOptions);

    const elements = sectionRef.current?.querySelectorAll('.animate-counter-trigger');
    elements?.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-neutral-900 transition-colors duration-300" ref={sectionRef}>
      <div className="container-max">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="animate-counter-trigger opacity-0 translate-y-2 flex flex-col items-center text-center p-6 md:p-8 bg-neutral-50 dark:bg-neutral-800 rounded-3xl shadow-sm border border-border-light dark:border-neutral-700 transition-colors duration-300">
            <span className="text-4xl md:text-5xl font-heading font-extrabold text-primary dark:text-primary-300 mb-2 block">£18M+</span>
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Raised Since 2010</span>
          </div>
          <div className="animate-counter-trigger opacity-0 translate-y-2 flex flex-col items-center text-center p-6 md:p-8 bg-neutral-50 dark:bg-neutral-800 rounded-3xl shadow-sm border border-border-light dark:border-neutral-700 transition-colors duration-300" style={{ animationDelay: '100ms' }}>
            <span className="text-4xl md:text-5xl font-heading font-extrabold text-primary dark:text-primary-300 mb-2 block">120K</span>
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Global Donors</span>
          </div>
          <div className="animate-counter-trigger opacity-0 translate-y-2 flex flex-col items-center text-center p-6 md:p-8 bg-neutral-50 dark:bg-neutral-800 rounded-3xl shadow-sm border border-border-light dark:border-neutral-700 transition-colors duration-300" style={{ animationDelay: '200ms' }}>
            <span className="text-4xl md:text-5xl font-heading font-extrabold text-primary dark:text-primary-300 mb-2 block">350+</span>
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Active Projects</span>
          </div>
          <div className="animate-counter-trigger opacity-0 translate-y-2 flex flex-col items-center text-center p-6 md:p-8 bg-neutral-50 dark:bg-neutral-800 rounded-3xl shadow-sm border border-border-light dark:border-neutral-700 transition-colors duration-300" style={{ animationDelay: '300ms' }}>
            <span className="text-4xl md:text-5xl font-heading font-extrabold text-primary dark:text-primary-300 mb-2 block">18</span>
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Countries Served</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
