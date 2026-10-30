// Average colour of an image's top-left corner, used to paint the frame behind a contained photo.
// Cross-origin images need crossOrigin="anonymous" or the canvas read fails and this returns "".
export function backgroundFromImage(image: HTMLImageElement) {
  if (!image.naturalWidth) return "";
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 4;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return "";
  try {
    context.drawImage(image, 0, 0, 16, 16, 0, 0, 4, 4);
    const { data } = context.getImageData(0, 0, 4, 4);
    let red = 0;
    let green = 0;
    let blue = 0;
    const count = data.length / 4;
    for (let index = 0; index < data.length; index += 4) {
      red += data[index];
      green += data[index + 1];
      blue += data[index + 2];
    }
    return `rgb(${Math.round(red / count)}, ${Math.round(green / count)}, ${Math.round(blue / count)})`;
  } catch {
    return "";
  }
}
