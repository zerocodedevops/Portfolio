import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  jsonLd?: Record<string, any>;
}

export function Seo({
  title,
  description,
  keywords,
  image = `${import.meta.env.VITE_SITE_URL || 'https://zerocode-devops.com'}/og-image.webp`,
  url = globalThis.location?.href || import.meta.env.VITE_SITE_URL || 'https://zerocode-devops.com',
  jsonLd,
}: Readonly<SEOProps>) {
  const siteTitle = 'Diseño web para autónomos y pymes en toda España | ZeroCode';
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://zerocode-devops.com';
  const canonical = new URL(url || globalThis.location?.href || siteUrl, siteUrl);
  canonical.search = '';
  canonical.hash = '';
  if (canonical.pathname.length > 1) {
    canonical.pathname = canonical.pathname.replace(/\/+$/, '');
  }
  const canonicalUrl = canonical.toString();

  return (
    <Helmet>
      {/* Basic */}
      <title>{title === 'Home' ? siteTitle : `${title} | ZeroCode`}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta
        property="og:title"
        content={title === 'Home' ? siteTitle : `${title} | ZeroCode`}
      />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content={title === 'Home' ? siteTitle : `${title} | ZeroCode`}
      />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="canonical" href={canonicalUrl} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
