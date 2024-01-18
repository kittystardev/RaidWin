import React from "react";
import { Helmet } from "react-helmet";

const MetaDetails = ({ title, description, imageUrl }) => {
  return (
    <Helmet title={title} htmlAttributes={{ lang: "en" }} meta={[
      {
        property: "og:type",
        content: 'website'
      },
      {
        property: "og:title",
        content: title
      },
      {
        property: "og:description",
        content: description
      },
      {
        property: "og:image",
        content: imageUrl
      },
      {
        property: "twitter:title",
        content: title
      },
      {
        property: "twitter:description",
        content: description
      },
      {
        property: "twitter:image",
        content: imageUrl
      }
    ]} />
    // <Helmet>
    //   <title>{title}</title>
    //   <meta property="og:title" content={title} />
    //   <meta name="description" content={description} />
    //   <meta property="og:description" content={description} />
    //   <meta property="og:image" content={imageUrl} />
    //   <meta
    //     property="og:url"
    //     content={window.location.href}
    //   />
    //   <meta name="twitter:card" content="summary_large_image" />
    //   <meta name="twitter:image" content={imageUrl} />
    //   <meta name="twitter:image:alt" content={imageAlt} />
    //   <meta name="twitter:site" content={twitterUrl} />
    // </Helmet>
  );
};

export default MetaDetails;
