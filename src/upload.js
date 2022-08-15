const AWS = require("aws-sdk");

const s3  = new AWS.S3();

//The serverless.yml will contain the bucket name env variable
const S3_BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async (event) => {
/**
    The output from a Lambda proxy integration must be 
    in the following JSON object. The 'headers' property 
    is for custom response headers in addition to standard 
    ones. The 'body' property  must be a JSON string. For 
    base64-encoded payload, you must also set the 'isBase64Encoded'
    property to 'true'.
    */
   const response = {
        isBase64Encoded: false,
        statusCode: 200
   };
   try{
    const parseBody = JSON.parse(event.body);
    const base64File = parseBody.file;
    const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: parsedBody.fileKey,
        Body: decodedFile,
        ContentType: "image/jpeg",
    };
    const uploadResult = await s3.upload(params).promise();
    response.body = JSON.stringify({ message: "File uploaded successfuly", uploadResult });
    }catch(err){
    console.error("File Upload failed: ", e);
    response.body = JSON.stringify({ message: "File upload failed.", errorMessage: e });
    response.statusCode = 500;
   }
return response;
};