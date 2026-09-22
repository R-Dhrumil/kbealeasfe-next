import React from "react";
import Image from "next/image";

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface SocialTile {
  id: string;
  image: string;
  caption: string;
}

const SOCIAL_POSTS: SocialTile[] = [
  {
    id: "post-1",
    image: "/assets/social/social-1.png",
    caption: "Steaming cardamom chai for crisp mornings.",
  },
  {
    id: "post-2",
    image: "/assets/social/social-2.png",
    caption: "Desk essentials powered by pure taste.",
  },
  {
    id: "post-3",
    image: "/assets/social/social-3.png",
    caption: "Balcony moments with chilled botanical lemon iced tea.",
  },
  {
    id: "post-4",
    image: "/assets/social/social-4.png",
    caption: "Slow-brewed spices & single-origin golden tea liquor.",
  },
  {
    id: "post-5",
    image: "/assets/social/social-5.png",
    caption: "Comfort in a cup after a long day.",
  },
  {
    id: "post-6",
    image: "/assets/social/social-6.png",
    caption: "Laughter, conversations, and artisanal brews.",
  },
];

export function SocialShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 md:my-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A87E28]">
          <InstagramIcon className="h-4 w-4" />
          <span>Follow @kb.beverages</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#143425] tracking-tight">
          Sip With Our Community
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm">
          Tag <span className="font-semibold text-stone-700">#KBTasteOfPurity</span> on Instagram to be featured on our journal.
        </p>
      </div>

      {/* 6-Photo Grid matching Shofy Jewelry instagram-area-4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {SOCIAL_POSTS.map((post) => (
          <div
            key={post.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-2xs border border-stone-200/70"
          >
            <Image
              src={post.image}
              alt={post.caption}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Hover Instagram Overlay */}
            <div className="absolute inset-0 bg-[#143425]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2">
                <InstagramIcon className="h-5 w-5 text-white" />
              </div>
              <p className="text-[10px] line-clamp-2 leading-tight text-stone-200">
                {post.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
