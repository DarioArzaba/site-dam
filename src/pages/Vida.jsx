const Vida = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Image */}
          <div className="w-full aspect-[4/3] sm:aspect-[16/9] bg-gray-200">
            <img
              src="/vida-image.jpg"
              alt="Dario Arzaba Mosqueda"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text content */}
          <div className="p-6 sm:p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4 text-base sm:text-lg">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4 text-base sm:text-lg">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Vida;
