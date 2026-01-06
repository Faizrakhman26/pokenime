import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  const defaultTitle = 'Pokenime - Nonton Anime Sub Indo Gratis & Terupdate';
  const defaultDescription = 'Pokenime adalah platform streaming anime subtitle Indonesia gratis, tercepat, dan tanpa iklan yang mengganggu. Tonton anime favoritmu sekarang!';

  return (
    <Helmet>
      <title>{title ? `${title} - Pokenime` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? `${title} - Pokenime` : defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} - Pokenime` : defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default SEO;
