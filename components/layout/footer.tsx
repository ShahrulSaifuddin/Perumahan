export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-4 text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} DBKL Flat Management Portal. All rights
      reserved.
    </footer>
  );
}
