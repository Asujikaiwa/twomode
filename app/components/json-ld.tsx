/**
 * Structured data for search engines and answer engines.
 *
 * The nonce is required: the CSP has no 'unsafe-inline', so an unsigned
 * script tag is silently dropped and the schema never ships.
 */
export function JsonLd({ data, nonce }: { data: unknown; nonce: string }) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // The payload is built on the server from our own content, never from
      // user input, and JSON.stringify escapes the closing-tag sequence below.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
