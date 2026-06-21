import React, { useState, useEffect } from 'react';
import appContent from '../data/app_content.json';

const Checklist = () => {
  const [checklistState, setChecklistState] = useState(() => {
    const saved = localStorage.getItem('eh_checklist');
    if (saved) return JSON.parse(saved);
    
    // Initialize with all items from appContent
    const initialState = {};
    appContent.checklist.forEach(category => {
      category.items.forEach(item => {
        initialState[item.task] = false;
      });
    });
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('eh_checklist', JSON.stringify(checklistState));
  }, [checklistState]);

  const toggleItem = (task) => {
    setChecklistState(prev => ({
      ...prev,
      [task]: !prev[task]
    }));
  };

  const resetChecklist = () => {
    const resetState = {};
    Object.keys(checklistState).forEach(key => {
      resetState[key] = false;
    });
    setChecklistState(resetState);
  };

  const totalItems = Object.keys(checklistState).length;
  const completedItems = Object.values(checklistState).filter(Boolean).length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <section id="checklist" className="px-4 py-16 bg-gradient-to-b from-warm-50 to-white">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-warm-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-semibold text-brand-800 mt-1">Empire HomePath Readiness Checklist</h2>
            </div>
            <span className="text-sm text-warm-400 font-medium">
              {completedItems}/{totalItems} done
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-warm-200 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="space-y-8">
            {appContent.checklist.map((category, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-bold text-warm-400 uppercase tracking-widest mb-4">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="group">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative flex items-center mt-0.5">
                          <input 
                            type="checkbox" 
                            checked={checklistState[item.task] || false}
                            onChange={() => toggleItem(item.task)}
                            className="peer sr-only"
                          />
                          <div className={`w-6 h-6 rounded-md border-2 transition-colors flex items-center justify-center
                            ${checklistState[item.task] 
                              ? 'bg-brand-500 border-brand-500' 
                              : 'border-warm-300 group-hover:border-brand-400'}`}>
                            {checklistState[item.task] && (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className={`text-base font-medium transition-colors ${checklistState[item.task] ? 'text-warm-800' : 'text-warm-600'}`}>
                            {item.task}
                          </span>
                          <p className="text-sm text-warm-400 mt-1 leading-relaxed">
                            {item.details}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={resetChecklist}
            className="mt-10 text-sm text-warm-400 hover:text-warm-600 underline transition-colors underline-offset-4"
          >
            Reset my progress
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checklist;
