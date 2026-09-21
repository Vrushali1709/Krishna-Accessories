// src/pages/FAQ.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SHOP_INFO } from '../utils/shopInfo';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { WhatsAppIcon } from '../components/Icons';

// =========================================================================
// CUSTOM ANIMATION HOOK: Intersection Observer for on-scroll reveals
// =========================================================================
function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentElem = ref.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, inView];
}

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.08
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      case 'zoom':
        return 'scale(0.97)';
      default:
        return 'translate3d(0, 20px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

const faqCategories = [
  {
    category: "Product Quality & Warranty",
    icon: ShieldCheck,
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
        q: "Can I verify product specifications and details prior to order?",
        a: "Yes. Every product page provides detailed specifications, dimensions, SKU codes, and warranty information for transparent and confident shopping. You can also connect with our WhatsApp concierge for live wrist shots and videos."
      }
    ]
  },
  {
    category: "Orders, Shipping & Delivery",
    icon: Truck,
    items: [
      {
        q: "How fast is delivery and which courier partners do you use?",
        a: "We ship all consignments via insured express air couriers, primarily BlueDart Express and Delhivery. Typical delivery timeframes are 24 to 48 hours for tier-1 cities and 2 to 4 days across rest of India."
      },
      {
        q: "How do I track my active consignment?",
        a: "You can visit our 'Track Consignment' page and enter your order reference (e.g. KA-98421) to view milestone tracking from boutique packaging to doorstep delivery."
      },
      {
        q: "Is there a free shipping threshold?",
        a: "Complimentary insured express delivery is provided on all orders of ₹2,000 and above. For orders below ₹2,000, a nominal shipping charge of ₹99 applies."
      }
    ]
  },
  {
    category: "Payments, Returns & Refunds",
    icon: RotateCcw,
    items: [
      {
        q: "What payment methods are supported?",
        a: "We accept all major UPI applications (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay, Amex), NetBanking across 50+ Indian banks, No-Cost Luxury EMI, and Cash on Delivery (COD)."
      },
      {
        q: "What is your return and exchange policy?",
        a: "We offer a 7-Day Return Privilege on all unopened goods in their original pristine state with security tags intact. Simply initiate a return from your Account dashboard or contact concierge support."
      },
      {
        q: "How long does it take to receive a refund?",
        a: "Once the parcel is received and inspected at our boutique, refunds are processed within 24 to 48 hours directly back to your original payment source or chosen UPI ID."
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({ "0-0": true, "1-0": true });

  const toggleItem = (key) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER (Luxury Editorial Header Matching About & New Arrivals)    */}
      {/* ========================================================================= */}
      <section className="relative bg-white border-b border-neutral-200/80 overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center max-w-3xl">
          {/* Eyebrow Badge with Pulse */}
          <Reveal delay={0} direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#C5A880]/50 shadow-2xs mx-auto">
              <span className="w-2 h-2 rounded-full bg-[#8C6734] animate-ping" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6734]">
                Knowledge Base &amp; Assistance
              </span>
            </div>
          </Reveal>

          {/* Editorial Serif Heading */}
          <Reveal delay={100} direction="up">
            <h1 className="mt-4 font-serif text-3xl sm:text-5xl lg:text-[52px] font-medium tracking-tight text-neutral-950 leading-[1.15]">
              Frequently Asked <br />
              <span className="italic font-normal text-[#8C6734]">Questions &amp; Guidance.</span>
            </h1>
          </Reveal>

          {/* Description */}
          <Reveal delay={180} direction="up">
            <p className="mt-3 text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl mx-auto">
              Find immediate answers regarding product authentication, manufacturer warranty coverage, courier transit tracking, and 7-day hassle-free return settlements.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ACCORDION CATEGORIES & QUESTIONS                                       */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8 space-y-12">
        {faqCategories.map((group, groupIdx) => {
          const CategoryIcon = group.icon;
          return (
            <Reveal key={groupIdx} delay={groupIdx * 100} direction="up">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 border-b border-neutral-200/80 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F2EB] border border-[#C5A880]/40 text-[#8C6734] flex items-center justify-center shrink-0">
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950">
                    {group.category}
                  </h2>
                </div>

                <div className="space-y-3 pt-1">
                  {group.items.map((item, itemIdx) => {
                    const key = `${groupIdx}-${itemIdx}`;
                    const isOpen = !!openItems[key];

                    return (
                      <div
                        key={itemIdx}
                        className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                          isOpen
                            ? 'border-[#C5A880]/60 bg-white shadow-sm'
                            : 'border-neutral-200/80 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-neutral-950 hover:text-[#8C6734] transition-colors cursor-pointer"
                        >
                          <span className="pr-4 leading-snug">{item.q}</span>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                            isOpen ? 'bg-[#F5F2EB] text-[#8C6734] rotate-180' : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 text-xs sm:text-[13px] text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-fade-in">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          );
        })}

        {/* Still Have Questions Concierge Card */}
        <Reveal delay={200} direction="up">
          <div className="rounded-2xl bg-white border border-neutral-200/80 p-6 sm:p-10 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F5F2EB] text-[#8C6734] border border-[#C5A880]/40 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C6734]">
                Direct Assistance
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-neutral-950 mt-1">
                Have a Question Not Addressed Here?
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                Our luxury advisors in Mumbai are ready to assist you via WhatsApp, phone, or concierge email inquiries.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-neutral-950 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#8C6734] transition-colors duration-200 shadow-sm"
              >
                <span>Contact Concierge Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={SHOP_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white border border-neutral-300 text-neutral-900 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#FAF8F5] hover:border-[#C5A880] transition-colors duration-200"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Senior Advisor</span>
              </a>
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
