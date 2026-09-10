// src/pages/FAQ.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { ChevronDownIcon, SearchIcon, ShieldCheckIcon } from '../components/Icons';

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
        a: "Absolutely. You can take your watch or accessory along with our invoice and warranty booklet to any authorized brand showroom in Mumbai or across India for authenticity validation."
      }
    ]
  },
  {
    category: "Orders, Shipping & Delivery",
    items: [
      {
        q: "How fast is delivery and which courier partners do you use?",
        a: "We ship all consignments via insured express air couriers, primarily BlueDart Express and Delhivery. Typical delivery timeframes are 24 to 48 hours for Mumbai and tier-1 cities and 2 to 4 days across rest of India."
      },
      {
        q: "How do I track my active consignment?",
        a: "You can visit our 'Track Order' page and enter your order reference (e.g. KA-98421) to view milestone tracking from Mumbai boutique packaging to doorstep delivery."
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
        a: "Once the parcel is received and inspected at our Mumbai boutique hub, refunds are processed within 24 to 48 hours directly back to your original payment source."
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({ "0-0": true });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (key) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories;
    const q = searchQuery.toLowerCase().trim();
    return faqCategories.map(cat => ({
      ...cat,
      items: cat.items.filter(it => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q))
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <Reveal effect="fade-up">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
              Knowledge Center & Concierge Guide
            </span>
            <h1 className="mt-1 text-3xl sm:text-4xl font-serif font-bold tracking-tight text-gray-950">
              Frequently Asked Questions
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Find immediate answers regarding authenticity verification, warranty coverage, order tracking, and returns.
            </p>

            {/* Instant Search Bar */}
            <div className="mt-6 max-w-md mx-auto relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. warranty, shipping, return)..."
                className="w-full rounded-full border border-gray-200 bg-[#F4F4F6] pl-11 pr-4 py-3 text-xs text-gray-900 outline-none focus:border-[#8C6734] focus:bg-white transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-900 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8 space-y-10">
        {filteredCategories.length === 0 ? (
          <Reveal effect="fade-up">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-950">No questions found matching "{searchQuery}"</p>
              <p className="text-xs text-gray-500 mt-1">Try another keyword or connect directly with our Mumbai concierge desk.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 rounded-full bg-[#111827] px-6 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition"
              >
                Clear Search
              </button>
            </div>
          </Reveal>
        ) : (
          filteredCategories.map((group, groupIdx) => (
            <Reveal key={groupIdx} effect="fade-up" delay={groupIdx * 100}>
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6734] border-b border-gray-200 pb-2">
                  {group.category}
                </h2>

                <div className="space-y-3">
                  {group.items.map((item, itemIdx) => {
                    const key = `${groupIdx}-${itemIdx}`;
                    const isOpen = !!openItems[key] || !!searchQuery.trim();

                    return (
                      <div
                        key={itemIdx}
                        className="rounded-2xl border border-gray-200/90 bg-white overflow-hidden shadow-2xs transition-all hover:border-gray-300"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-gray-950 hover:bg-gray-50/80 transition cursor-pointer"
                        >
                          <span className="pr-4">{item.q}</span>
                          <ChevronDownIcon
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#8C6734]' : ''
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
            </Reveal>
          ))
        )}

        {/* Still have questions card */}
        <Reveal effect="fade-up">
          <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 text-center shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">Personal Advisory</span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-gray-950">Have a specific question not covered here?</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Our client advisors in Mumbai are ready to assist you via WhatsApp (+91 93213 22761), direct phone, or email (shantilal6186@gmail.com).
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="rounded-full bg-[#111827] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-sm hover:-translate-y-0.5 cursor-pointer"
              >
                Contact Concierge Desk &rarr;
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
