// Web 2.0 Era - AJAX, Gradients, Social Web

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Web2Era() {
  const [activeTab, setActiveTab] = useState('profile');
  const [items, setItems] = useState(['AJAX', 'jQuery', 'Web 2.0', 'Social']);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (item: string) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, targetItem: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetItem) {
      const newItems = [...items];
      const draggedIdx = newItems.indexOf(draggedItem);
      const targetIdx = newItems.indexOf(targetItem);
      
      newItems.splice(draggedIdx, 1);
      newItems.splice(targetIdx, 0, draggedItem);
      
      setItems(newItems);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg"
        >
          WEB 2.0
        </h1>
        <p className="text-xl text-white/80">
          2004 - 2010
        </p>
      </motion.div>

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        {/* Tabs */}
        <div className="flex border-b"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          {['profile', 'dashboard', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 text-white font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-4"
                >
                  <div className="flex items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg"
                    />
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white">Web 2.0 User</h3>
                      <p className="text-white/70">@web2enthusiast</p>
                    </div>
                  </div>
                  
                  <p className="text-white/80">
                    The era of user-generated content, social networks, and rich internet applications.
                  </p>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="space-y-4"
                >
                  <p className="text-white/80 mb-4">Drag to reorder:</p>
                  
                  {items.map((item) => (
                    <div
                      key={item}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      onDragOver={(e) => handleDragOver(e, item)}
                      className="p-4 rounded-lg cursor-move"
                      style={{
                        background: 'linear-gradient(180deg, #fff 0%, #eee 100%)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                        border: '1px solid #ccc',
                      }}
                    >
                      <span className="font-bold text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4"
                >
                  {['Notifications', 'Privacy', 'Theme'].map((setting) => (
                    <div key={setting} className="flex justify-between items-center"
                    >
                      <span className="text-white">{setting}</span>
                      
                      <div className="w-12 h-6 rounded-full bg-green-400 relative cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white absolute right-0.5 top-0.5 shadow"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Feature Pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        {['AJAX', 'JSON', 'REST APIs', 'Mashups', 'Cloud', 'SaaS'].map((feature) => (
          <span
            key={feature}
            className="px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)',
              border: '1px solid rgba(255,255,255,0.5)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {feature}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
