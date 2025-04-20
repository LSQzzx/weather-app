import React from 'react';

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Card({ title, className, children }: CardProps) {
  return (
    <div className={`bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}