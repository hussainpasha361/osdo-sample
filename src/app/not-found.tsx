import { Link } from "@/components/layout/PageTransition";

export default function NotFound() {
  return (
    <div className="grid-12 min-h-[80svh] content-center gap-y-8 pt-[var(--nav-h)]">
      <p className="num t-note col-span-full">404</p>
      <h1 className="t-xxl col-span-6 md:col-span-9">This page isn&apos;t on the drawings.</h1>
      <Link href="/" className="btn-line col-span-full justify-self-start">
        <span>Back to the home page</span>
      </Link>
    </div>
  );
}
