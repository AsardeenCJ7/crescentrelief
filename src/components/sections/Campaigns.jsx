const Campaigns = () => {
  return (
    <section className="py-xxl bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-xl gap-4">
          <div>
            <h2 className="font-headline-lg text-on-background mb-sm">Urgent Campaigns</h2>
            <p className="text-on-surface-variant">Your immediate action can save lives today.</p>
          </div>
          <button className="flex items-center gap-sm text-secondary font-bold">
            View All Campaigns
            <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
          {/* Emergency Appeal Card */}
          <div className="group bg-surface rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(30,41,59,0.05)] hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="relative h-48">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Dramatic drone shot of flood-affected region" src="/images/campaign_flood.png" />
              <div className="absolute top-md left-md bg-error text-on-error px-md py-xs rounded-full text-label-sm font-bold flex items-center gap-xs shadow-md">
                <span className="material-symbols-outlined text-[14px]" data-icon="emergency">emergency</span>
                Emergency Appeal
              </div>
            </div>
            <div className="p-md flex flex-col flex-grow">
              <h3 className="font-headline-md text-[20px] mb-sm line-clamp-2">Gaza & Lebanon Emergency Medical Aid</h3>
              <p className="text-body-md text-on-surface-variant mb-lg line-clamp-3">Providing life-saving medicine and emergency surgeries to displaced families.</p>
              <div className="mt-auto">
                <div className="flex justify-between mb-xs">
                  <span className="text-label-sm font-bold text-secondary">£84,500 raised</span>
                  <span className="text-label-sm text-on-surface-variant">75%</span>
                </div>
                <div className="h-2 w-full bg-outline-variant/30 rounded-full mb-lg">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '75%' }}></div>
                </div>
                <button className="w-full bg-secondary text-on-secondary py-sm rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-xs">
                  Donate
                  <span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Water Wells Card */}
          <div className="group bg-surface rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(30,41,59,0.05)] hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="relative h-48">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Children catching fresh water in African landscape" src="/images/campaign_water.png" />
              <div className="absolute top-md left-md bg-primary-container text-on-primary-container px-md py-xs rounded-full text-label-sm font-bold">Sustainability</div>
            </div>
            <div className="p-md flex flex-col flex-grow">
              <h3 className="font-headline-md text-[20px] mb-sm">Community Water Well Projects</h3>
              <p className="text-body-md text-on-surface-variant mb-lg line-clamp-3">Building sustainable water sources for villages in drought-prone areas.</p>
              <div className="mt-auto">
                <div className="flex justify-between mb-xs">
                  <span className="text-label-sm font-bold text-secondary">£12,300 raised</span>
                  <span className="text-label-sm text-on-surface-variant">42%</span>
                </div>
                <div className="h-2 w-full bg-outline-variant/30 rounded-full mb-lg">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '42%' }}></div>
                </div>
                <button className="w-full bg-secondary text-on-secondary py-sm rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-xs">
                  Donate
                  <span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sponsor Orphan Card */}
          <div className="group bg-surface rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(30,41,59,0.05)] hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="relative h-48">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Young child focused on writing in classroom" src="/images/campaign_education.png" />
              <div className="absolute top-md left-md bg-tertiary text-on-tertiary px-md py-xs rounded-full text-label-sm font-bold">Most Loved</div>
            </div>
            <div className="p-md flex flex-col flex-grow">
              <h3 className="font-headline-md text-[20px] mb-sm">Sponsor a Child's Education</h3>
              <p className="text-body-md text-on-surface-variant mb-lg line-clamp-3">Provide monthly food, education, and healthcare to an orphan in need.</p>
              <div className="mt-auto">
                <div className="flex justify-between mb-xs">
                  <span className="text-label-sm font-bold text-secondary">£45,000 raised</span>
                  <span className="text-label-sm text-on-surface-variant">90%</span>
                </div>
                <div className="h-2 w-full bg-outline-variant/30 rounded-full mb-lg">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '90%' }}></div>
                </div>
                <button className="w-full bg-secondary text-on-secondary py-sm rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-xs">
                  Donate
                  <span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Food Packs Card */}
          <div className="group bg-surface rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(30,41,59,0.05)] hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="relative h-48">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Warehouse food relief packages" src="/images/campaign_food.png" />
              <div className="absolute top-md left-md bg-on-secondary-fixed-variant text-on-secondary-fixed px-md py-xs rounded-full text-label-sm font-bold">Food Security</div>
            </div>
            <div className="p-md flex flex-col flex-grow">
              <h3 className="font-headline-md text-[20px] mb-sm">Winter Food & Blanket Packs</h3>
              <p className="text-body-md text-on-surface-variant mb-lg line-clamp-3">Nutritious food supplies and warm bedding for families during the harsh winter months.</p>
              <div className="mt-auto">
                <div className="flex justify-between mb-xs">
                  <span className="text-label-sm font-bold text-secondary">£22,100 raised</span>
                  <span className="text-label-sm text-on-surface-variant">61%</span>
                </div>
                <div className="h-2 w-full bg-outline-variant/30 rounded-full mb-lg">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '61%' }}></div>
                </div>
                <button className="w-full bg-secondary text-on-secondary py-sm rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-xs">
                  Donate
                  <span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
