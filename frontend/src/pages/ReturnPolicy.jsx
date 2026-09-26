 import React from 'react';

const ReturnPolicy = () => {
  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    color: '#e5e7eb',
    lineHeight: '1.8'
  };

  const cardStyle = {
    background: '#18181b',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '18px',
    padding: '32px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
  };

  const headingStyle = {
    color: '#fff',
    marginBottom: '20px',
    fontSize: '2.2rem'
  };

  const subHeadingStyle = {
    color: '#f97316',
    marginTop: '24px',
    marginBottom: '10px',
    fontSize: '1.2rem'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Return Policy</h1>

        <p>
          We want you to be completely satisfied with your purchase. If you are not happy with
          your order, you may request a return or exchange within <strong>7 days</strong> of
          delivery, subject to the terms below.
        </p>

        <h3 style={subHeadingStyle}>1. Eligibility for Returns</h3>
        <p>
          To be eligible for a return, the item must be unused, in the same condition as received,
          and in its original packaging. Items that are damaged, worn, altered, or missing original
          packaging may not qualify for a refund or exchange.
        </p>

        <h3 style={subHeadingStyle}>2. Non-Returnable Items</h3>
        <p>
          Certain products are non-returnable, including:
        </p>
        <ul>
          <li>Digital downloads or downloadable products</li>
          <li>Gift cards</li>
          <li>Customized or personalized items</li>
          <li>Items damaged due to misuse, improper handling, or normal wear and tear</li>
        </ul>

        <h3 style={subHeadingStyle}>3. Refunds</h3>
        <p>
          Once your return is received and inspected, we will notify you of the approval or rejection
          of your refund. Approved refunds will be processed to the original payment method within
          <strong> 5–10 business days</strong>.
        </p>

        <h3 style={subHeadingStyle}>4. Exchanges</h3>
        <p>
          If you received a damaged, incorrect, or defective item, we will arrange an exchange or
          replacement at no additional cost, subject to product availability.
        </p>

        <h3 style={subHeadingStyle}>5. Return Shipping</h3>
        <p>
          Customers are responsible for return shipping charges unless the item is defective,
          incorrect, or damaged on arrival. We recommend using a traceable shipping method.
        </p>

        <h3 style={subHeadingStyle}>6. Cancellation Policy</h3>
        <p>
          Orders can be canceled before shipment. Once shipped, the order will fall under the return
          policy terms.
        </p>

        <h3 style={subHeadingStyle}>7. Contact Us</h3>
        <p>
          If you have any questions or need help with a return, please contact us at
          <strong> support@yourcompany.com</strong> with your order number and product details.
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicy;