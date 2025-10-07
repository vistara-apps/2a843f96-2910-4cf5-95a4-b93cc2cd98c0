'use client';

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

export function SkeletonCard({ className = '', lines = 3, showAvatar = false }: SkeletonCardProps) {
  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="flex items-start gap-4">
        {showAvatar && (
          <div className="w-12 h-12 skeleton rounded-full flex-shrink-0" />
        )}
        <div className="flex-1 space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`skeleton h-4 rounded ${
                index === 0 ? 'w-3/4' : index === lines - 1 ? 'w-1/2' : 'w-full'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}