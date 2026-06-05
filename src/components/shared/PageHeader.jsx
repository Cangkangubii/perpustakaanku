import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function PageHeader({ title, addHref, addLabel, children }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex items-center gap-3">
        {children}

        {addHref && (
          <Link href={addHref} className={buttonVariants()}>
            {addLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
