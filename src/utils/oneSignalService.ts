import axios from 'axios';

// For Farmer -
// Title
//${Owner Name} has created a transaction.

//Sub Title
//${total Amount} pending.

//For Owner noti -
//Title
//Farmer is not registered.

// Subtitle
// Please contact them to register

export default async function oneSignal(
  type: string,
  title: string,
  subTitle: string,
  socialContentImageUrl: string,
  userId: string,
) {
  const data =
    type == 'product'
      ? {
          app_id: '841b711d-335e-4f83-af31-5814a23c06b8',
          included_segments: ['Total Subscriptions'],
          headings: {
            en: `${title}`,
          },
          contents: {
            en: `${subTitle}`,
          },
        }
      : type == 'socialContent'
      ? {
          app_id: '841b711d-335e-4f83-af31-5814a23c06b8',
          included_segments: ['Total Subscriptions'],
          headings: {
            en: `${title}`,
          },
          contents: {
            en: `${subTitle}`,
          },
          large_icon: `${socialContentImageUrl}`,
        }
      : type == 'message'
      ? {
          app_id: '841b711d-335e-4f83-af31-5814a23c06b8',
          android_channel_id: 'ec8a0028-26e1-4436-b14a-96ec1c3a106a',
          headings: {
            en: `${title}`,
          },
          contents: {
            en: `${subTitle}`,
          },
          filters: [
            {
              field: 'tag',
              key: 'id',
              relation: '=',
              value: `${userId}`,
            },
          ],
        }
      : null;

  const config = {
    method: 'post',
    url: 'https://onesignal.com/api/v1/notifications',
    data: data,
    headers: {
      Authorization: `Bearer ${process.env.ONE_SIGNAL_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  await axios(config)
    .then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
