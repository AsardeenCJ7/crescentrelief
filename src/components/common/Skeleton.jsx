const Skeleton = ({ className = "" }) => (
  <div className={`skeleton ${className}`} />
);

export const CampaignCardSkeleton = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-border-light">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-4 w-20 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-2 w-full rounded-full mt-4" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-full mt-2" />
    </div>
  </div>
);

export default Skeleton;
