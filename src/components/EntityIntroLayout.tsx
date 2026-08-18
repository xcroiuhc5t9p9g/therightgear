import React from 'react';

interface EntityIntroLayoutProps {
  /** Breadcrumb navigation area (e.g. Home > Brands > Honda) */
  breadcrumb?: React.ReactNode;
  
  /** Entity identity area (e.g. Roles, Category, Maker, Type, H1 Title, descriptor) */
  identity: React.ReactNode;
  
  /** Primary Media element (e.g. main photo, portrait) */
  primaryMedia: React.ReactNode;
  
  /** Content that follows media on mobile, but stays in the left column on desktop */
  content?: React.ReactNode;
}

/**
 * EntityIntroLayout
 * 
 * Reusable responsive layout primitive for The Right Gear.
 * 
 * GLOBAL MOBILE ORDER:
 * 1. Breadcrumb
 * 2. Entity identity (category, title, immediate descriptor)
 * 3. PRIMARY MEDIA
 * 4. Content (Overview, Key Facts)
 * 
 * Desktop rule:
 * Two-column layout: CONTENT / IDENTITY | PRIMARY MEDIA
 * Primary media remains visually secondary to knowledge content (approx 60/40 split).
 */
export const EntityIntroLayout: React.FC<EntityIntroLayoutProps> = ({
  breadcrumb,
  identity,
  primaryMedia,
  content
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-y-8 lg:gap-x-12 lg:gap-y-0 mb-20">
      {/* 1. Identity & Profile (Left on desktop, First on mobile) */}
      <div className="lg:col-start-1 lg:row-start-1 flex flex-col">
        {breadcrumb && <div className="mb-6">{breadcrumb}</div>}
        {identity}
      </div>
      
      {/* 2. Primary Media (Right on desktop, Second on mobile) */}
      <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
        <div>
          {primaryMedia}
        </div>
      </div>
      
      {/* 3. Content (Left on desktop, Third on mobile) */}
      {content && (
        <div className="lg:col-start-1 lg:row-start-2 pt-2 lg:pt-8">
          {content}
        </div>
      )}
    </div>
  );
};
