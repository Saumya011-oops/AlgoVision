import React from 'react';
import { NavLink } from 'react-router-dom';
import { Network, ArrowUpDown, Database, Type, Layers } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const CATEGORIES = [
  {
    name: 'Sorting',
    icon: <ArrowUpDown className="w-4 h-4" />,
    items: [
      { id: 'quick-sort', name: 'Quick Sort' },
      { id: 'merge-sort', name: 'Merge Sort' },
    ]
  },
  {
    name: 'Graph Algorithms',
    icon: <Network className="w-4 h-4" />,
    items: [
      { id: 'dijkstra', name: "Dijkstra's" },
    ]
  },
  {
    name: 'Dynamic Programming',
    icon: <Layers className="w-4 h-4" />,
    items: [
      { id: 'fibonacci-dp', name: 'Fibonacci DP' },
    ]
  },
  {
    name: 'String Algorithms',
    icon: <Type className="w-4 h-4" />,
    items: [
      { id: 'kmp', name: 'KMP Search' },
    ]
  },
];

export const Sidebar = React.memo(() => {
  return (
    <aside className="w-64 border-r border-surface bg-panel/30 flex flex-col h-full overflow-y-auto hidden md:flex">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Algorithm Categories
        </h2>
        
        <div className="space-y-6">
          {CATEGORIES.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-white px-2">
                <span className="text-brand-light">{category.icon}</span>
                {category.name}
              </div>
              <ul className="space-y-1">
                {category.items.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={`/dashboard?algo=${item.id}`}
                      className={() => twMerge(
                        clsx(
                          "block px-4 py-2 text-sm rounded-lg transition-colors border border-transparent",
                          window.location.search.includes(`algo=${item.id}`)
                            ? "bg-brand/10 text-brand-light font-medium border-brand/20"
                            : "text-text-secondary hover:text-white hover:bg-surface/50"
                        )
                      )}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
});
Sidebar.displayName = 'Sidebar';
