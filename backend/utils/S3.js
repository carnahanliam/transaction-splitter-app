const S3 = require('aws-sdk/clients/s3')
require('dotenv').config()
const fs = require('fs')

const bucketName = process.env.S3_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const SecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3({
  accessKeyId,
  SecretAccessKey,
})

const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  }

  return s3.upload(uploadParams).promise()
}

module.exports = uploadFile
