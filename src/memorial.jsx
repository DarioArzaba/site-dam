import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample paintings data - replace with your actual data structure
const SAMPLE_PAINTINGS = [
  {
    id: 1,
    title: "Sunset Over Mountains",
    year: "2018",
    medium: "Oil on Canvas",
    description: "A vibrant exploration of light and color, capturing the fleeting moment when day transitions to night.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    palette: ["#FF6B35", "#F7931E", "#FDC830", "#4A90E2", "#2C3E50"]
  },
  {
    id: 2,
    title: "Urban Reflections",
    year: "2019",
    medium: "Acrylic on Canvas",
    description: "An abstract interpretation of city life, where architecture and humanity intertwine.",
    imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
    palette: ["#2C3E50", "#34495E", "#7F8C8D", "#BDC3C7", "#ECF0F1"]
  },
  {
    id: 3,
    title: "Garden Dreams",
    year: "2020",
    medium: "Watercolor",
    description: "A delicate study of nature's beauty, celebrating the intricate details of botanical life.",
    imageUrl: "https://images.unsplash.com/photo-1578926314433-e2789279f4aa?w=800&q=80",
    palette: ["#27AE60", "#2ECC71", "#F39C12", "#E74C3C", "#8E44AD"]
  },
  {
    id: 4,
    title: "Coastal Serenity",
    year: "2017",
    medium: "Oil on Canvas",
    description: "The peaceful rhythm of waves meeting shore, a meditation on the eternal dance of water and land.",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
    palette: ["#3498DB", "#2980B9", "#1ABC9C", "#16A085", "#ECF0F1"]
  },
  {
    id: 5,
    title: "Autumn Whispers",
    year: "2021",
    medium: "Mixed Media",
    description: "A celebration of seasonal transformation, where warm hues tell stories of change and renewal.",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
    palette: ["#D35400", "#E67E22", "#F39C12", "#C0392B", "#8B4513"]
  },
  {
    id: 6,
    title: "Midnight Symphony",
    year: "2019",
    medium: "Oil on Canvas",
    description: "An exploration of darkness and light, where shadows create their own melodies.",
    imageUrl: "https://images.unsplash.com/photo-1561214078-f3247647fc5e?w=800&q=80",
    palette: ["#191970", "#4B0082", "#8B008B", "#483D8B", "#6A5ACD"]
  }
];

const PainterMemorial = () => {
  const [paintings, setPaintings] = useState([]);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const observer = useRef();
  const ITEMS_PER_PAGE = 6;

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Simulate fetching paintings from Cloudflare storage
  const fetchPaintings = useCallback(async (pageNum) => {
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const start = pageNum * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newPaintings = SAMPLE_PAINTINGS.slice(start, end);

    if (newPaintings.length === 0) {
      setHasMore(false);
    } else {
      setPaintings(prev => [...prev, ...newPaintings]);
    }

    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    fetchPaintings(0);
  }, []);

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

  useEffect(() => {
    if (page > 0) {
      fetchPaintings(page);
    }
  }, [page, fetchPaintings]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">
              In Loving Memory
            </h1>
            <p className="mt-2 text-lg text-gray-600 font-light">
              A Collection of Life Through Art
            </p>
          </div>
        </div>
      </header>

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
    </div>
  );
};

export default PainterMemorial;
