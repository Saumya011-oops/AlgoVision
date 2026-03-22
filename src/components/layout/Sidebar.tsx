import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowRightLeft, ArrowUpDown, Layers, Network, Type } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useComparisonStore } from '../../store/comparisonStore';
import { ALGORITHM_CATEGORIES } from '../../data/algorithmCatalog';

const categoryIcons = {
  sorting: <ArrowUpDown className="w-4 h-4" />,
  graph: <Network className="w-4 h-4" />,
  dp: <Layers className="w-4 h-4" />,
  string: <Type className="w-4 h-4" />,
};

export const Sidebar = React.memo(() => {
  const location = useLocation();
  const { isComparisonMode, toggleComparisonMode } = useComparisonStore();

  return (
    <aside className="hidden h-full w-64 overflow-y-auto border-r border-surface bg-panel/30 md:flex md:flex-col">
      <div className="p-4">
        <button
          onClick={toggleComparisonMode}
          className={clsx(
            'mb-4 flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all',
            isComparisonMode
              ? 'border-brand/30 bg-brand/20 text-brand-light shadow-[0_0_12px_rgba(139,92,246,0.2)]'
              : 'border-surface bg-surface/40 text-text-secondary hover:bg-surface/60 hover:text-white'
          )}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Comparison Mode
          <span
            className={clsx(
              'ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold uppercase',
              isComparisonMode ? 'bg-brand/30 text-brand-light' : 'bg-surface text-text-secondary'
            )}
          >
            {isComparisonMode ? 'On' : 'Off'}
          </span>
        </button>

        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Algorithm Categories
        </h2>

        <div className="space-y-6">
          {ALGORITHM_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center gap-2 px-2 text-sm font-medium text-white">
                <span className="text-brand-light">{categoryIcons[category.id]}</span>
                {category.name}
              </div>
              <ul className="space-y-1">
                {category.items.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={`/dashboard?algo=${item.id}`}
                      className={() =>
                        twMerge(
                          clsx(
                            'block rounded-lg border border-transparent px-4 py-2 text-sm transition-colors',
                            location.search.includes(`algo=${item.id}`)
                              ? 'border-brand/20 bg-brand/10 font-medium text-brand-light'
                              : 'text-text-secondary hover:bg-surface/50 hover:text-white'
                          )
                        )
                      }
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
