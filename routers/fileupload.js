const express = require('express');
const router = express.Router();
const processFile = require('../middleware/upload');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');

// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'google-cloud-key.json' });
const bucket = storage.bucket('quinfo-bucket');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};
//   router.post('/upload', controller.upload);
router.post('/upload', async (req, res) => {
  try {
    await processFile(req, res, err);

    if (!req.file) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }

    // SAHOO START
    const extension = FILE_TYPE_MAP[file.mimetype];
    console.log('extension: ', extension);
    const isValidFileType = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type!');
    if (isValidFileType) {
      uploadError = null;
    }
    // SAHOO END

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on('finish', async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      // console.log('publicUrl: ', publicUrl);
      try {
        // Make the file public
        await bucket.file(req.file.originalname).makePublic();
      } catch {
        return res.status(500).send({
          message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }

      res.status(200).send({
        message: 'Uploaded the file successfully: ' + req.file.originalname,
        url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    if (err.code == 'LIMIT_FILE_SIZE') {
      return res.status(500).send({
        message: 'File size cannot be larger than 2MB!',
      });
    }
    if (err.code == 'LIMIT_UNEXPECTED_FILE') {
      return res.status(500).send({
        message: 'Invalid file type selected!',
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file}. ${err}`,
      fileName: req.file,
      error: err,
    });
  }
});

router.get('/listfiles', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });

    res.status(200).send(fileInfos);
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: 'Unable to read list of files!',
    });
  }
});

router.get('/getfile/:name', async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    res.status(500).send({
      message: 'Could not download the file. ' + err,
    });
  }
});

module.exports = router;
