import Link from 'next/link';
import Head from 'next/head';
import PropTypes from 'prop-types';

function Layout({ children, title }) {
  return (
    <div className="container-fluid">
      <Head>
        <title>Simple AWS Opener{ title ? (` -  ${title}`) : '' }</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/start"><a className="menu-item">Home</a></Link> |
          <Link href="/about"><a className="menu-item">F.A.Q</a></Link>
        </nav>
        <hr />
      </header>

      { children }

      <footer>
        <div>
          Às vezes ouço passar o vento; e só de ouvir o vento passar, vale a pena ter nascido.
          <i className="author">Fernando Pessoa</i>
        </div>
      </footer>

      <style jsx global>{`
        html {
          -webkit-app-region: drag;
          height: 100%;
        }

        body {
          height: 100%;
          font-family: "Helvetica", "Arial", sans-serif;
          line-height: 1.5;
          padding: 4em 1em;
          background: white;
          color: #566b78;
          -webkit-font-smoothing: antialiased;
          margin: 0;
          padding: 0;
        }

        footer {
          align-items: center;
          display: flex;
          justify-content: center;
          margin-top: 4em;
          padding: 4px;
          text-align: center;
          position:fixed;
          left:0px;
          bottom:0px;
          height:30px;
          width:100%;
          border-top: 1px solid #d8dee9;
          font-size: 0.8em
        }

        a {
          color: #e81c4f;
        }

        a strong {
          color: inherit;
        }

        h1,
        h2,
        strong {
          color: #333;
          font-weight: 500;
        }

        hr {
          background: none;
          border: none;
          border-bottom: 1px solid #d8dee9;
        }

        img {
          height: auto;
          max-width: 100%;
        }

        pre {
          overflow: auto;
          white-space: pre-wrap;
          padding: 1em;
          border-left: 2px solid #69c;
        }

        code,
        pre {
          background: #f5f7f9;
          border-bottom: 1px solid #d8dee9;
          color: #3b3c42;
          -moz-font-smoothing: grayscale;
          -webkit-font-smoothing: initial;
        }
      `}
      </style>

      <style jsx>{`
        .container-fluid {
          height: 100%;
          padding: 25px;
        }

        nav {
          padding: 0px;
        }

        .menu-item {
          padding: 0 20px;
          color: #333;
          text-decoration: none
        }

        .author{
          font-size: 0.7em;
        }
      `}
      </style>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

Layout.defaultProps = {
  title: ''
};

export default Layout;
