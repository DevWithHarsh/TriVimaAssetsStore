import React from 'react';
import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <div className="text-[#6b4226] px-6 md:px-20 py-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#a24e3c]">
          Terms & Conditions, Policies & Disclaimer
        </h2>

        {/* Effective Date */}
        <p className="italic mb-6">Effective Date: 26/07/2025</p>

        {/* Intro */}
        <p className="text-md md:text-lg mb-8">
          Welcome to <span className="font-semibold text-[#6b4226]">DharmaDristi.com</span> (“we”, “our”, “us”).
          By accessing or purchasing from our website, you agree to all the policies, terms, and disclaimers mentioned below.
        </p>

        {/* Sections */}
        <div className="space-y-8 text-sm md:text-base leading-relaxed">

          {/* Section 1 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">1. Business Nature</h3>
            <p>
              DharmaDristi provides spiritual items, home decor, and art products online and offline.
              By placing an order, you acknowledge that all products are sold as faith-based and decorative items.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">2. Eligibility</h3>
            <p>You must be 18 years or older to place an order.</p>
            <p>We reserve the right to refuse or cancel orders at our discretion.</p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">3. Product Information & Pricing</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>We strive to display accurate product details and pricing.</li>
              <li>Slight variations in color, texture, or design may occur due to photography or lighting.</li>
              <li>Prices can change without prior notice.</li>
              <li>Product availability is not guaranteed; if unavailable, we will inform you.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">4. Payment & Cash on Delivery (COD)</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>We accept online payments and Cash on Delivery (COD) for eligible locations.</li>
              <li>For COD orders, the exact amount must be ready at delivery.</li>
              <li>Refusal of COD parcels without valid reason may lead to blocking future orders.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">5. Shipping & Delivery Policy</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Orders are processed within 1-3 business days.</li>
              <li>Delivery time: 5–10 working days for cities and 7–14 days for remote areas.</li>
              <li>Tracking ID will be shared via email/SMS once shipped.</li>
              <li>We are not responsible for delays caused by courier partners or natural issues.</li>
              <li>Courier will attempt 2 re-deliveries if you're unavailable.</li>
              <li>If marked delivered but not received, notify us within 24 hours.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">6. No Return / No Exchange Policy</h3>
            <p className="font-semibold text-red-600">ALL SALES ARE FINAL.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No returns, cancellations, or exchanges due to sacred nature of products.</li>
              <li>Only damaged-on-delivery products may be replaced after verification.</li>
              <li>Send clear pictures within 24 hours to: <span className="font-semibold">info@dharmadristi.com</span></li>
            </ul>
          </div>

          {/* Section 7 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">7. Order Cancellation</h3>
            <p>Orders once placed cannot be canceled after processing.</p>
            <p>We reserve the right to cancel orders due to unavailability, payment issues, or suspected fraud.</p>
          </div>

          {/* Section 8 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">8. Privacy Policy</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>We collect customer info to process orders.</li>
              <li>Payment details are handled by secure gateways.</li>
              <li>No data is sold or shared with unauthorized third parties.</li>
              <li>Our site may use cookies; disable them in your browser if preferred.</li>
              <li>For privacy issues, contact: <span className="font-semibold">info@dharmadristi.com</span></li>
            </ul>
          </div>

          {/* Section 9 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">9. Intellectual Property</h3>
            <p>All content (images, text, logos, designs) is owned/licensed by us. Reproduction or distribution is prohibited.</p>
          </div>

          {/* Section 10 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">10. Limitation of Liability</h3>
            <p>
              We are not liable for indirect or incidental damages from using our website or products.
              Maximum liability will not exceed the amount paid by you.
            </p>
          </div>

          {/* Section 11 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">11. Spiritual Disclaimer</h3>
            <p>
              Our items are sold as faith-based or decorative products. No spiritual or supernatural results are guaranteed.
              DharmaDristi is not responsible for personal decisions based on belief in the product’s effectiveness.
            </p>
          </div>

          {/* Section 12 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">12. Governing Law & Jurisdiction</h3>
            <p>All terms are governed by Indian law. Disputes fall under Gandhinagar, Gujarat courts' jurisdiction.</p>
          </div>

          {/* Section 13 */}
          <div>
            <h3 className="font-bold text-lg text-[#a24e3c]">13. Contact Us</h3>
            <p>
              📧 <span className="font-semibold">info@dharmadristi.com</span><br />
              🌐 <span className="font-semibold">www.dharmadristi.com</span>
            </p>
          </div>

          {/* Quick Summary */}
          <div className="bg-white p-5 rounded-md shadow-md border border-[#e1c1a1] text-sm mt-10">
            <h4 className="font-semibold mb-2 text-[#a24e3c]">✅ Quick Summary for Customers</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>We offer Cash on Delivery (COD)</li>
              <li>No returns / No exchanges except damaged-on-delivery (report within 24 hrs)</li>
              <li>Delivery timeline: 5–10 working days (may vary)</li>
              <li>No guaranteed spiritual effects – products are faith-based</li>
            </ul>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="bg-white border border-[#e1c1a1] p-6 rounded-xl shadow-md mt-8">
          <p className="italic text-[#a24e3c] text-center">
            "By using DharmaDristi.com and placing an order, you confirm that you have read, understood, and agreed to all these terms, policies, and disclaimers."
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;