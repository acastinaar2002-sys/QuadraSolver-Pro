import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`glass rounded-2xl p-6 shadow-sm ${className}`}>
    {title && <h3 className="text-xl font-semibold mb-4 text-gray-900 tracking-tight">{title}</h3>}
    {children}
  </div>
);

export const Button: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-2.5 rounded-full font-medium transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-apple-blue text-white hover:bg-[#0062c3] shadow-md hover:shadow-lg",
    secondary: "bg-white text-apple-text border border-gray-200 hover:bg-gray-50",
    ghost: "text-apple-blue hover:bg-blue-50"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const InputGroup: React.FC<{ 
  label: string; 
  value: number; 
  onChange: (val: number) => void;
  color?: string 
}> = ({ label, value, onChange, color = "text-apple-blue" }) => (
  <div className="flex flex-col items-center">
    <label className={`text-sm font-bold mb-2 ${color}`}>{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-20 h-14 text-center text-2xl bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-apple-blue outline-none transition-all shadow-inner font-mono"
    />
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-gray-100 text-gray-600" }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${color}`}>
    {children}
  </span>
);