import { api } from '../utils/axios';
const src2 = 'https://img.lovepik.com/free-png/20210927/lovepik-smoke-png-image_401538877_wh1200.png';
const src =
  'https://scontent.fsgn13-4.fna.fbcdn.net/v/t39.30808-6/369031739_2519714004859279_7507749239407582895_n.jpg?stp=dst-jpg_p526x296&_nc_cat=107&ccb=1-7&_nc_sid=5cd70e&_nc_ohc=hFvQkPhv8SgAX8yAxHV&_nc_ht=scontent.fsgn13-4.fna&oh=00_AfDy2N-XOqLzbEooH3uqVzdyql7jczmwO1DfvnVA7QIDgA&oe=64E82982';

export const handler = api(
  async (req, res) => {
    const img = await fetch(src, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    });
    const blob = await img.arrayBuffer();

    // res.setHeader({
    //   'Content-Type': 'image/jpeg',
    //   'Cache-Control': `immutable, no-transform, s-max-age=2592000, max-age=2592000`,
    // });
    // res.setHeader('Content-Type', 'image/png);
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', `immutable, no-transform, s-max-age=2592000, max-age=2592000`);
    res.send(Buffer.from(blob));
  },
  ['GET'],
);
