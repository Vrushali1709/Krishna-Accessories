// src/pages/FAQ.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDownIcon } from '../components/Icons';
import { Reveal } from '../components/useScrollReveal';
import { HelpCircle, MessageSquare, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const faqCategories = [
  {
    category: "Product Quality & Information",
    items: [
      {
        q: "What standards of quality and inspection do products on Krishna Accessories follow?",
        a: "Every product in our collection is curated with verified product details, fine craftsmanship, and reliable partner networks. Each item arrives with complete product documentation, brand warranty cards, and serial details."
      },
      {
        q: "Does my purchase come with manufacturer warranty?",
        a: "All branded timepieces, electronics, and goods include standard manufacturer warranties valid across brand service centers nationwide across India."
      },
      {
        q: "Can I verify product specifications and details?",
        a: "Yes. Every product page provides detailed specifications, dimensions, SKU codes, and warranty information for transparent and confident shopping."
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
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-neutral-200/80 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Reveal delay={0} direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#8C6734]">
                Knowledge Base &amp; Assistance
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-neutral-950">
              Frequently Asked <span className="italic font-normal text-[#8C6734]">Questions</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
              Find immediate answers regarding product curation, brand warranty coverage, BlueDart air delivery, and return settlements.
            </p>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8 space-y-12">
        {faqCategories.map((group, groupIdx) => (
          <Reveal key={groupIdx} delay={groupIdx * 80} direction="up">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#8C6734]" />
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950">
                  {group.category}
                </h2>
              </div>

              <div className="space-y-3">
                {group.items.map((item, itemIdx) => {
                  const key = `${groupIdx}-${itemIdx}`;
                  const isOpen = !!openItems[key];

                  return (
                    <div
                      key={itemIdx}
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'border-[#C5A880] bg-white shadow-sm'
                          : 'border-neutral-200/80 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-neutral-950 hover:text-[#8C6734] transition-colors cursor-pointer"
                      >
                        <span className="pr-4">{item.q}</span>
                        <ChevronDownIcon
                          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-[#8C6734]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 bg-[#FAF8F5]/50 animate-fade-in font-normal">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        ))}

        {/* Still have questions card */}
        <Reveal delay={250} direction="up">
          <div className="rounded-2xl bg-white border border-neutral-200/90 p-8 sm:p-10 text-center shadow-sm space-y-3 relative overflow-hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF8F5] border border-[#C5A880]/50 text-[#8C6734] mb-1">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">Have a specific question not covered here?</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
              Our concierge advisors in Mumbai are ready to assist you via WhatsApp (+91 93213 22761), phone, or direct email (shantilal6186@gmail.com).
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8C6734] transition-colors shadow-sm"
              >
                <span>Contact Concierge Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
