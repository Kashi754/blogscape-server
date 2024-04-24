/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('social_media').del();
  await knex('social_media').insert([
    {
      user_id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
      facebook: 'https://facebook.com/arigorn_15',
      twitter: 'https://x.com/tj.petersen.7',
      tiktok: 'https://www.tiktok.com/@kashi754',
      instagram: 'https://www.instagram.com/tj_petersen/',
      youtube: 'https://www.youtube.com/channel/UCigqp32mhKab61Xjpbpjf9g',
      twitch: 'https://www.twitch.tv/kashi754',
      github: 'https://github.com/Kashi754',
    },
    {
      user_id: '2eec5b09-0cd6-436a-aeee-7933b0e26da7',
      facebook: 'https://facebook.com/test_user_1',
      instagram: 'https://www.instagram.com/test_user_1/',
      github: 'https://github.com/testUser1',
    },
    {
      user_id: 'df751170-1d53-46ca-89b6-b549fd62e0eb',
      twitter: 'https://x.com/test.user.2',
      tiktok: 'https://www.tiktok.com/@testUser2',
      twitch: 'https://www.twitch.tv/testUser2',
    },
  ]);
};
