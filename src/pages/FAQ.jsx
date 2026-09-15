// src/pages/FAQ.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Reveal } from '../components/useScrollReveal';
import { ChevronDownIcon, SearchIcon } from '../components/Icons';
import { HelpCircle, Sparkles, MessageCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import { SHOP_INFO } from '../utils/shopInfo';

const faqCategories = [
  {
    category: "Product Quality & Authenticity",
    items: [
      {
        q: "What standards of quality and inspection do products on Krishna Accessories follow?",
        a: "Every product in our collection is curated with verified manufacturer specifications, premium materials, and trusted partner networks. Branded items arrive with original brand warranty documentation, certificate cards, and unique serial references."
      },
      {
        q: "Does my purchase come with manufacturer warranty?",
        a: "Yes. All branded timepieces, smartphones, laptops, audio gear, and electronics include official manufacturer warranty coverage valid across all authorized brand service centers nationwide in India."
      },
      {
        q: "Can I inspect the product specifications before purchase?",
        a: "Yes. Every product detail page contains extensive technical specifications, case dimensions, movement types, battery life, weight, and materials for full transparency."
      }
    ]
  },
  {
    category: "Orders, Shipping & Delivery",
    items: [
      {
        q: "How fast is delivery and which courier partners do you use?",
        a: "All orders are dispatched via insured express air couriers, primarily BlueDart Express and Delhivery. Typical transit time is 24 to 48 hours for metro cities and 2 to 4 days for the rest of India."
      },
      {
        q: "How do I track my active consignment?",
        a: "You can visit our 'Track Consignment' page and enter your order reference (e.g. KA-98421) to view step-by-step transit milestones from boutique packaging to doorstep delivery."
      },
      {
        q: "Is there a free shipping threshold?",
        a: "Complimentary insured express delivery is automatically applied to all orders of ₹2,000 and above. Orders below ₹2,000 have a nominal flat delivery charge of ₹99."
      }
    ]
  },
  {
    category: "Payments, Returns & Refunds",
    items: [
      {
        q: "What payment methods are supported?",
        a: "We support all major payment modes: UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, MasterCard, RuPay, Amex), NetBanking across 50+ Indian banks, No-Cost EMI on select cards, and Cash on Delivery (COD)."
      },
      {
        q: "What is your return and exchange policy?",
        a: "We offer a 7-Day Return Privilege on all unopened, pristine items with original security tags and accessories intact. You can initiate a return directly from your Account dashboard or via our WhatsApp Concierge."
      },
      {
        q: "How long does it take to receive a refund?",
        a: "Once your returned parcel is received and inspected at our boutique, refunds are processed within 24 to 48 hours back to your original payment source or via instant UPI transfer."
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({ "0-0": true });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleItem = (key) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter FAQ items according to category and search term
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return faqCategories
      .filter(cat => selectedCategory === 'All' || cat.category === selectedCategory)
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        )
      }))
      .filter(cat => cat.items.length > 0);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 overflow-x-clip">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-12 sm:py-16">
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-amber-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          {/* Breadcrumb */}
          <Reveal direction="down" delay={50}>
            <div className="mb-3 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <Link to="/" className="hover:text-gray-900 transition">Home</Link>
              <span>/</span>
              <span className="text-[#B89758] font-semibold">Knowledge &amp; FAQ</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#8c6734]">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Knowledge Center &amp; Support Guide</span>
            </span>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-950">
              Frequently Asked Questions
            </h1>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <p className="mt-3 text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              Instant answers regarding certified authenticity, express air dispatch, order tracking, and 7-day returns.
            </p>
          </Reveal>

          {/* Interactive Search Bar */}
          <Reveal direction="up" delay={400}>
            <div className="mt-6 max-w-lg mx-auto relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <SearchIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. warranty, shipping, refund, BlueDart)..."
                className="w-full rounded-full border border-gray-200 bg-[#F4F4F6] pl-11 pr-4 py-3 text-xs text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-semibold text-gray-400 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Category Pills & Accordion List */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 space-y-8">
        
        {/* Category Pills */}
        <Reveal direction="up" delay={100}>
          <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
            {['All', 'Product Quality & Authenticity', 'Orders, Shipping & Delivery', 'Payments, Returns & Refunds'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedCategory(tab)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === tab
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {tab === 'All' ? 'All Questions' : tab}
              </button>
            ))}
          </div>
        </Reveal>

        {filteredCategories.length > 0 ? (
          filteredCategories.map((group, groupIdx) => (
            <Reveal key={groupIdx} direction="up" delay={150 * (groupIdx + 1)}>
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-950 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B89758]" />
                  <span>{group.category}</span>
                </h2>

                <div className="space-y-3">
                  {group.items.map((item, itemIdx) => {
                    const key = `${groupIdx}-${itemIdx}`;
                    const isOpen = !!openItems[key];

                    return (
                      <div
                        key={itemIdx}
                        className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs transition hover:border-gray-300"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-gray-950 hover:bg-gray-50/70 transition cursor-pointer"
                        >
                          <span className="pr-4 leading-snug">{item.q}</span>
                          <ChevronDownIcon
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180 text-gray-950' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3 animate-fade-in">
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
        ) : (
          <Reveal direction="zoom" delay={100}>
            <div className="rounded-3xl border border-gray-200 bg-white py-12 text-center shadow-xs">
              <p className="text-xs font-semibold text-gray-500">No questions found matching "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-3 rounded-full bg-gray-950 px-5 py-2 text-xs font-bold text-white hover:bg-black transition"
              >
                Reset Search Filters
              </button>
            </div>
          </Reveal>
        )}

        {/* Concierge Help Callout */}
        <Reveal direction="up" delay={300}>
          <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-slate-900 text-white p-6 sm:p-8 text-center shadow-xl space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Still have questions?</span>
            <h3 className="text-lg sm:text-xl font-bold text-white">Our Concierge Advisors in Mumbai Are Here</h3>
            <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
              Speak directly with our client desk for order adjustments, sizing guidance, custom requests, and express delivery tracking.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href={SHOP_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp (+91 93213 22761)</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-950 hover:bg-gray-100 transition shadow-sm"
              >
                <span>Contact Desk</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>

      </main>

      <Footer />
    </div>
  );
}
