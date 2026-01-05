
import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, Eye, Cookie, Bell } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const { settings } = useApp();

  useEffect(() => {
    document.title = `Privacy Policy | ${settings.site_name}`;
    window.scrollTo(0, 0);
  }, [settings.site_name]);

  // Fix: Explicitly typing Section with React.FC and props to ensure children are correctly handled by TypeScript
  const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 text-lg">
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen pb-20">
      <div className="bg-gray-50 dark:bg-gray-800/50 py-20 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Last Updated: {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-16">
        {/* Fix: Using Section with typed children */}
        <Section icon={<Shield size={20} />} title="Introduction">
          <p>
            Welcome to {settings.site_name}. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </Section>

        {/* Fix: Using Section with typed children */}
        <Section icon={<Lock size={20} />} title="The Data We Collect">
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data:</strong> includes first name, last name, or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes email address (collected via newsletter subscription).</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
          </ul>
        </Section>

        {/* Fix: Using Section with typed children */}
        <Section icon={<Eye size={20} />} title="Google AdSense & Third-Party Advertising">
          <p>
            We use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
          </p>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
          </p>
        </Section>

        {/* Fix: Using Section with typed children */}
        <Section icon={<Cookie size={20} />} title="Cookies">
          <p>
            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
          </p>
        </Section>

        {/* Fix: Using Section with typed children */}
        <Section icon={<Bell size={20} />} title="Changes to this Policy">
          <p>
            We keep our privacy policy under regular review. Any changes we may make to our privacy policy in the future will be posted on this page and, where appropriate, notified to you by email.
          </p>
        </Section>
        
        <div className="mt-20 p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Questions?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">If you have any questions about this privacy policy, please contact our support team.</p>
          <a href="/contact" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};
