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
    glow: 'group-hover:shadow-[0_0_35px_rgba(0,229,255,0.25)]',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    iconBg: 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400',
    orbBg: 'bg-cyan-500/20',
    topSweep: 'rgba(0,229,255,0.4)',
    arrowColor: 'text-cyan-400',
  },
  blue: {
    border: 'hover:border-sky-400/50',
    glow: 'group-hover:shadow-[0_0_35px_rgba(2,132,199,0.25)]',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    iconBg: 'bg-sky-950/60 border-sky-500/30 text-sky-400',
    orbBg: 'bg-sky-500/20',
    topSweep: 'rgba(2,132,199,0.4)',
    arrowColor: 'text-sky-400',
  },
  amber: {
    border: 'hover:border-amber-400/50',
    glow: 'group-hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-950/60 border-amber-500/30 text-amber-400',
    orbBg: 'bg-amber-500/20',
    topSweep: 'rgba(245,158,11,0.4)',
    arrowColor: 'text-amber-400',
  },
  purple: {
    border: 'hover:border-purple-400/50',
    glow: 'group-hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    iconBg: 'bg-purple-950/60 border-purple-500/30 text-purple-400',
    orbBg: 'bg-purple-500/20',
    topSweep: 'rgba(168,85,247,0.4)',
    arrowColor: 'text-purple-400',
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
        'p-5 sm:p-6 flex flex-col justify-between w-full min-h-[190px] sm:min-h-[220px] rounded-2xl sm:rounded-[22px] cursor-pointer group relative overflow-hidden transition-all duration-300',
        'border border-[rgba(0,180,255,0.15)] backdrop-blur-xl',
        'hover:-translate-y-1 active:scale-[0.99]',
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
          'absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
          config.orbBg
        )}
      />

      {/* Top row: Icon + Badge + Arrow */}
      <div className="flex items-start justify-between relative z-10 gap-2">
        <div
          className={cn(
            'size-12 sm:size-13 rounded-xl sm:rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 shadow-lg',
            config.iconBg
          )}
        >
          <img src={img} alt="card-icon" width={22} height={22} className="brightness-0 invert opacity-95" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {badge && (
            <span
              className={cn(
                'text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 sm:py-1 rounded-full border shadow-sm backdrop-blur-md',
                config.badgeBg
              )}
            >
              {badge}
            </span>
          )}
          <div
            className={cn(
              'size-7 sm:size-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200',
              config.arrowColor
            )}
          >
            <ArrowUpRight className="size-3.5 sm:size-4" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 relative z-10 mt-4">
        <h2
          className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors duration-200"
        >
          {title}
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors duration-200 line-clamp-2">
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
