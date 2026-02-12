export default function TestThemePage() {
  return (
    <div className="min-h-screen p-10 space-y-8 bg-muted/20">
      <h1 className="text-3xl font-bold text-primary">Theme Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="clay-card p-6">
          <h2 className="text-xl font-semibold mb-4">Clay Card</h2>
          <p className="mb-4">
            This is a claymorphism card with glass effect and soft shadows.
          </p>
          <button className="clay-btn px-6 py-2 bg-primary text-primary-foreground font-medium">
            Clay Button
          </button>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Standard Card</h2>
          <p className="mb-4">This is a standard shadcn/ui style card.</p>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Standard Button
          </button>
        </div>
      </div>
    </div>
  );
}
