import React from 'react';
import { Link } from 'react-router-dom';

function Banner() {
  return (
    <div className="space-y-6 cursor-pointer">
      {/* Banner 1 */}
      <div className="w-full min-h-[300px] sm:min-h-[500px] flex flex-col sm:flex-row items-stretch justify-start shadow-md rounded-lg overflow-hidden">
        {/* Image Section */}
        <div
          className="w-full sm:w-1/2 min-h-[200px] sm:min-h-[400px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/a0/f9/b3/a0f9b3d8da2eff129b5e00a0f59ba0f5.jpg')",
            backgroundPosition: 'center',
          }}
        ></div>
        {/* Text Section */}
        <div className="w-full sm:w-1/2 bg-white flex flex-col items-center sm:items-start justify-center px-4 sm:px-8 py-6 sm:py-8">
          <div className="text-center sm:text-left w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Elevate Your Everyday
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-4">
              At <span className="text-teal-600">Formiq</span>, we believe formal wear is more than just fashion<br />
              it’s your first impression, your silent confidence, your signature<br />
              Every stitch is crafted to reflect class, precision, and a style as sharp as your ambition.
            </p>
            
          </div>
        </div>
      </div>

      {/* Banner 2 */}
      <div className="w-full min-h-[200px] sm:min-h-[400px] flex flex-col sm:flex-row items-stretch justify-start shadow-md rounded-lg overflow-hidden">
        {/* Text Section */}
        <div className="w-full sm:w-1/2 bg-white flex flex-col items-center sm:items-start justify-center px-4 sm:px-8 py-6 sm:py-8">
          <div className="text-center sm:text-left w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              MEN'S FORMAL WEAR
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-4">
              Style is a way to say who you are without speaking
            </p>
            <Link
              to="/men"
              className="bg-gray-100 ml-0 text-teal-600 px-6 py-3 rounded-full hover:bg-gray-300 transition transform hover:scale-105"
            >
              Explore
            </Link>
          </div>
        </div>
        {/* Image Section */}
        <div
          className="w-full sm:w-1/2 min-h-[200px] sm:min-h-[400px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/da/30/b6/da30b6ad19d92239ead8d40df0496962.jpg')",
            backgroundPosition: 'center',
          }}
        ></div>
      </div>

      {/* Banner 3 */}
      <div className="w-full min-h-[200px] sm:min-h-[400px] flex flex-col sm:flex-row items-stretch justify-start shadow-md rounded-lg overflow-hidden">
        {/* Image Section */}
        <div
          className="w-full sm:w-1/2 min-h-[200px] sm:min-h-[400px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/bb/c4/ad/bbc4ad9b4f7eae29c090a0c852bcfcb0.jpg')",
            backgroundPosition: 'center',
          }}
        ></div>
        {/* Text Section */}
        <div className="w-full sm:w-1/2 bg-white flex flex-col items-center sm:items-start justify-center px-4 sm:px-8 py-6 sm:py-8">
          <div className="text-center sm:text-left w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              WOMEN'S FORMAL WEAR
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-4">
              Elegance is the only beauty that never fades—wear it well
            </p>
            <Link
              to="/women"
              className="bg-gray-100 ml-0 text-teal-600 px-6 py-3 rounded-full hover:bg-gray-300 transition transform hover:scale-105"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;