const partners: { name: string; categories: string; mark: "nike" | "adidas" | "northface" | "levis" | "zara" | "boss" | "ralph" | "on" | "tommy" | "ck" | "soliver" | "gas" | "guess" | "replay" | "karl" | "only" | "mustang" | "morato" }[] = [
  { name: "Nike", categories: "Shoes", mark: "nike" },
  { name: "Adidas", categories: "Shoes", mark: "adidas" },
  { name: "The North Face", categories: "Jacket", mark: "northface" },
  { name: "Levi's", categories: "Jeans", mark: "levis" },
  { name: "Zara", categories: "Jeans, Pants, Shirts", mark: "zara" },
  { name: "BOSS", categories: "Jeans, Pants, Shirts", mark: "boss" },
  { name: "Ralph Lauren", categories: "Shirts", mark: "ralph" },
  { name: "On Cloud", categories: "Shoes", mark: "on" },
  { name: "Tommy Hilfiger", categories: "Shoes, Shirts", mark: "tommy" },
  { name: "Calvin Klein", categories: "Shoes, Shirts", mark: "ck" },
  { name: "S.Oliver", categories: "Jeans", mark: "soliver" },
  { name: "GAS", categories: "Jeans", mark: "gas" },
  { name: "GUESS", categories: "Jeans", mark: "guess" },
  { name: "Replay", categories: "Jeans", mark: "replay" },
  { name: "Karl Lagerfeld", categories: "Jeans", mark: "karl" },
  { name: "Only & Sons", categories: "Jeans", mark: "only" },
  { name: "Mustang", categories: "Jeans", mark: "mustang" },
  { name: "Antony Morato", categories: "Jeans", mark: "morato" },
];

export function BrandPartners() {
  return (
    <section className="bg-[#f3f3f3] py-8 md:py-10" aria-label="Our partners">
      <h2 className="text-center text-[1.65rem] font-semibold tracking-tight text-[#1a1a1a] md:text-4xl">
        Our Partners
      </h2>
      <div className="mt-7 overflow-hidden md:mt-8">
        <div className="partners-scroll flex w-max items-center">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex items-center">
              {partners.map((partner) => (
                <li key={`${copy}-${partner.mark}`} className="flex h-16 w-44 shrink-0 items-center justify-center px-4">
                  <BrandMark partner={partner} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandMark({ partner }: { partner: (typeof partners)[number] }) {
  const label = `${partner.name}, ${partner.categories}`;
  return (
    <span className="text-[#1c1c1c]" aria-label={label} role="img">
      {partner.mark === "nike" ? (
        <span className="text-[1.65rem] font-black italic tracking-[-0.04em]">NIKE</span>
      ) : null}
      {partner.mark === "adidas" ? (
        <span className="text-xl font-black lowercase tracking-[0.18em]">adidas</span>
      ) : null}
      {partner.mark === "northface" ? (
        <span className="flex flex-col items-center text-[10px] font-bold leading-tight tracking-[0.22em]">
          <span>THE NORTH</span>
          <span>FACE</span>
        </span>
      ) : null}
      {partner.mark === "levis" ? (
        <span className="font-serif text-[1.7rem] font-semibold tracking-wide">Levi&apos;s</span>
      ) : null}
      {partner.mark === "zara" ? (
        <span className="text-[1.35rem] font-light tracking-[0.42em]">ZARA</span>
      ) : null}
      {partner.mark === "boss" ? (
        <span className="text-xl font-black tracking-[0.42em]">BOSS</span>
      ) : null}
      {partner.mark === "ralph" ? (
        <span className="font-serif text-lg font-medium tracking-[0.08em]">Ralph Lauren</span>
      ) : null}
      {partner.mark === "on" ? (
        <span className="text-[1.7rem] font-black tracking-tight">On</span>
      ) : null}
      {partner.mark === "tommy" ? (
        <span className="flex flex-col items-center text-[11px] font-semibold leading-tight tracking-[0.16em]">
          <span>TOMMY</span>
          <span>HILFIGER</span>
        </span>
      ) : null}
      {partner.mark === "ck" ? (
        <span className="text-[11px] font-medium tracking-[0.28em]">CALVIN KLEIN</span>
      ) : null}
      {partner.mark === "soliver" ? (
        <span className="text-lg font-semibold tracking-wide">s.Oliver</span>
      ) : null}
      {partner.mark === "gas" ? (
        <span className="text-2xl font-black tracking-[0.28em]">GAS</span>
      ) : null}
      {partner.mark === "guess" ? (
        <span className="font-serif text-[1.65rem] italic tracking-[0.12em]">GUESS</span>
      ) : null}
      {partner.mark === "replay" ? (
        <span className="text-lg font-bold italic tracking-[0.14em]">REPLAY</span>
      ) : null}
      {partner.mark === "karl" ? (
        <span className="text-center text-[10px] font-medium tracking-[0.18em]">KARL LAGERFELD</span>
      ) : null}
      {partner.mark === "only" ? (
        <span className="text-[13px] font-semibold tracking-[0.14em]">ONLY &amp; SONS</span>
      ) : null}
      {partner.mark === "mustang" ? (
        <span className="text-lg font-black italic tracking-[0.08em]">MUSTANG</span>
      ) : null}
      {partner.mark === "morato" ? (
        <span className="text-center text-[11px] font-semibold tracking-[0.16em]">ANTONY MORATO</span>
      ) : null}
    </span>
  );
}
