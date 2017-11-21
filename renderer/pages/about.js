import Layout from '../components/layout';

function About() {
  return (
    <Layout title="F.A.Q">
      <div>
        <h2>F.A.Q</h2>
        <p>
          <h3>1. Setup</h3>
          You must have <i>aws cli</i> installed and configured.
          <pre>brew install aws</pre>
          <pre>aws configure</pre>
        </p>

      </div>
    </Layout>
  );
}

export default About;
