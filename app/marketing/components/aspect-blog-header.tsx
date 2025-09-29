export default function AspectBlogHero() {
  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container p-0">
        <div className="border-b-dark-gray border-l-dark-gray border-r-dark-gray flex flex-col gap-8 overflow-hidden border-r border-b border-l px-6 py-12 md:px-16 md:py-20 md:pt-32">
          <div className="max-w-xl">
            <h1 className="text-foreground mb-2.5 text-3xl tracking-tight md:text-5xl">
              DECKapp Blog
            </h1>
            <p className="font-inter-tight text-mid-gray text-base">
              Your source for expert tips, training updates, and industry
              insights on swimming analytics, team management, and performance optimization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
