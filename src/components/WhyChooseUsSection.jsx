// src/components/WhyChooseUsSection.jsx
import React from 'react';

const DIFFERENCE_ITEMS = [
  {
    number: '01',
    title: 'Curated Selection',
    tag: 'HAND-PICKED',
    text: 'A meticulously curated collection across fine horology, handcrafted leather goods, and flagship audio.'
  },
  {
    number: '02',
    title: 'Quality First',
    tag: '100% AUTHENTIC',
    text: 'Every single piece is verified for brand authenticity, warranty certification, and pristine showroom condition.'
  },
  {
    number: '03',
    title: 'Secure Shopping',
    tag: 'ENCRYPTED CHECKOUT',
    text: 'End-to-end encrypted checkout with express insured logistics via BlueDart and Delhivery.'
  },
  {
    number: '04',
    title: 'Client Concierge',
    tag: '24/7 ASSISTANCE',
    text: 'Dedicated luxury assistance before, during, and after purchase with our Mumbai flagship support team.'
  }
];

export default function WhyChooseUsSection({ items = DIFFERENCE_ITEMS }) {
  return (
    <section className="bg-white border-t border-gray-200/80 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#A68037]">
              The Krishna Guarantee
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-950">
            Why Shop With Us?
          </h2>
          <p className="mx-auto mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-gray-500">
            We provide an elevated e-commerce experience rooted in heritage trust, certified authenticity, and personalized client care.
          </p>
        </div>

        {/* 4-Column Feature Grid */}
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.number}
              className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-[#FAFAFB] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A059]/40 hover:bg-white hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-widest text-[#B89758] bg-[#F7F3E8] border border-[#EEDFBC] px-2.5 py-0.5 rounded-full">
                    {item.number}
                  </span>
                  {item.tag && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                      {item.tag}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-base sm:text-[17px] font-bold text-gray-950 tracking-tight group-hover:text-black transition-colors">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-gray-500 font-normal">
                  {item.text}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <div className="h-0.5 w-6 bg-gray-300 transition-all duration-300 group-hover:w-12 group-hover:bg-[#C5A059]" />
                <span className="text-[10px] text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 font-medium">
                  Learn more
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
