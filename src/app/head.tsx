export default function Head() {
  const description =
    "A residents’ community website for James Square, Edinburgh, providing shared facilities booking, building information, local guidance, and community updates.";
  const imageUrl = "https://www.james-square.com/images/james-square-website-photo-link.png";

  return (
    <>
      <title>James Square</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.james-square.com/" />
      <meta property="og:title" content="James Square" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="James Square" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="James Square" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  );
}
