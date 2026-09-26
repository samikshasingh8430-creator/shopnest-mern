import React from 'react';

const About = () => {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    textAlign: 'center'
  };

  const socialBtnStyle = {
    display: 'inline-block',
    margin: '10px',
    padding: '10px 20px',
    background: '#27272a',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  return (
    <div style={containerStyle}>
      <img
        src="/image.png"
        alt="Samiksha Singh"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid #f97316',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(249,115,22,0.4)'
        }}
      />

      <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#fff' }}>About Me</h2>
      <h3 style={{ fontSize: '1.5rem', color: '#f97316', marginBottom: '15px' }}>Samiksha Singh(Developer)</h3>

      <p style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <strong>Join the community and grow together! </strong>
        Welcome to my platform where we build, deploy and scale highly engineered systems.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <a href='https://github.com/samikshasingh8430-creator'target='_blank'rel='noreferrer'
        style={{ ...socialBtnStyle, background: 'rgba(255,255,255,0.05)', borderColor: '#f8fafc', color: '#f8fafc' }}
        >🐙 GitHub</a>



       <a href='https://www.linkedin.com/in/samiksha-singh-7189b23ab'target='_blank'rel='noreferrer'
       style={{ ...socialBtnStyle, background: 'rgba(59,130,246,0.15)', borderColor: '#3b82f6', color: '#60a5fa' }}
        >💼 LinkedIn </a>

        <a href='https://wa.me/9211904589'target='_blank'rel='noreferrer'
        style={{ ...socialBtnStyle, background: 'rgba(16,185,129,0.2)', borderColor: '#10b981', color: '#10b981' }}
        >💬 WhatsApp</a>



        <a href='https://www.instagram.com/samikshaaa__008'target='_blank'rel='noreferrer'
           style={{ ...socialBtnStyle, background: 'rgba(236,72,153,0.12)', borderColor: '#ec4899', color: '#f472b6' }}
        >📸 Instagram</a>

        
      </div>
    </div>
  );
};

export default About;