export function flyProductToCart(from: HTMLElement, image: string) {
  const cart = document.querySelector<HTMLElement>('button[aria-label="Cart"]');
  if (!cart || !image) return;
  const cartBox = cart.getBoundingClientRect();
  if (cartBox.width === 0) return;

  const fromBox = from.getBoundingClientRect();
  const flyer = document.createElement("img");
  flyer.src = image;
  flyer.alt = "";
  const size = 72;
  flyer.style.position = "fixed";
  flyer.style.zIndex = "90";
  flyer.style.left = `${fromBox.left + fromBox.width / 2 - size / 2}px`;
  flyer.style.top = `${fromBox.top + fromBox.height / 2 - size / 2}px`;
  flyer.style.width = `${size}px`;
  flyer.style.height = `${size}px`;
  flyer.style.objectFit = "cover";
  flyer.style.borderRadius = "18px";
  flyer.style.pointerEvents = "none";
  flyer.style.boxShadow = "0 12px 28px rgba(74, 20, 42, 0.28)";
  flyer.style.transition = "transform 620ms cubic-bezier(0.16, 1, 0.3, 1), opacity 620ms ease";
  document.body.appendChild(flyer);

  const endX = cartBox.left + cartBox.width / 2 - (fromBox.left + fromBox.width / 2);
  const endY = cartBox.top + cartBox.height / 2 - (fromBox.top + fromBox.height / 2);

  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    flyer.remove();
    window.dispatchEvent(new Event("empulse-cart-pop"));
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyer.style.transform = `translate(${endX}px, ${endY}px) scale(0.18)`;
      flyer.style.opacity = "0.2";
    });
  });
  flyer.addEventListener("transitionend", done);
  window.setTimeout(done, 760);
}
