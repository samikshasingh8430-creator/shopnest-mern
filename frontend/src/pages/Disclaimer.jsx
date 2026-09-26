import React from 'react';

const textualStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '40px',
  background: '#18181b',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.05)',
  lineHeight: '1.8',
  color: '#a1a1aa'
};

const Disclaimer = () => {
  return (
    <div style={textualStyle}>
      <h2
        style={{
          color: '#fff',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '15px'
        }}
      >
        Legal & Site Disclaimer
      </h2>

      <p style={{ marginBottom: '20px' }}>
        The information provided on this website is for general informational and educational
        purposes only. It may be updated, changed, or removed without notice.
      </p>

      <h4 style={{ color: '#f97316', marginTop: '25px', marginBottom: '10px' }}>
        1. Accuracy of Materials
      </h4>
      <p style={{ marginBottom: '15px' }}>
        We make every effort to ensure the content is accurate and useful, but we do not
        guarantee that all information is complete, current, or error-free.
      </p>

      <h4 style={{ color: '#f97316', marginTop: '25px', marginBottom: '10px' }}>
        2. Payment Processing Restrictions
      </h4>
      <p style={{ marginBottom: '15px' }}>
        This website is not a substitute for professional advice. Before taking any action
        based on the information provided here, users should consult relevant professionals
        such as legal, financial, medical, or technical experts.
      </p>

      <h4 style={{ color: '#f97316', marginTop: '25px', marginBottom: '10px' }}>
        3. External Binding Links
      </h4>
      <p style={{ marginBottom: '15px' }}>
        We may provide links to third-party websites for convenience. These links are not
        endorsements, and we are not responsible for the content, accuracy, or availability
        of external sites.
      </p>
    </div>
  );
};

export default Disclaimer;