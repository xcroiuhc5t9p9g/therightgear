import React from 'react';

/**
 * Shared layout container for The Right Gear
 * Implements the standard max-width and fluid horizontal padding
 */
export const Container: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 ${className}`}>
    {children}
  </div>
);

export const HeroBlock: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <section className="bg-white border-b border-trg-gray-200 py-20">
    <Container className="text-center flex flex-col items-center">
      <h1 className="text-fluid-h1 font-bold text-trg-carbon mb-6 tracking-tight max-w-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-trg-gray-500 max-w-2xl mb-10 leading-relaxed max-w-prose-trg">
          {subtitle}
        </p>
      )}
      {action && <div>{action}</div>}
    </Container>
  </section>
);

export const SimplePageHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}> = ({ title, subtitle }) => (
  <section className="bg-white border-b border-trg-gray-200 py-10">
    <Container className="flex flex-col items-start">
      <h1 className="text-3xl md:text-4xl font-bold text-trg-carbon mb-3 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-trg-gray-500 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </Container>
  </section>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
    <div>
      <h2 className="text-fluid-h2 font-bold text-trg-carbon tracking-tight mb-2">{title}</h2>
      {subtitle && <p className="text-trg-gray-500 max-w-prose-trg">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const ContentCard: React.FC<{
  title: string;
  description?: string;
  image?: string;
  tag?: string;
  onClick?: () => void;
}> = ({ title, description, image, tag, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white border border-trg-gray-200 rounded-xl overflow-hidden hover:border-trg-gray-300 hover:shadow-sm transition-all group flex flex-col h-full ${onClick ? 'cursor-pointer' : ''}`}
  >
    {image ? (
      <div className="w-full aspect-[4/3] bg-trg-gray-100 overflow-hidden relative">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
    ) : (
      <div className="w-full aspect-[4/3] bg-trg-gray-50 border-b border-trg-gray-100 flex items-center justify-center">
        <span className="text-trg-gray-300 font-medium">No Image</span>
      </div>
    )}
    <div className="p-6 flex flex-col flex-grow">
      {tag && <span className="text-xs font-bold uppercase tracking-wider text-trg-gray-400 mb-2">{tag}</span>}
      <h3 className="text-lg font-bold text-trg-carbon mb-2 leading-tight">{title}</h3>
      {description && <p className="text-sm text-trg-gray-500 line-clamp-3">{description}</p>}
    </div>
  </div>
);

export const EmptyStatePanel: React.FC<{ title: string; description: string; action?: React.ReactNode; icon?: React.ReactNode }> = ({ title, description, action, icon }) => (
  <div className="bg-trg-warm-white border border-trg-gray-200 rounded-xl p-10 md:p-12 flex flex-col items-center justify-center text-center w-full">
    {icon && <div className="text-trg-gray-400 mb-4">{icon}</div>}
    <h3 className="text-xl font-bold text-trg-carbon mb-3">{title}</h3>
    <p className="text-trg-gray-500 max-w-prose-trg mb-6">{description}</p>
    {action && <div>{action}</div>}
  </div>
);

export const CTABlock: React.FC<{ title: string; subtitle?: string; buttonText: string; onClick: () => void }> = ({ title, subtitle, buttonText, onClick }) => (
  <section className="bg-trg-warm-white border-t border-b border-trg-gray-200 py-24">
    <Container className="text-center flex flex-col items-center">
      <h2 className="text-fluid-h2 font-bold text-trg-carbon mb-4 tracking-tight">{title}</h2>
      {subtitle && <p className="text-lg text-trg-gray-500 mb-8 max-w-prose-trg">{subtitle}</p>}
      <button onClick={onClick} className="px-8 py-3 bg-trg-carbon text-white font-bold rounded-lg hover:bg-trg-gray-700 transition-colors min-h-[44px]">
        {buttonText}
      </button>
    </Container>
  </section>
);
