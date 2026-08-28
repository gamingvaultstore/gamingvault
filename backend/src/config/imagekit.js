const ImageKit = require("imagekit");

const hasImageKitConfig = () =>
  Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT
  );

const getImageKit = () => {
  if (!hasImageKitConfig()) {
    throw new Error("ImageKit is not configured");
  }

  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  });
};

module.exports = { getImageKit, hasImageKitConfig };
