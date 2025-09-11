/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {QRCodeSVG} from 'qrcode.react';

const Modal = ({ children, isOpen, onClose, titulo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{titulo}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4">
          {children} {/* Content passed as props */}
        </div>

        {/* Modal Footer (Optional) */}
        <div className="flex justify-end pt-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;