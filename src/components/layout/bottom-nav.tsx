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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
