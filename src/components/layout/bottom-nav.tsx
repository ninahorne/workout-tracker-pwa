'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CalendarIcon as CalendarIconSolid,
} from '@heroicons/react/24/solid';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, iconSolid: HomeIconSolid },
  {
    name: 'Workouts',
    href: '/workouts',
    icon: ClipboardDocumentListIcon,
    iconSolid: ClipboardDocumentListIconSolid,
  },
  {
    name: 'Exercises',
    href: '/exercises',
    icon: AcademicCapIcon,
    iconSolid: AcademicCapIconSolid,
  },
  {
    name: 'History',
    href: '/history',
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
  },
  {
    name: 'Schedule',
    href: '/schedule',
    icon: CalendarIcon,
    iconSolid: CalendarIconSolid,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-50">
      <div className="grid grid-cols-5 h-20">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 border-r-4 border-black last:border-r-0 transition-all duration-75 ${
                isActive
                  ? 'bg-yellow-400 text-black font-black'
                  : 'text-black hover:bg-gray-100 font-bold'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-bold uppercase">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
