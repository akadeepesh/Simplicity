import { Starfield } from "@/components/site/starfield";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <Starfield />
      <aside className="relative hidden lg:block">
        <p className="font-display text-4xl leading-snug text-balance">
          “Fill your paper with the breathings of your heart.”
        </p>
        <p className="mt-4 font-serif text-muted-foreground italic">— William Wordsworth</p>
      </aside>
      <div className="relative mx-auto w-full max-w-md rounded-3xl border bg-card/80 p-8 shadow-xl shadow-black/[0.03] backdrop-blur animate-fade-up">
        <h1 className="font-display text-3xl">{title}</h1>
        <p className="mt-1 mb-8 text-sm text-muted-foreground">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
