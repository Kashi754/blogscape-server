const ImageKit = require('imagekit');
const config = require('./environment');

exports.imageKit = new ImageKit({
  publicKey: config.imageKit.publicKey,
  privateKey: config.imageKit.privateKey,
  urlEndpoint: config.imageKit.urlEndpoint,
});
