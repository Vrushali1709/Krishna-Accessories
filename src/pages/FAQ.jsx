// src/pages/FAQ.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDownIcon } from '../components/Icons';

const faqCategories = [
  {
    category: "Authenticity & Products",
    items: [
      {
        q: "Are all watches and luxury goods sold on Krishna Accessories 100% authentic?",
        a: "Yes, without exception. Krishna Accessories only partners with authorized brand manufacturers and certified luxury distributors. Every product arrives with original manufacturer warranty cards, stamped certificates, and authentic serial barcodes."
      },
      {
        q: "Does my purchase come with an official manufacturer warranty?",
        a: "All branded timepieces, electronics, and goods include full official manufacturer warranties valid across authorized service centers nationwide across India."
      },
      {
        q: "Can I verify the product at a local brand boutique?",
        a: "Absolutely. You can take your watch or accessory along with our invoice and warranty booklet to any authorized brand showroom across India for authenticity validation."
      }
    ]
  },
  {
    category: "Orders, Shipping & Delivery",
    items: [
      {
        q: "How fast is delivery and which courier partners do you use?",
        a: "We ship all consignments via insured express air couriers, primarily BlueDart Express and Delhivery. Typical delivery timeframes are 24 to 48 hours for tier-1 cities and 2 to 4 days across rest of India."
      },
      {
        q: "How do I track my active consignment?",
        a: "You can visit our 'Track Order' page and enter your order reference (e.g. KA-98421) to view milestone tracking from boutique packaging to doorstep delivery."
      },
      {
        q: "Is there a free shipping threshold?",
        a: "Complimentary insured express delivery is provided on all orders of ₹2,000 and above. For orders below ₹2,000, a nominal shipping charge of ₹99 applies."
      }
    ]
  },
  {
    category: "Payments, Returns & Refunds",
    items: [
      {
        q: "What payment methods are supported?",
        a: "We accept all major UPI applications (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay, Amex), NetBanking across 50+ Indian banks, No-Cost Luxury EMI, and Cash on Delivery (COD)."
      },
      {
        q: "What is your return and exchange policy?",
        a: "We offer a 7-Day Return Privilege on all unopened goods in their original pristine state with security tags intact. Simply initiate a return from your Account or contact concierge support."
      },
      {
        q: "How long does it take to receive a refund?",
        a: "Once the parcel is received and inspected at our boutique, refunds are processed within 24 to 48 hours directly back to your original payment source."
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({ "0-0": true });

  const toggleItem = (key) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Knowledge Center
          </span>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-gray-950">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Find immediate answers regarding authenticity verification, warranty coverage, order tracking, and returns.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {faqCategories.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-950 border-b border-gray-200 pb-2">
              {group.category}
            </h2>

            <div className="space-y-3">
              {group.items.map((item, itemIdx) => {
                const key = `${groupIdx}-${itemIdx}`;
                const isOpen = !!openItems[key];

                return (
                  <div
                    key={itemIdx}
                    className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(key)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-gray-950 hover:bg-gray-50 transition"
                    >
                      <span className="pr-4">{item.q}</span>
                      <ChevronDownIcon
                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gray-950' : ''
                          }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still have questions card */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 text-center shadow-sm space-y-3">
          <h3 className="text-base font-bold text-gray-950">Have a specific question not covered here?</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Our concierge advisors in Ahmedabad are ready to assist you via WhatsApp, phone, or private email.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-full bg-[#111827] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-sm"
            >
              Contact Concierge Desk &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
