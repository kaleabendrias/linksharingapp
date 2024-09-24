import React, { useEffect } from 'react';

interface PopupProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm w-full">
        <p className="text-center text-gray-800">{message}</p>
      </div>
    </div>
  );
};

export default Popup;