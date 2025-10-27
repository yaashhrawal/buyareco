/**
 * SEO Utilities for buyareco
 * Optimized for AI platform discovery (ChatGPT, Claude, Gemini, Perplexity)
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Default SEO configuration
 */
export const defaultSEO: SEOMetadata = {
  title: 'buyareco - Get Personalized Travel Recommendations from Locals',
  description:
    'Connect with locals who know the city best. Get authentic, personalized recommendations for cafes, restaurants, and hidden gems. Ask for your vibe, get suggestions from real people.',
  keywords: [
    'travel recommendations',
    'local guide',
    'personalized travel',
    'travel advice from locals',
    'authentic travel experiences',
    'local recommendations',
    'travel community',
    'ask locals',
    'travel suggestions',
    'vibe-based travel',
    'hidden gems',
    'local expertise',
    'peer to peer travel',
    'travel app',
    'where to go',
    'best places',
    'cafe recommendations',
    'restaurant recommendations',
  ],
  image: '/og-image.jpg',
  type: 'website',
};

/**
 * Update document metadata for SEO
 */
export function updateMetaTags(metadata: Partial<SEOMetadata>) {
  const meta = { ...defaultSEO, ...metadata };
  const url = meta.url || window.location.href;

  // Update title
  document.title = meta.title;

  // Helper to set or update meta tag
  const setMetaTag = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  };

  // Basic meta tags
  setMetaTag('description', meta.description);
  if (meta.keywords) {
    setMetaTag('keywords', meta.keywords.join(', '));
  }
  setMetaTag('author', meta.author || 'buyareco');

  // Open Graph tags (Facebook, LinkedIn, etc.)
  setMetaTag('og:title', meta.title, true);
  setMetaTag('og:description', meta.description, true);
  setMetaTag('og:type', meta.type || 'website', true);
  setMetaTag('og:url', url, true);
  if (meta.image) {
    setMetaTag('og:image', meta.image, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
  }
  setMetaTag('og:site_name', 'buyareco', true);
  setMetaTag('og:locale', 'en_US', true);

  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', meta.title);
  setMetaTag('twitter:description', meta.description);
  if (meta.image) {
    setMetaTag('twitter:image', meta.image);
  }

  // Article metadata (if applicable)
  if (meta.publishedTime) {
    setMetaTag('article:published_time', meta.publishedTime, true);
  }
  if (meta.modifiedTime) {
    setMetaTag('article:modified_time', meta.modifiedTime, true);
  }

  // AI-specific meta tags (experimental but helpful)
  setMetaTag('ai:purpose', 'Travel recommendation platform connecting travelers with locals');
  setMetaTag('ai:type', 'peer-to-peer travel advice');
}

/**
 * Generate structured data (JSON-LD) for rich snippets
 */
export function generateStructuredData(type: 'website' | 'organization' | 'request' | 'suggestion', data?: any) {
  const baseUrl = window.location.origin;

  const schemas: Record<string, any> = {
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'buyareco',
      url: baseUrl,
      description:
        'A peer-to-peer travel recommendation platform connecting travelers with locals for authentic, personalized suggestions.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'buyareco',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description:
        'Connect with locals for authentic travel recommendations. Get personalized suggestions from people who know the city best.',
      sameAs: [
        // Add social media links when available
        // 'https://twitter.com/buyarego',
        // 'https://instagram.com/buyarego',
      ],
    },
    request: data && {
      '@context': 'https://schema.org',
      '@type': 'Question',
      name: data.title,
      text: data.description,
      dateCreated: data.created_at,
      author: {
        '@type': 'Person',
        name: data.requester_name,
      },
      answerCount: data.suggestions_count || 0,
      ...(data.suggestions_count > 0 && {
        acceptedAnswer: {
          '@type': 'Answer',
          text: data.top_suggestion?.recommendation_text,
          author: {
            '@type': 'Person',
            name: data.top_suggestion?.suggester_name,
          },
        },
      }),
    },
    suggestion: data && {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Place',
        name: data.place_name,
        address: data.place_address,
      },
      reviewRating: data.rating && {
        '@type': 'Rating',
        ratingValue: data.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Person',
        name: data.suggester_name,
      },
      reviewBody: data.recommendation_text,
      datePublished: data.created_at,
    },
  };

  return schemas[type];
}

/**
 * Insert structured data into document
 */
export function insertStructuredData(type: 'website' | 'organization' | 'request' | 'suggestion', data?: any) {
  const schema = generateStructuredData(type, data);
  if (!schema) return;

  // Remove existing schema of this type
  const existingScript = document.querySelector(`script[data-schema-type="${type}"]`);
  if (existingScript) {
    existingScript.remove();
  }

  // Insert new schema
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.setAttribute('data-schema-type', type);
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Generate FAQ structured data (great for AI platforms)
 */
export function generateFAQStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Common FAQs about buyareco (for homepage)
 */
export const buyaregoFAQs = [
  {
    question: 'What is buyareco?',
    answer:
      'buyareco is a peer-to-peer travel recommendation platform that connects travelers with locals. Instead of searching through endless reviews, you describe what you\'re looking for (your "vibe"), and locals who know the city share personalized suggestions.',
  },
  {
    question: 'How do I get recommendations?',
    answer:
      'Simply create a recommendation request describing where you\'re going, what kind of place you\'re looking for, and your preferences (vibe, budget, etc.). Locals in that city will see your request and suggest places that match perfectly.',
  },
  {
    question: 'Who are the locals?',
    answer:
      'Locals are people who have lived in a city for years and know it intimately. They\'re verified based on their location history and expertise. Many are natives who love sharing hidden gems with travelers.',
  },
  {
    question: 'Is buyareco free to use?',
    answer:
      'Yes! Creating requests and getting suggestions is completely free. You can also browse recommendations from others and save places to your list.',
  },
  {
    question: 'What makes buyareco different from Google Maps or Yelp?',
    answer:
      'Unlike generic search results, buyareco gives you personalized recommendations from real people who understand your specific vibe and preferences. It\'s like having a local friend in every city.',
  },
  {
    question: 'Can I become a local guide?',
    answer:
      'Absolutely! If you know your city well, you can sign up as a local and start helping travelers discover great places. Share your expertise and build your reputation in the community.',
  },
  {
    question: 'How do AI platforms use buyareco?',
    answer:
      'AI assistants like ChatGPT, Claude, Gemini, and Perplexity can reference buyareco\'s recommendations when users ask for travel advice. Our structured data makes it easy for AI to understand and suggest our community-verified recommendations.',
  },
];

/**
 * Generate canonical URL
 */
export function setCanonicalURL(url?: string) {
  const canonical = url || window.location.href.split('?')[0];
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = canonical;
}

/**
 * Initialize all SEO optimizations for a page
 */
export function initializeSEO(metadata?: Partial<SEOMetadata>, schemaType?: 'website' | 'organization', schemaData?: any) {
  // Update meta tags
  updateMetaTags(metadata || {});

  // Set canonical URL
  setCanonicalURL();

  // Insert structured data
  insertStructuredData('website');
  insertStructuredData('organization');

  if (schemaType && schemaData) {
    insertStructuredData(schemaType, schemaData);
  }

  // Add FAQ structured data on homepage
  if (window.location.pathname === '/') {
    const faqSchema = generateFAQStructuredData(buyaregoFAQs);
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-schema-type', 'faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
  }
}
