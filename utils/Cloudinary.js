const cloudinary = require("cloudinary").v2;

function uploadImageToCloudinary(base64Image, folder) {
  cloudinary.config({
    cloud_name: "dm7vpvqcp",
    api_key: "741937426577852",
    api_secret: "82YbkfiiRG1p-OyVxoCUH9IgF-c",
  });

  return new Promise((resolve, reject) => {
    // Upload the image to Cloudinary
    cloudinary.uploader.upload(
      base64Image,
      {
        folder: folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = {
  uploadImageToCloudinary,
};
