import { Briefcase } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    full_name: string;
    job_title: string;
    bio: string;
    avatar_url: string;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <img
          src={user.avatar_url || "https://github.com/shadcn.png"}
          alt={user.full_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{user.full_name}</h1>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-1">
          <Briefcase size={16} />
          <span>{user.job_title}</span>
        </div>
      </div>
      <p className="text-slate-600 max-w-md">{user.bio}</p>
    </div>
  );
}
