import Head from 'next/head';
import { WordPressTemplate } from '@faustwp/core';

export default function Preview(props) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Head>
      <WordPressTemplate {...props} />
    </>
  );
}
