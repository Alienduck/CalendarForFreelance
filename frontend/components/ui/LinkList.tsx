import { ExternalLink } from "lucide-react";

interface LinkItem {
  title: string;
  url: string;
  icon?: string;
}

export function LinkList({ links }: { links: LinkItem[] }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto mb-10">
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all duration-200 group"
        >
          <span className="font-medium text-slate-700">{link.title}</span>
          <ExternalLink
            size={18}
            className="text-slate-400 group-hover:text-slate-600"
          />
        </a>
      ))}
    </div>
  );
}