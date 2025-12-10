import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch("https://formspree.io/f/mzznjbpg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Form submission error", error);
      setStatus('error');
    }
  };

  return (
    <div className="py-16 container mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Get In Touch</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">We'd love to hear from you. Whether you have a question about features, trials, pricing, or need a demo, our team is ready to answer all your questions.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700" id="contact-form">
           {status === 'success' ? (
             <div className="h-full flex flex-col items-center justify-center text-center p-8">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl">✓</div>
               <h3 className="text-xl font-bold mb-2 dark:text-white">Message Sent!</h3>
               <p className="text-gray-600 dark:text-gray-300">Thanks for reaching out. We'll get back to you shortly.</p>
               <button onClick={() => setStatus('idle')} className="mt-6 text-[var(--primary)] underline">Send another</button>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                 <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
                 <input
                   required
                   type="text"
                   name="name"
                   className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white"
                   placeholder="Your full name"
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   disabled={status === 'submitting'}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                 <input
                   required
                   type="email"
                   name="email"
                   className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:text-white"
                   placeholder="you@company.com"
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   disabled={status === 'submitting'}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1 dark:text-gray-300">Message</label>
                 <textarea
                   required
                   name="message"
                   className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all resize-none dark:bg-gray-700 dark:text-white"
                   placeholder="Tell us what you need help with..."
                   value={formData.message}
                   onChange={e => setFormData({...formData, message: e.target.value})}
                   disabled={status === 'submitting'}
                 ></textarea>
               </div>
               
               {status === 'error' && (
                 <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                   Something went wrong. Please try again later.
                 </div>
               )}

               <button 
                 type="submit" 
                 disabled={status === 'submitting'}
                 className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-lg hover:opacity-90 shadow-lg shadow-[var(--primary)]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
               >
                 {status === 'submitting' ? (
                   <span className="flex items-center gap-2">
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Sending...
                   </span>
                 ) : "Send Message"}
               </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};