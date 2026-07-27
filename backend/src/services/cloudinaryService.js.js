const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadCampaignImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return resolve(null);
    }
console.log(cloudinary);
console.log(cloudinary.uploader);
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "campaign-images",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

module.exports = {
  uploadCampaignImage,
};