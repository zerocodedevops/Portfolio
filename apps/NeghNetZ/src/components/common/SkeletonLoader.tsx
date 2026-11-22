import type { CSSProperties } from 'react';

export const SkeletonCard = () => (
  <div className="animate-pulse rounded-lg bg-white p-4 shadow dark:bg-gray-800">
    <div className="mb-4 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
    <div className="mb-2 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
    <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
  </div>
);

interface SkeletonTableProps {
  rows?: number;
}

export const SkeletonTable = ({ rows = 5 }: SkeletonTableProps) => (
  <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
    {Array.from({ length: rows }, (_, index) => (
      <div
        key={index}
        className="flex animate-pulse items-center border-b border-gray-200 p-4 dark:border-gray-700"
      >
        <div className="mr-4 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    ))}
  </div>
);

interface SkeletonTextProps {
  lines?: number;
}

export const SkeletonText = ({ lines = 3 }: SkeletonTextProps) => (
  <div className="animate-pulse space-y-2">
    {Array.from({ length: lines }, (_, index) => (
      <div
        key={index}
        className="h-4 rounded bg-gray-200 dark:bg-gray-700"
        style={{ width: `${100 - index * 10}%` } satisfies CSSProperties}
      />
    ))}
  </div>
);

type SkeletonAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface SkeletonAvatarProps {
  size?: SkeletonAvatarSize;
}

const avatarSizes: Record<SkeletonAvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20',
};

export const SkeletonAvatar = ({ size = 'md' }: SkeletonAvatarProps) => (
  <div className={`${avatarSizes[size]} animate-pulse rounded-full bg-gray-200 dark:bg-gray-700`} />
);

export default { SkeletonCard, SkeletonTable, SkeletonText, SkeletonAvatar };
