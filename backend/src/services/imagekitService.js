const { getImageKit } = require("../config/imagekit");

const cleanFileName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");

const uploadToImageKit = async (file, folder) => {
  const imagekit = getImageKit();
  const result = await imagekit.upload({
    file: file.buffer.toString("base64"),
    fileName: `${Date.now()}-${cleanFileName(file.originalname)}`,
    folder
  });

  return {
    url: result.url,
    fileId: result.fileId
  };
};

module.exports = { uploadToImageKit };
