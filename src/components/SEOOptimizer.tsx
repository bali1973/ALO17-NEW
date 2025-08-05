'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export default function SEOOptimizer({
  title = 'Alo17 - İlan ve Kategoriler Platformu',
  description = 'Alo17 ile ücretsiz ilan verin, kategoriler arasında gezinin ve ihtiyacınız olan ürünleri bulun.',
  keywords = ['ilan', 'kategori', 'alışveriş', 'ikinci el', 'ücretsiz ilan'],
  image = '/images/alo17-og-image.jpg',
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  canonical,
  noindex = false,
  nofollow = false
}: SEOOptimizerProps) {
  const fullUrl = url ? `${process.env.NEXT_PUBLIC_SITE_URL}${url}` : process.env.NEXT_PUBLIC_SITE_URL;
  const fullImageUrl = image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_SITE_URL}${image}`;

  useEffect(() => {
    // Structured data (JSON-LD) ekle
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'Product' : type === 'article' ? 'Article' : 'WebSite',
      name: title,
      description,
      url: fullUrl,
      image: fullImageUrl,
      ...(type === 'article' && {
        author: {
          '@type': 'Person',
          name: author
        },
        datePublished: publishedTime,
        dateModified: modifiedTime,
        articleSection: section,
        keywords: [...keywords, ...tags].join(', ')
      }),
      ...(type === 'product' && {
        category: section,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'TRY',
          availability: 'https://schema.org/InStock'
        }
      })
    };

    // Mevcut structured data'yı temizle
    const existingScript = document.querySelector('script[data-seo-structured]');
    if (existingScript) {
      existingScript.remove();
    }

    // Yeni structured data ekle
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo-structured', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Meta tag'leri güncelle
    updateMetaTags();

    return () => {
      // Cleanup
      const scriptToRemove = document.querySelector('script[data-seo-structured]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, section, tags]);

  const updateMetaTags = () => {
    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords.join(', '));

    // Robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    
    const robotsContent = [];
    if (noindex) robotsContent.push('noindex');
    if (nofollow) robotsContent.push('nofollow');
    if (robotsContent.length === 0) robotsContent.push('index', 'follow');
    
    robotsMeta.setAttribute('content', robotsContent.join(', '));

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || fullUrl);
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={noindex || nofollow ? `${noindex ? 'noindex' : ''}${nofollow ? ',nofollow' : ''}` : 'index,follow'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Alo17" />
      <meta property="og:locale" content="tr_TR" />
      
      {author && <meta property="article:author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@alo17" />

      {/* Additional Meta Tags */}
      <meta name="author" content={author || 'Alo17'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="tr" />
      <meta name="geo.region" content="TR" />
      <meta name="geo.placename" content="Turkey" />

      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
    </Head>
  );
}

// SEO Helper Functions
export const generateSEOTitle = (baseTitle: string, category?: string, location?: string) => {
  let title = baseTitle;
  if (category) title += ` - ${category}`;
  if (location) title += ` ${location}`;
  return title;
};

export const generateSEODescription = (baseDescription: string, category?: string, location?: string, price?: number) => {
  let description = baseDescription;
  if (category) description += ` ${category} kategorisinde`;
  if (location) description += ` ${location} bölgesinde`;
  if (price) description += ` ${price.toLocaleString('tr-TR')} ₺ fiyatla`;
  return description;
};

export const generateSEOKeywords = (baseKeywords: string[], category?: string, location?: string, tags?: string[]) => {
  const keywords = [...baseKeywords];
  if (category) keywords.push(category);
  if (location) keywords.push(location);
  if (tags) keywords.push(...tags);
  return keywords;
};

export const generateStructuredData = (data: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: data.description,
    image: data.images?.[0],
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock'
    },
    category: data.category,
    brand: {
      '@type': 'Brand',
      name: 'Alo17'
    }
  };
}; 