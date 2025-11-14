export default function Footer() {
  return (
    <footer className="w-full border-t dark:border-neutral-800 border-neutral-200 bg-white dark:bg-gray-400 flex">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex items-center gap-1">
          <img 
            src="/Arcane_Logo.png" 
            alt="Arcane Team Logo" 
            className="h-[30px] w-auto object-contain" 
          />
          <span className="text-[12px] font-medium text-gray-700 dark:text-black-200">
            AUST X UIU X EWU
          </span>
        </div>
      </div>
    </footer>
  );
}
