const cloudinary = require("cloudinary").v2;

const deleteImgCloudinary = (imgUrl) => {
  const array = imgUrl.split("/");
  const name = array.at(-1).split(".")[0];
  const folder = array.at(-2);
  const public_id = `${folder}/${name}`;

  cloudinary.uploader.destroy(public_id, () => {
    console.log("Image delete in cloudinary");
  });
};

module.exports = { deleteImgCloudinary }