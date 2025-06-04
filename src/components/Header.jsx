import React from 'react';
import { Phone, Github } from 'lucide-react';
import logo from '../assets/logo_icon.png';

function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 bg-primary text-background px-4 py-2 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center min-w-0 gap-2 flex-grow overflow-hidden">
          <img src={logo} alt="Logo" style={{ width: 40, height: 40, flexShrink: 0 }} />
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-lg truncate">Wuffchat</span>
            <span className="text-sm text-background/80 truncate">Der direkte Draht zu deinem Hund.</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/kemperfekt" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="text-background/80 hover:text-background transition" size={22} />
          </a>
          <a href="tel:+491713022065" aria-label="Anrufen">
            <Phone className="text-background/80 hover:text-background transition" size={22} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;
