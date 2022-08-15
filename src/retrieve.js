const AWS = require("aws-sdk");

const s3  = new AWS.S3();

//The serverless.yml will contain the bucket name env variable
const S3_BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async (event) => {
   const response = {
        isBase64Encoded: false,
        statusCode: 200
   };
   try{
        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: decodeURIComponent(event.pathParameters.fileKey)
        };
        const data = await s3.getObject(params).promise();
        response.body = JSON.stringify({ message: "File retrieved successfuly", data });
    }catch(err){
    console.error("File Upload failed: ", e);
    response.body = JSON.stringify({ message: "File retrieval failed.", errorMessage: e });
    response.statusCode = 500;
   }
   return response;
};