// Web 1.0 Era - Early HTML/CSS

import { useState } from 'react';
import { motion } from 'framer-motion';

export function Web1Era() {
  const [guestbookEntries, setGuestbookEntries] = useState([
    { name: 'WebMaster', message: 'Welcome to my site!', date: '1996-05-14' },
    { name: 'NetscapeUser', message: 'Cool page! Visit mine too.', date: '1996-06-02' },
  ]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
      setGuestbookEntries([
        ...guestbookEntries,
        { name, message, date: new Date().toISOString().split('T')[0] },
      ]);
      setName('');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8"
      style={{ 
        background: '#CCCCCC',
        fontFamily: 'Times New Roman, serif',
      }}
    >
      <div className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="border-4 border-double p-4 mb-4 overflow-hidden"
            style={{ borderColor: '#000080' }}
          >
            <div className="text-2xl text-blue-600 whitespace-nowrap animate-marquee"
            >
              ★ Welcome to My Home Page! ★ Best viewed in Netscape Navigator ★
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2"
            style={{ color: '#000080' }}
          >
            THE WEB 1.0 ERA
          </h1>
          
          <p className="text-sm"
            style={{ color: '#666' }}
          >
            1995 - 2004
          </p>
        </motion.div>

        {/* Under Construction */}
        <div className="text-center mb-8"
        >
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='40'%3E%3Crect fill='%23FF0000' width='200' height='40'/%3e%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-weight='bold'%3E🚧 UNDER CONSTRUCTION 🚧%3C/text%3E%3C/svg%3E"
            alt="Under Construction"
            className="mx-auto"
          />
        </div>

        {/* Main Content Table */}
        <table className="w-full border-2 mb-8"
          style={{ borderColor: '#000' }}
        >
          <tbody>
            <tr>
              {/* Left Sidebar */}
              <td className="w-1/4 p-4 align-top border-r-2"
                style={{ borderColor: '#000', background: '#999' }}
              >
                <h3 className="text-lg font-bold mb-4"
                  style={{ color: '#000080' }}
                >
                  Links
                </h3>
                
                <ul className="list-disc list-inside space-y-2"
                >
                  {['Home', 'About Me', 'My Projects', 'Cool Links', 'Guestbook'].map((link) => (
                    <li key={link}
                    >
                      <a href="#" className="text-blue-600 underline hover:text-red-600"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>

                <hr className="my-4 border-t-2" style={{ borderColor: '#000' }} />

                <h3 className="text-lg font-bold mb-4"
                  style={{ color: '#000080' }}
                >
                  Webrings
                </h3>
                
                <div className="text-center"
                >
                  <a href="#" className="text-blue-600">[Prev]</a>
                  <span className="mx-2">|</span>
                  <a href="#" className="text-blue-600">[Next]</a>
                </div>
              </td>

              {/* Main Content */}
              <td className="w-3/4 p-4 align-top"
                style={{ background: '#fff' }}
              >
                <h2 className="text-2xl font-bold mb-4"
                  style={{ color: '#000080' }}
                >
                  About This Era
                </h2>
                
                <p className="mb-4"
                >
                  The early web was a wild frontier. HTML tables ruled layout, 
                  CSS was barely a thing, and JavaScript was just starting to 
                  add interactivity.
                </p>

                <div className="border-2 p-4 mb-4"
                  style={{ borderColor: '#000080' }}
                >
                  <h3 className="text-xl font-bold mb-2"
                  >
                    📝 Sign My Guestbook!
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-2"
                  >
                    <div>
                      <label className="block text-sm">Name:</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-2 p-1"
                        style={{ borderColor: '#000' }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm">Message:</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border-2 p-1"
                        style={{ borderColor: '#000' }}
                        rows={3}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="px-4 py-1 border-2 hover:bg-gray-200"
                      style={{ borderColor: '#000' }}
                    >
                      Submit Entry
                    </button>
                  </form>
                </div>

                <h3 className="text-lg font-bold mb-2">Previous Entries:</h3>
                
                <table className="w-full border"
                >
                  <tbody>
                    {guestbookEntries.map((entry, idx) => (
                      <tr key={idx} className="border-b"
                      >
                        <td className="p-2 border-r">
                          <strong>{entry.name}</strong>
                          <br />
                          <small>{entry.date}</small>
                        </td>
                        <td className="p-2">{entry.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="text-center text-sm"
          style={{ color: '#666' }}
        >
          <p>
            You are visitor number: <span className="font-mono text-red-600">000{guestbookEntries.length + 42}</span>
          </p>
          
          <p>Best viewed at 800x600 resolution</p>
          
          <p className="mt-4">
            <a href="mailto:webmaster@example.com" className="text-blue-600 underline">
              Email the Webmaster
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
