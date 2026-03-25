import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowRightLeft, ArrowUpDown, Layers, Network, Type, ChevronRight, Menu, Search } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useComparisonStore } from '../../store/comparisonStore';
import { ALGORITHM_CATEGORIES } from '../../data/algorithmCatalog';

const categoryIcons: Record<string, React.ReactNode> = {
  sorting: <ArrowUpDown className="w-4 h-4" />,
  graph: <Network className="w-4 h-4" />,
  dp: <Layers className="w-4 h-4" />,
  string: <Type className="w-4 h-4" />,
  search: <Search className="w-4 h-4" />,
};

export const Sidebar = React.memo(() => {
  const location = useLocation();
  const { isComparisonMode, toggleComparisonMode } = useComparisonStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname, location.search]);

  return (
    <>
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden absolute top-3 left-4 z-40 p-2 bg-surface text-text-primary rounded-lg border border-surface shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={twMerge(
          "fixed md:absolute left-0 top-16 md:top-0 h-[calc(100vh-4rem)] md:h-full z-50 transition-all duration-300 ease-in-out border-r border-surface bg-panel/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden",
          isHovered || isMobileOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-3"
        )}
      >
        {/* Helper visual for the hover area when collapsed */}
        <div className={clsx(
          "absolute inset-y-0 right-0 w-1 bg-brand/30 transition-opacity flex items-center justify-center",
          isHovered || isMobileOpen ? "opacity-0" : "opacity-100"
        )}>
           <ChevronRight className="w-3 h-3 text-brand" />
        </div>

      <div className={clsx("p-4 w-64 h-full overflow-y-auto transition-opacity duration-200", isHovered || isMobileOpen ? "opacity-100" : "md:opacity-0")}>
        <button
          onClick={toggleComparisonMode}
          className={clsx(
            'mb-4 flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all',
            isComparisonMode
              ? 'border-brand/30 bg-brand/20 text-brand-light shadow-[0_0_12px_rgba(139,92,246,0.2)]'
              : 'border-surface bg-surface/40 text-text-secondary hover:bg-surface/60 hover:text-text-primary'
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
              <div className="flex items-center gap-2 px-2 text-sm font-medium text-text-primary">
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
                              : 'text-text-secondary hover:bg-surface/50 hover:text-text-primary'
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
    </>
  );
});

Sidebar.displayName = 'Sidebar';
