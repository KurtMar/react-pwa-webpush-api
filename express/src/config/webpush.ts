import webpush from 'web-push';

const publicVapidKey = process.env.VAPID_PUBLIC_KEY
const privateVapidKey = process.env.VAPID_PRIVATE_KEY

export default (): void => {
  webpush.setVapidDetails(
    // Apple doesn't like the format: 'mailto: <test@test.com>',
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey,
  );
};
