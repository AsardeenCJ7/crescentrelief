const Hero = () => {
  return (
    <header className="relative overflow-hidden bg-surface-container-low pt-xl md:pt-xxl pb-xxl">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
        <div className="z-10">
          <div className="inline-flex items-center gap-sm bg-secondary-container text-on-secondary-container px-md py-xs rounded-full mb-lg">
            <span className="material-symbols-outlined text-[18px]" data-icon="volunteer_activism">volunteer_activism</span>
            <span className="font-label-sm uppercase tracking-wider">Join Our Global Mission</span>
          </div>
          <h1 className="font-display-lg text-[48px] md:text-[64px] leading-tight text-on-background mb-md">
            Helping Humanity Together. <span className="text-secondary">Every Donation Creates Hope.</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-xl max-w-lg">
            We provide dignified relief and sustainable development to the world's most vulnerable communities. Your support bridges the gap between despair and a brighter future.
          </p>
          <div className="flex flex-col sm:flex-row gap-md">
            <button className="bg-primary-gold text-[#1E293B] px-xl py-lg rounded-full font-bold shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-sm">
              Donate Now
              <span className="material-symbols-outlined" data-icon="favorite">favorite</span>
            </button>
            <button className="border border-outline-variant text-on-background px-xl py-lg rounded-full font-bold hover:bg-surface-variant/50 transition-all">
              Start Fundraising
            </button>
            <button className="text-secondary font-bold px-md py-lg flex items-center justify-center gap-sm hover:underline decoration-2">
              Become Volunteer
              <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full mt-xl lg:mt-0">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-3xl overflow-hidden shadow-2xl z-0">
            <img className="w-full h-full object-cover" alt="Diverse children in rural village" src="/images/hero_children.png" />
          </div>
          <div className="absolute bottom-4 left-0 w-1/2 h-1/2 rounded-3xl overflow-hidden border-8 border-background shadow-xl z-10">
            <img className="w-full h-full object-cover" alt="Volunteer handing clean water container" src="/images/hero_volunteer.png" />
          </div>
          <div className="absolute top-1/4 -right-4 sm:-right-8 w-16 h-16 sm:w-24 sm:h-24 bg-secondary rounded-full flex items-center justify-center text-on-secondary shadow-lg animate-bounce z-20">
            <span className="material-symbols-outlined scale-125 sm:scale-150" data-icon="diversity_1">diversity_1</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
