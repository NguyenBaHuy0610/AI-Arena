import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-[#D99A16] bg-[#2A2A2A] border border-[#D99A16]/30 shadow-sm'
        : 'text-[#F5F0E6]/80 hover:text-[#F5F0E6] hover:bg-[#2A2A2A]/50'
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#1B1B1B]/90 border-b border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-2xl filter drop-shadow">🇻🇳</span>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#F5F0E6] tracking-wide group-hover:text-[#D99A16] transition-colors">
                Việt Phục <span className="text-[#D99A16]">AI Arena</span>
              </span>
              <span className="text-[10px] text-[#F5F0E6]/50 uppercase tracking-widest -mt-1 font-mono">
                Di Sản & AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Giới thiệu
            </NavLink>
            <NavLink to="/builder" className={navLinkClass}>
              Phối đồ & Chấm điểm
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#F5F0E6]/80 hover:text-[#F5F0E6] hover:bg-[#2A2A2A] focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#333333] bg-[#222222] px-4 pt-2 pb-4 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#F5F0E6] hover:bg-[#2A2A2A]"
          >
            Giới thiệu
          </NavLink>
          <NavLink
            to="/builder"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#F5F0E6] hover:bg-[#2A2A2A]"
          >
            Phối đồ & Chấm điểm
          </NavLink>
        </div>
      )}
    </header>
  );
}
