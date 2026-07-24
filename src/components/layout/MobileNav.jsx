const MobileNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden bg-surface shadow-[0_-4px_20px_rgba(30,41,59,0.05)] rounded-t-xl border-t border-outline-variant/20">
      <div className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1">
        <span className="material-symbols-outlined" data-icon="home" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        <span className="font-label-sm text-label-sm">Home</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined" data-icon="volunteer_activism">volunteer_activism</span>
        <span className="font-label-sm text-label-sm">Donate</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
        <span className="font-label-sm text-label-sm">Impact</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined" data-icon="person">person</span>
        <span className="font-label-sm text-label-sm">Profile</span>
      </div>
    </div>
  );
};

export default MobileNav;
