require('dotenv').config()

const AWS = require('aws-sdk')

const { v4: uuid } = require('uuid')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
})

exports.uploadImage = async (req) => {
  try {
    let attachment = req.file.originalname.split('.')
    const fileType = attachment[attachment.length - 1]

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuid()}.${fileType}`,
      Body: req.file.buffer,
    }
    const data = await s3.upload(params).promise()
    return data.key
  } catch (error) {
    console.log(error)
    res.status(500).send('Something Went Wrong')
  }
}

exports.deleteImage = async (key) => {
  s3.deleteObject(
    {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    },
    function (err, data) {
      console.log(data)
    }
  )
}

exports.readImage = async (key, res) => {
  try {
    const downloadParams = {
      Key: key,
      Bucket: process.env.AWS_BUCKET_NAME,
    }
    const readStream = s3.getObject(downloadParams).createReadStream()
    readStream.pipe(res)
  } catch (error) {
    console.log(error)
    res.send('No image found')
  }
}
