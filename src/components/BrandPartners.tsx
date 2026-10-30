import Image from "next/image";
import Link from "next/link";
import { partners } from "@/data/partners";
import { brandHref } from "@/lib/brands";

export function BrandPartners() {
  return (
    <section className="bg-[#f3f3f3] py-8 md:py-10" aria-label="Our partners">
      <div className="overflow-hidden">
        <div className="partners-scroll flex w-max items-center">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex items-center">
              {partners.map((partner) => (
                <li key={`${copy}-${partner.name}`} className="shrink-0">
                  <Link
                    href={brandHref(partner.name)}
                    aria-label={`Shop ${partner.name}`}
                    aria-hidden={copy === 1 || undefined}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="flex h-24 w-44 items-center justify-center px-5"
                  >
                    <Image
                      src={partner.src}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      className="partner-logo h-11 w-auto max-w-[9.5rem] object-contain"
                      unoptimized
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
