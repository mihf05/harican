import { Briefcase, Sparkles } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24 animate-pulse delay-75"></div>
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full opacity-50 animate-bounce delay-100"></div>
        <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-white rounded-full opacity-50 animate-bounce delay-200"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1 flex items-center gap-2">
                  Welcome back, {userName}!
                  <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
                </h1>
                <p className="text-blue-100 text-lg font-medium">
                  Manage and track your job postings with ease 📊
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick stats in header */}
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 shadow-lg">
              <p className="text-xs text-blue-100 font-medium mb-1">Today</p>
              <p className="text-2xl font-bold text-white">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
