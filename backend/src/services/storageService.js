const { v4: uuidv4 } = require("uuid");
const path = require("path");
const supabase = require("../config/supabase");

// ==========================================
// Upload Campaign Image
// ==========================================
const uploadCampaignImage = async (file) => {
  try {
    if (!file) {
      console.log("No image received.");
      return null;
    }

    if (!file.buffer) {
      throw new Error("File buffer is missing.");
    }

    console.log("Uploading file...");
    console.log("Original Name:", file.originalname);
    console.log("Mime Type:", file.mimetype);
    console.log("Size:", file.size);

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = `campaigns/${fileName}`;

    const { data, error } = await supabase.storage
      .from("campaign-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      throw new Error(error.message);
    }

    console.log("Upload Success:", data);

    const { data: publicData } = supabase.storage
      .from("campaign-images")
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (error) {
    console.error("Image Upload Error:", error);
    throw error;
  }
};

// ==========================================
// Delete Campaign Image
// ==========================================
const deleteCampaignImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const parts = imageUrl.split("/campaign-images/");

    if (parts.length < 2) return;

    const filePath = parts[1];

    const { error } = await supabase.storage
      .from("campaign-images")
      .remove([filePath]);

    if (error) {
      console.error("Delete Image Error:", error);
    } else {
      console.log("Image deleted:", filePath);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  uploadCampaignImage,
  deleteCampaignImage,
};