import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
  className?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  value, 
  size = 200, 
  title = "QR Code",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {title && (
        <div className="text-lg font-heading font-semibold text-neutral-700 text-center">
          {title}
        </div>
      )}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <QRCode
          value={value}
          size={size}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
      </div>
      <div className="text-xs text-neutral-500 font-body text-center max-w-xs break-all">
        {value}
      </div>
    </div>
  );
};

export default QRCodeDisplay;