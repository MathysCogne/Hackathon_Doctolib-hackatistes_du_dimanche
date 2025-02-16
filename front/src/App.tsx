import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
          <AppSidebar />
          <main className="transition-all duration-300 p-4 pl-72">
            <div className="max-w-[1400px] mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
