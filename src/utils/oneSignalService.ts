import axios from 'axios';

export default async function oneSignal(type, title, subTitle) {
  const config = {
    method: 'post',
    url: 'https://onesignal.com/api/v1/notifications',
    data: '',
  };

  await axios(config)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
