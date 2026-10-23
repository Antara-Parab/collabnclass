import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  badge?: string;
  accent?: 'cyan' | 'blue' | 'amber' | 'purple';
  handleClick?: () => void;
}

const accentConfigs = {
  cyan: {
    border: 'hover:border-cyan-400/50',
    glow: 'group-hover:shadow-[0_0_35px_rgba(0,229,255,0.22)]',
    tagColor: 'text-cyan-400',
    iconBg: 'bg-cyan-950/70 border-cyan-500/30 text-cyan-400',
    orbBg: 'bg-cyan-500/20',
    topSweep: 'rgba(0,229,255,0.45)',
    arrowColor: 'text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30',
  },
  blue: {
    border: 'hover:border-sky-400/50',
    glow: 'group-hover:shadow-[0_0_35px_rgba(2,132,199,0.22)]',
    tagColor: 'text-sky-400',
    iconBg: 'bg-sky-950/70 border-sky-500/30 text-sky-400',
    orbBg: 'bg-sky-500/20',
    topSweep: 'rgba(2,132,199,0.45)',
    arrowColor: 'text-sky-400 group-hover:bg-sky-500/10 group-hover:border-sky-500/30',
  },
  amber: {
    border: 'hover:border-amber-400/50',
    glow: 'group-hover:shadow-[0_0_35px_rgba(245,158,11,0.22)]',
    tagColor: 'text-amber-400',
    iconBg: 'bg-amber-950/70 border-amber-500/30 text-amber-400',
    orbBg: 'bg-amber-500/20',
    topSweep: 'rgba(245,158,11,0.45)',
    arrowColor: 'text-amber-400 group-hover:bg-amber-500/10 group-hover:border-amber-500/30',
  },
  purple: {
    border: 'hover:border-purple-400/50',
    glow: 'group-hover:shadow-[0_0_35px_rgba(168,85,247,0.22)]',
    tagColor: 'text-purple-400',
    iconBg: 'bg-purple-950/70 border-purple-500/30 text-purple-400',
    orbBg: 'bg-purple-500/20',
    topSweep: 'rgba(168,85,247,0.45)',
    arrowColor: 'text-purple-400 group-hover:bg-purple-500/10 group-hover:border-purple-500/30',
  },
};

const HomeCard = ({
  className,
  img,
  title,
  description,
  badge,
  accent = 'cyan',
  handleClick,
}: HomeCardProps) => {
  const config = accentConfigs[accent] || accentConfigs.cyan;

  return (
    <section
      className={cn(
        'p-6 sm:p-7 flex flex-col justify-between w-full min-h-[220px] sm:min-h-[235px] rounded-2xl sm:rounded-[24px] cursor-pointer group relative overflow-hidden transition-all duration-300',
        'border border-[rgba(0,180,255,0.16)] backdrop-blur-xl',
        'hover:-translate-y-1.5 active:scale-[0.99]',
        config.border,
        config.glow,
        className
      )}
      onClick={handleClick}
      style={{
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      }}
    >
      {/* Top edge neon sweep */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${config.topSweep}, transparent)`,
        }}
      />

      {/* Ambient background glow orb */}
      <div
        className={cn(
          'absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
          config.orbBg
        )}
      />

      {/* Top row: Anchor Icon on far left, Action Arrow on far right */}
      <div className="flex items-center justify-between relative z-10 w-full">
        <div
          className={cn(
            'size-13 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0',
            config.iconBg
          )}
        >
          <img src={img} alt="card-icon" width={24} height={24} className="brightness-0 invert opacity-95" />
        </div>

        <div
          className={cn(
            'size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200',
            config.arrowColor
          )}
        >
          <ArrowUpRight className="size-4" />
        </div>
      </div>

      {/* Content: Clean visual hierarchy with category tag, title, and description */}
      <div className="flex flex-col gap-1.5 relative z-10 mt-6">
        {badge && (
          <span
            className={cn(
              'text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest block leading-none',
              config.tagColor
            )}
          >
            {badge}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors duration-200">
          {title}
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors duration-200 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom edge glow on hover */}
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.4), transparent)' }}
      />
    </section>
  );
};

export default HomeCard;
