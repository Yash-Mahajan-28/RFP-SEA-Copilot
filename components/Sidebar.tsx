'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  BarChart3, 
  Settings,
  Info,
  Activity,
  FileText,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Discovery', icon: Search, path: '/discovery' },
  { name: 'Catalog', icon: BookOpen, path: '/catalog' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Agent Chat', icon: MessageSquare, path: '/test-agents' },
  { name: 'Logs', icon: Activity, path: '/logs' },
  { name: 'Reports', icon: FileText, path: '/reports' },
  { name: 'Settings', icon: Settings, path: '/settings' },
  { name: 'About', icon: Info, path: '/about' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-48 bg-[#0a1929] h-screen fixed left-0 top-0 text-white">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2 border-b border-gray-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">R</span>
        </div>
        <span className="font-semibold text-lg">RFP-Copilot</span>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-600 transition-colors ${
                isActive ? 'bg-blue-600 border-r-2 border-blue-400' : ''
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
