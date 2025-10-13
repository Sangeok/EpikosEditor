"use client";

import React from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children, title }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
        {title && (
          <div className="px-6 py-4 border-b border-zinc-700">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;