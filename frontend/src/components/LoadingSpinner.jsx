import React from 'react';

const LoadingSpinner = ({ label = 'Loading...', fullPage = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${fullPage ? 'min-h-[60vh]' : 'py-10'}`}>
      <div className="w-10 h-10 border-4 border-secondary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-textDark/60">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
