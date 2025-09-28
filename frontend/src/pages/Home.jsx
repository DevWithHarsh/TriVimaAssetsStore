import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import FeaturedProducts from '../components/FeaturedProducts'

const Home = () => {
  return (
    <div className="bg-[#1a1d24] min-h-screen">
      <Hero/>
      <FeaturedProducts />

      <LatestCollection/>
      <BestSeller />
      
      {/* Stats Section */}
      <section className="py-16 bg-[#1a1d24] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#3dd68c] opacity-5 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500 opacity-5 rounded-lg transform rotate-12"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            We've Empowered <span className="text-[#3dd68c]">2 Million+</span> Aspiring Game Devs
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            With assets for Unreal, Unity, Godot, Blender and more, we've got your creative journey covered.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#3dd68c] mb-2">2M+</div>
              <p className="text-gray-400">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#3dd68c] mb-2">10K+</div>
              <p className="text-gray-400">Premium Assets</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#3dd68c] mb-2">500K+</div>
              <p className="text-gray-400">Downloads</p>
            </div>
          </div>
          
          <div className="mt-12">
            <button className="bg-[#3dd68c] text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#2bc77a] transition-all duration-300 transform hover:scale-105">
              Join Our Community
            </button>
          </div>
        </div>
      </section>

      {/* Find Allies Section */}
      <section className="py-16 bg-gradient-to-r from-[#2a2d35] to-[#1a1d24] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Find <span className="text-[#3dd68c]">Assets</span> For Your Adventure
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Connect with like-minded 3D creators from around the gaming world. Share your creations, get feedback, and collaborate on amazing projects.
              </p>
              <button className="bg-[#3dd68c] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#2bc77a] transition-colors">
                Check out our community page
              </button>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🎮</div>
                    <h3 className="text-white text-xl font-bold mb-2">Join the Adventure</h3>
                    <p className="text-blue-200 text-sm">Connect with 50,000+ creators</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#2a2d35]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don't just take it from us!
            </h2>
            <p className="text-gray-400 text-lg">
              Here's what developers from around the realm are saying:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Super fun assets from this store! We definitely got our money's worth and I'm excited for the future projects. The quality is amazing and downloads are instant.",
                author: "@GameDevStudent",
                platform: "Game Developer"
              },
              {
                quote: "Everything I downloaded blew my mind. I've found so much inspiration in these assets and I'd like to give them the credit they deserve. The variety is incredible.",
                author: "@UnityMaster", 
                platform: "Unity Developer"
              },
              {
                quote: "This 3D asset store is GOLD and they cover pretty much every major engine. Be it Unity, Unreal or Blender. There's definitely something for everyone here.",
                author: "@BlenderArtist",
                platform: "Game Designer"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#1a1d24] border border-gray-700 rounded-lg p-6 relative">
                <div className="mb-4 text-gray-300 leading-relaxed">
                  "{testimonial.quote}"
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3dd68c] rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {testimonial.author[1]}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-gray-400 text-sm">{testimonial.platform}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3dd68c] to-[#2bc77a] relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Be The Creator, Not The Consumer
          </h2>
          <p className="text-xl text-black opacity-80 mb-8 max-w-2xl mx-auto">
            Your Vision. Your Assets. Your Game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
              Start Creating Today
            </button>
            <button className="border-2 border-black text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-black hover:text-white transition-all duration-300">
              Browse All Assets
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home