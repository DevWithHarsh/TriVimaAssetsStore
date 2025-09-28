import React from 'react'

const About = () => {
  return (
    <>
      <div className="text-[#6a4432] px-6 py-12 font-sans">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#a24e3c] mb-6">About Us</h1>
          <p className="text-lg mb-6 leading-relaxed">
            Welcome to {""}
            <span className="font-semibold text-[#a24e3c]">DharmaDristi </span>
            – where tradition meets trust.
          </p>

          <p className='mb-6'>We believe that every home deserves a touch of spiritual energy, beauty, and positivity. At DharmaDristi, we bring you a curated collection of authentic spiritual products, elegant decor, and artistic creations designed to inspire peace, faith, and harmony in your life.</p>

          <h2 className="text-2xl font-semibold text-[#a24e3c] mb-4">
            ✨ Why Choose DharmaDristi?
          </h2>
          <ul className="list-disc ml-6 mb-6 space-y-2">
            <ul>✅ Authenticity you can trust – Each product is handpicked with care and devotion.</ul>
            <ul>
              ✅ Quality & craftsmanship – From sacred idols to aesthetic decor, we focus on meaningful creations.</ul>
            <ul>
              ✅ Easy shopping experience – Simple ordering, Cash on Delivery option, and reliable delivery.</ul>

            <ul>
              ✅ Made with faith & love – We understand the spiritual value behind every product.</ul>
          </ul>

          <h2 className="text-2xl font-semibold text-[#a24e3c] mb-4">
            🌸 Our Mission
          </h2>
          <p className="mb-6 leading-relaxed">
            To bring the essence of spirituality, culture, and art into every home while making your shopping experience simple, secure, and satisfying.
          </p>

          <h2 className="text-2xl font-semibold text-[#a24e3c] mb-4">
            🏬 From Our Store to Your Door
          </h2>
          <p className="mb-6 leading-relaxed">
            We started as a humble local shop, serving customers with devotion and honesty. Now, through DharmaDristi.com, we deliver the same trust and authenticity to customers across India
          </p>
          <p>Whether you are looking for pooja essentials, spiritual gifts, sacred idols, or unique decor, we’re here to help you find something truly meaningful.
          </p>
          <div className="bg-white border border-[#e1c1a1] p-6 rounded-xl shadow-md mt-5">
            <p className="italic text-[#a24e3c] text-center">
              "DharmaDristi – Bringing Spirituality & Art Closer to You."
            </p>
          </div>
        </div>
      </div >
    </>
  )
}

export default About
