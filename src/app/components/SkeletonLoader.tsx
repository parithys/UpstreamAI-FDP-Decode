import { cn } from '../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-background-secondary/50',
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-lg border border-card-border shadow-glow p-6">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card rounded-lg border border-card-border shadow-glow p-6">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-card-border">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 mb-3">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-card rounded-lg border border-card-border shadow-glow p-6">
      <Skeleton className="h-6 w-1/4 mb-6" />
      <div className="h-64 bg-background-secondary rounded-lg flex items-end justify-around gap-2 p-4">
        <Skeleton className="w-full h-3/4" />
        <Skeleton className="w-full h-2/3" />
        <Skeleton className="w-full h-4/5" />
        <Skeleton className="w-full h-1/2" />
        <Skeleton className="w-full h-5/6" />
        <Skeleton className="w-full h-2/3" />
      </div>
    </div>
  );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-lg border border-card-border shadow-glow p-4"
        >
          <Skeleton className="h-3 w-1/2 mb-3" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <SkeletonStats />
      <div className="grid grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable />
    </div>
  );
}
