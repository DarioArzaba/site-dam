import GalleryGrid from '../components/GalleryGrid';

const Fotos = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <GalleryGrid dataPath="/photosdata/photosdata" />
    </div>
  );
};

export default Fotos;
