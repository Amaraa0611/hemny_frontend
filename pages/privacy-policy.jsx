import Head from 'next/head';
import MainLayout from '../components/layout/MainLayout';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Hemny.mn</title>
        <meta name="description" content="Privacy Policy for Facebook Graph API data collection on Hemny.mn." />
      </Head>
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        <h1 className="text-center">Privacy Policy</h1>
        <p className="text-center text-gray-500 mb-8">Last updated: June 27, 2025</p>
        <p>
          This Privacy Policy describes how hemny ("we", "our", or "us") handles data collected through our Facebook application, which accesses public posts from public Facebook Pages via the Facebook Graph API.
        </p>
        <h2>1. Information We Collect</h2>
        <p>
          We collect and process publicly available content from Facebook Pages using the Graph API. This may include post text, post time, public page name, and URLs to those posts. We do not collect or access any personal data from Facebook users, nor do we store private user information.
        </p>
        <h2>2. How We Use This Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Aggregate and display public post content on our website (hemny.mn)</li>
          <li>Provide search or filter features based on publicly posted data</li>
          <li>Analyze trends in public social media activity</li>
        </ul>
        <h2>3. Data Sharing</h2>
        <p>
          We do not share or sell collected data with any third parties. All content is publicly accessible on Facebook and is used in accordance with Facebook's Platform Terms.
        </p>
        <h2>4. Data Retention</h2>
        <p>
          Collected public data may be stored for display and analysis purposes. We do not store user-identifiable information and remove any content upon Facebook's or the original page's request.
        </p>
        <h2>5. Third-Party Services</h2>
        <p>
          Our application may display links to Facebook or embed Facebook content. These services are subject to Facebook's own privacy policies.
        </p>
        <h2>6. User Rights</h2>
        <p>
          As no personal user data is collected or stored, there are no personal data access or deletion rights applicable. However, public Facebook Pages may request content to be removed from our platform by contacting us.
        </p>
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions or concerns about this policy or how data is handled, please contact us at:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Email: <a href="mailto:amartuvshineducation@gmail.com" className="text-blue-600 underline">amartuvshineducation@gmail.com</a></li>
          <li>Website: <a href="https://www.hemny.mn" className="text-blue-600 underline">www.hemny.mn</a></li>
        </ul>
      </div>
    </>
  );
};

PrivacyPolicy.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default PrivacyPolicy; 