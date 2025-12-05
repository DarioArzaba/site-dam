import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GalleryGrid = ({ dataPath = '/data/data' }) => {
  const [paintings, setPaintings] = useState([]);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [loadedChunks, setLoadedChunks] = useState(new Set());
  const observer = useRef();

  const ITEMS_PER_PAGE = 6;
  const CHUNK_SIZE = 100;
  const minSwipeDistance = 50;

  useEffect(() => {
    const loadPaintings = async () => {
      setLoading(true);

      try {
        const startIndex = page * ITEMS_PER_PAGE;
        const chunkIndex = Math.floor(startIndex / CHUNK_SIZE);

        // Only load chunk if we haven't loaded it yet
        if (!loadedChunks.has(chunkIndex)) {
          const response = await fetch(`${dataPath}-${chunkIndex}.json`);

          if (!response.ok) {
            // No more chunks available
            setHasMore(false);
            setLoading(false);
            return;
          }

          const chunkData = await response.json();

          // Mark this chunk as loaded
          setLoadedChunks(prev => new Set([...prev, chunkIndex]));

          // Calculate which paintings from this chunk to display
          const offsetInChunk = startIndex % CHUNK_SIZE;
          const paintingsToShow = chunkData.slice(offsetInChunk, offsetInChunk + ITEMS_PER_PAGE);

          if (paintingsToShow.length === 0) {
            setHasMore(false);
          } else {
            setPaintings(prev => page === 0 ? paintingsToShow : [...prev, ...paintingsToShow]);
          }
        } else {
          // Chunk already loaded, just paginate through existing data
          const response = await fetch(`${dataPath}-${chunkIndex}.json`);
          const chunkData = await response.json();
          const offsetInChunk = startIndex % CHUNK_SIZE;
          const paintingsToShow = chunkData.slice(offsetInChunk, offsetInChunk + ITEMS_PER_PAGE);

          if (paintingsToShow.length === 0) {
            setHasMore(false);
          } else {
            setPaintings(prev => [...prev, ...paintingsToShow]);
          }
        }
      } catch (error) {
        console.error('Error loading paintings:', error);
        setHasMore(false);
      }

      setLoading(false);
    };

    loadPaintings();
  }, [page, dataPath]);

  // Intersection Observer for infinite scroll
  const lastPaintingRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const openModal = (painting) => {
    setSelectedPainting(painting);
  };

  const closeModal = () => {
    setSelectedPainting(null);
  };

  const navigatePainting = (direction) => {
    const currentIndex = paintings.findIndex(p => p.id === selectedPainting.id);
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % paintings.length
      : (currentIndex - 1 + paintings.length) % paintings.length;
    setSelectedPainting(paintings[newIndex]);
  };

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigatePainting('next');
    }
    if (isRightSwipe) {
      navigatePainting('prev');
    }
  };

  // Generate gradient background from palette
  const getGradientBackground = (palette) => {
    if (!palette || palette.length === 0) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    return `linear-gradient(135deg, ${palette[0]} 0%, ${palette[Math.floor(palette.length / 2)]} 50%, ${palette[palette.length - 1]} 100%)`;
  };

  return (
    <>
      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paintings.map((painting, index) => (
            <div
              key={painting.id}
              ref={index === paintings.length - 1 ? lastPaintingRef : null}
              className="group cursor-pointer"
              onClick={() => openModal(painting)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-500 hover:shadow-2xl">
                {/* Dynamic gradient background */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: getGradientBackground(painting.palette) }}
                />

                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden bg-gray-200">
                  <img
                    src={painting.imageUrl}
                    alt={painting.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xl font-light">{painting.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{painting.year} • {painting.medium}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!hasMore && paintings.length > 0 && (
          <p className="text-center py-12 text-gray-500 font-light">
            End of collection
          </p>
        )}
      </main>

      {/* Modal */}
      {selectedPainting && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-y-auto"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="min-h-screen flex items-start md:items-center justify-center p-4 py-16 md:py-4">
            <div className="relative max-w-6xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image side */}
                <div
                  className="md:w-2/3 relative bg-gradient-to-br p-4 md:p-8 flex items-center justify-center min-h-[50vh] md:min-h-[70vh]"
                  style={{ background: getGradientBackground(selectedPainting.palette) }}
                >
                  <img
                    src={selectedPainting.imageUrl}
                    alt={selectedPainting.title}
                    className="max-h-[50vh] md:max-h-[70vh] max-w-full object-contain rounded shadow-2xl"
                    loading="eager"
                  />
                </div>

                {/* Info side */}
                <div className="md:w-1/3 p-6 md:p-8 bg-white">
                  <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
                    {selectedPainting.title}
                  </h2>
                  <p className="text-gray-600 mb-4 md:mb-6">{selectedPainting.year} • {selectedPainting.medium}</p>

                  <div className="prose prose-sm text-gray-700">
                    <p className="leading-relaxed">{selectedPainting.description}</p>
                  </div>
                </div>
              </div>

              {/* Navigation buttons - hidden on small screens, visible on md+ */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePainting('prev');
                }}
                className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all shadow-sm"
                aria-label="Previous painting"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePainting('next');
                }}
                className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all shadow-sm"
                aria-label="Next painting"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-md"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
