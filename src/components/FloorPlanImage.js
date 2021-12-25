import { useFloor } from 'contexts/FloorContext';

function FloorPlanImage() {
  const { floor } = useFloor();

  return (
    <img
      src={require(`assets/floor-plans/f${floor}.webp`).default}
      alt="bg"
      className="container-bg"
    />
  );
}

export default FloorPlanImage;
