const asyncHandler = require('express-async-handler');
const SocialMediaModel = require('../models/SocialMediaModel');
const { isURL } = require('validator');

const socials = [
  'facebook',
  'twitter',
  'instagram',
  'tiktok',
  'youtube',
  'github',
  'twitch',
  'discord',
];

const userId = 'a007ec9f-5f75-419f-8369-5ab37d7e99e6';

exports.meUpdateSocials = asyncHandler(async (req, res) => {
  for (const social of socials) {
    if (!Object.keys(req.body).includes(social)) {
      return res
        .status(400)
        .send(`Please provide either a value or null for ${social}.`);
    }

    if (
      req.body[social] !== null &&
      !isURL(req.body[social], {
        require_protocol: true,
        require_valid_protocol: true,
        allow_fragments: false,
        allow_query_components: false,
      })
    ) {
      return res.status(400).send(`Please provide a valid url for ${social}.`);
    }
  }

  let updatedSocials = await SocialMediaModel.update(
    null,
    { user_id: userId },
    req.body
  );

  if (updatedSocials.length === 0) {
    const newSocials = { ...req.body, user_id: userId };
    updatedSocials = await SocialMediaModel.insert(null, newSocials);
  }

  res.send(updatedSocials[0]);
});
