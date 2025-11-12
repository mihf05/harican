import { ArrowRight } from "lucide-react";

const announcement = {
  href: "/jobs",
  title: "AI Career Matching",
  badge: "New"
};

function NewItemsLoading() {
  return (
    <>
      <a
        href={announcement?.href}
        className="inline-flex justify-center w-fit mx-auto items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-4 dark:border-neutral-800 border-neutral-200 shadow-lg py-0.5 pl-0.5 pr-3 text-xs hover:shadow-xl transition-shadow"
      >
        <div className="rounded-full bg-white px-2 py-1 text-xs text-blue-700 font-semibold">
          {announcement.badge}
        </div>
        <p className="text-white sm:text-base text-xs inline-block">
          🚀 Launching
          <span className="px-1 font-semibold">{announcement.title}</span>
        </p>

        <ArrowRight className="h-3 w-3 text-white" />
      </a>
    </>
  );
}

export default NewItemsLoading;
