import { CallsList } from '@/components/calls/CallsList';

export function Home() {
  return (
    <main className="h-screen overflow-auto py-8">
      <div className="space-y-12">
        <header className="flex items-center justify-between px-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Emergency Calls
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Real-time emergency response management
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-100">
            <div className="relative flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            </div>
            <span className="text-sm font-medium text-green-700">Live Updates</span>
          </div>
        </header>
        
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-gray-50/20 pointer-events-none" />
            <CallsList />
          </div>
        </div>
      </div>
    </main>
  );
} 