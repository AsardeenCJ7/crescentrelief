const Navigation = () => {
  return (
    <nav className="bg-white border-b border-gray-100 w-full top-0 sticky z-50 shadow-sm transition-all">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-lg max-w-container-max mx-auto h-20">
        <div className="text-[28px] text-[#222222] font-extrabold tracking-tight flex items-center cursor-pointer">
          Crescent Relief
        </div>
        
        <div className="hidden md:flex gap-8 items-center ml-12">
          <a className="text-[#333333] hover:text-[#facc15] font-semibold text-[15px] transition-colors flex items-center gap-1 group" href="#">
            Services <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-[#facc15]">expand_more</span>
          </a>
          <a className="text-[#333333] hover:text-[#facc15] font-semibold text-[15px] transition-colors flex items-center gap-1 group" href="#">
            Impact <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-[#facc15]">expand_more</span>
          </a>
          <a className="text-[#333333] hover:text-[#facc15] font-semibold text-[15px] transition-colors" href="#">Volunteer</a>
          <a className="text-[#333333] hover:text-[#facc15] font-semibold text-[15px] transition-colors flex items-center gap-1 group" href="#">
            About Us <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-[#facc15]">expand_more</span>
          </a>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-[20px]">dark_mode</span>
          </button>
          <button className="bg-[#facc15] text-[#222222] px-6 py-2.5 rounded-full font-bold text-[15px] hover:bg-[#eab308] transition-colors shadow-sm">
            Donate Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
