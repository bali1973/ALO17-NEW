'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { seo, MetaData } from '@/lib/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  structuredData?: Record<string, any>;
  noindex?: boolean;
  canonical?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  type = 'website',
  structuredData,
  noindex = false,
  canonical,
}: SEOHeadProps) {
  const pathname = usePathname();
  const [metaData, setMetaData] = useState<MetaData | null>(null);

  useEffect(() => {
    // Sayfa meta verilerini al
    let pageMeta = seo.getPageMetaData(pathname);

    // Özel meta veriler varsa birleştir
    if (title || description || keywords || image) {
      pageMeta = seo.createMetaData(
        title || pageMeta.title,
        description || pageMeta.description,
        {
          keywords: keywords || pageMeta.keywords,
          ogImage: image || pageMeta.ogImage,
          ogType: type,
          ogUrl: canonical || `https://alo17.com${pathname}`,
          structuredData: structuredData || pageMeta.structuredData,
          robots: noindex ? 'noindex, nofollow' : pageMeta.robots,
          canonical: canonical || `https://alo17.com${pathname}`,
        }
      );
    }

    setMetaData(pageMeta);
  }, [pathname, title, description, keywords, image, type, structuredData, noindex, canonical]);

  if (!metaData) {
    return null;
  }

  const metaTags = seo.generateMetaTags(metaData);

  return (
    <Head>
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
      
      {metaData.keywords && (
        <meta name="keywords" content={metaData.keywords.join(', ')} />
      )}
      
      {metaData.author && (
        <meta name="author" content={metaData.author} />
      )}
      
      {metaData.robots && (
        <meta name="robots" content={metaData.robots} />
      )}

      {/* Canonical URL */}
      {metaData.canonical && (
        <link rel="canonical" href={metaData.canonical} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={metaData.ogTitle || metaData.title} />
      <meta property="og:description" content={metaData.ogDescription || metaData.description} />
      <meta property="og:type" content={metaData.ogType || 'website'} />
      <meta property="og:url" content={metaData.ogUrl || `https://alo17.com${pathname}`} />
      <meta property="og:site_name" content={metaData.ogSiteName || 'Alo17'} />
      
      {metaData.ogImage && (
        <>
          <meta property="og:image" content={metaData.ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content={metaData.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={metaData.twitterTitle || metaData.title} />
      <meta name="twitter:description" content={metaData.twitterDescription || metaData.description} />
      
      {metaData.twitterImage && (
        <meta name="twitter:image" content={metaData.twitterImage} />
      )}
      
      {metaData.twitterCreator && (
        <meta name="twitter:creator" content={metaData.twitterCreator} />
      )}
      
      {metaData.twitterSite && (
        <meta name="twitter:site" content={metaData.twitterSite} />
      )}

      {/* Structured Data */}
      {metaData.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(metaData.structuredData),
          }}
        />
      )}

      {/* Ek meta tag'ler */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ff6600" />
      <meta name="msapplication-TileColor" content="#ff6600" />
      
      {/* Favicon */}
      <link rel="icon" href="/icons/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
} 