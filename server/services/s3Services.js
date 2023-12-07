const AWS = require("aws-sdk");

const uploadToS3 = async (image, fileName) => {
  const BUCKET_NAME = "groupchatimages";
  const iamUserKey = process.env.IAM_USER_KEY;
  const iamUserSecret = process.env.IAM_USER_SECRET;

  let s3Bucket = new AWS.S3({
    accessKeyId: iamUserKey,
    secretAccessKey: iamUserSecret,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: image,
    ACL: "public-read",
    ContentType: "image/jpeg",
  };

  return new Promise((res, rej) => {
    s3Bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("something went wrong", err);
        rej(err);
      } else {
        console.log("success");
        res(s3response.Location);
      }
    });
  });
};

module.exports = { uploadToS3 };
