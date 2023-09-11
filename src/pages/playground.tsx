import { LayoutMain } from 'components/layouts/LayoutMain';
import dynamic from 'next/dynamic';

const PlaygroundComponent = dynamic(() => import('../components/screens/Playground').then((mod) => mod.Playground), {
  ssr: false,
});

const Playground = () => {
  return (
    <LayoutMain featureTab={false}>
      <PlaygroundComponent />
    </LayoutMain>
  );
};

export default Playground;
