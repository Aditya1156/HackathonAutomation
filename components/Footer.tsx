import React from 'react';
import { TwitterIcon, GithubIcon, LinkedinIcon } from './IconComponents';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent border-t border-purple-500/20">
      <div className="container mx-auto px-6 py-8 text-slate-400">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="font-semibold text-white">&copy; {new Date().getFullYear()} Hackathon Fusion.</p>
            <p className="text-sm">Built with passion for innovators.</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="mailto:contact@hackfusion.com" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="flex space-x-4">
            <a href="https://x.com/hackfusion" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <TwitterIcon className="w-6 h-6 hover:text-cyan-400 transition-colors" />
            </a>
             <a href="https://github.com/hackfusion" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon className="w-6 h-6 hover:text-cyan-400 transition-colors" />
            </a>
             <a href="https://linkedin.com/company/hackfusion" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinIcon className="w-6 h-6 hover:text-cyan-400 transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;