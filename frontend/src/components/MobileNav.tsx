import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { Speech, Menu } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Open mobile navigation"
            className="sm:hidden p-2 rounded-xl bg-cyber-elevated border border-cyan-500/25 text-cyan-300 hover:border-cyan-400 transition-colors"
          >
            <Menu className="size-6" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="border-r border-cyan-500/20 bg-[#040e1c] text-white backdrop-blur-2xl p-6 transition-colors"
        >
          {/* Brand header */}
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="size-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <Speech className="size-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                CollabClass
              </p>
              <p className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                Virtual Classroom
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex h-[calc(100vh-120px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-2.5 text-white">
                {sidebarLinks.map((item) => {
                  const isActive =
                    location.pathname === item.route ||
                    location.pathname.startsWith(`${item.route}/`);

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        to={item.route}
                        className={cn(
                          'flex items-center gap-3.5 px-4 py-3 rounded-xl w-full transition-all duration-200 text-sm font-semibold',
                          isActive
                            ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                        )}
                      >
                        <img
                          src={item.imgURL}
                          alt={item.label}
                          width={18}
                          height={18}
                          className={cn(
                            'transition-opacity',
                            isActive ? 'brightness-0 invert' : 'opacity-70'
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
