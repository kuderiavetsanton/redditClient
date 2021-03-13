import Document, { Html, Head, Main, NextScript } from 'next/document'

const title = 'reddit'
const description = `Reddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!`

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head> 
            <title>Reddit</title>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,700&display=swap" rel="stylesheet"></link>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,700&display=swap" rel="stylesheet"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"/>
            <meta name="description" content={description}></meta>
            <meta name="title" content={title}></meta>
            <meta name="og:title" content={title}></meta>
            <meta name="twitter:title" content={title}></meta>
            <meta property="og:url" content={process.env.NEXT_PUBLIC_CLIENT_URL}></meta>
            <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CLIENT_URL}/reddit.svg`}></meta>
            <meta property="og:image:width" content="256"/>
            <meta property="og:image:height" content="256"/>
            <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_CLIENT_URL}/reddit.svg`}></meta>
            <meta property="twitter:card" content="summary"></meta>
            <meta property="og:site_name" content="reddit"></meta>
        </Head>
        <body className="font-body" style={ { backgroundColor:'#dae0e6' } }>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument