function handleImage() {
  const img = document.querySelector(".cover");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, img.width, img.height);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const pixelData = imageData.data;

  const colors = [];

  //Getting colors from pixels
  for (let i = 0; i < pixelData.length; i += 4) {
    const red = pixelData[i];
    const green = pixelData[i + 1];
    const blue = pixelData[i + 2];

    // Adjusting the brightness of the colors
    if (!(red < 20 && green < 20 && blue < 20)) {
      const brightness = 0.299 * red + 0.587 * green + 0.114 * blue;

      // Minimum brightness constraints
      if (brightness > 30) {
        colors.push({ red, green, blue });
      }
    }
  }

  // Sort colors by brightness using HSL
  colors.sort((a, b) => {
    const brightnessA = 0.299 * a.red + 0.587 * a.green + 0.114 * a.blue;
    const brightnessB = 0.299 * b.red + 0.587 * b.green + 0.114 * b.blue;
    return brightnessA - brightnessB;
  });

  // Extracting a subset of colors for the gradient
  const gradientColors = colors.slice(0, 4);

  // Creating a linear gradient using the selected colors
  const gradientStops = gradientColors
    .map(
      (color) =>
        `rgb(${Math.round(color.red)}, ${Math.round(color.green)}, ${Math.round(
          color.blue
        )})`
    )
    .join(", ");

  //applying colors to the element in question
  const musicPlayer = document.querySelector(".player");

  // Create a linear gradient using the selected colors
  musicPlayer.style.background = `linear-gradient(90deg, ${gradientStops})`;
}

window.addEventListener("load", handleImage);
