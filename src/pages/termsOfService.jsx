import React from 'react';
import logo from "/logo.png";
import style from "./privacy.module.css"
function TermsOfService() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundImage: `url(${logo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: "0.1",
          zIndex: "-1",
        }}
      ></div>
      <div className="container my-5">
        <img src={logo} alt="" className={style.responsiveLogo} />
        <h1 className="text-center my-4">Terms of Service</h1>

        <div className="card shadow-sm p-4">
          <h4>Effective Date: 12-21-2024</h4>
          <p>
            Welcome to <strong>Clothify</strong>! These Terms of Service ("Terms") govern your use of our website and services ("Service"). By accessing or using our Service, you agree to comply with these Terms. If you do not agree, please refrain from using our Service.
          </p>

          <h5>1. Use of the Service</h5>
          <p>
            By using our Service, you agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information when creating an account.</li>
            <li>Use the Service in compliance with applicable laws and regulations.</li>
            <li>Refrain from engaging in fraudulent, abusive, or harmful activities.</li>
          </ul>

          <h5>2. User Accounts</h5>
          <p>
            To use certain features, you may need to create an account. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials.</li>
            <li>All activities conducted under your account.</li>
            <li>Promptly notifying us of unauthorized access or use of your account.</li>
          </ul>

          <h5>3. Product and Service Descriptions</h5>
          <p>
            We strive to provide accurate descriptions of our products and services. However, we do not guarantee that the information is error-free, complete, or up-to-date. If a product is listed with incorrect details, we reserve the right to correct errors and update information without prior notice.
          </p>

          <h5>4. Intellectual Property</h5>
          <p>
            All content on the Service, including text, images, logos, and trademarks, is the property of <strong>Clothify</strong> or its licensors and is protected by copyright and intellectual property laws. You may not use, reproduce, or distribute this content without prior written consent.
          </p>

          <h5>5. Limitation of Liability</h5>
          <p>
            To the fullest extent permitted by law, <strong>Clothify</strong> is not liable for:
          </p>
          <ul>
            <li>Indirect, incidental, or consequential damages arising from your use of the Service.</li>
            <li>Loss of data, revenue, or profits due to technical issues or unauthorized access.</li>
            <li>Any content or interactions on third-party websites linked to our Service.</li>
          </ul>

          <h5>6. Termination</h5>
          <p>
            We reserve the right to suspend or terminate your access to the Service at our discretion, without notice, for:
          </p>
          <ul>
            <li>Violations of these Terms.</li>
            <li>Engagement in fraudulent or abusive activities.</li>
            <li>Unexpected technical or security issues.</li>
          </ul>

          <h5>7. Changes to These Terms</h5>
          <p>
            We may update these Terms periodically. When we do, we will notify you by posting the revised Terms on this page with a new "Effective Date." Continued use of the Service constitutes acceptance of the updated Terms.
          </p>

          <h5>8. Governing Law</h5>
          <p>
            These Terms are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising from these Terms or the use of the Service will be resolved exclusively in the courts of Sri Lanka.
          </p>

          <h5>9. Contact Us</h5>
          <p>If you have any questions or concerns about these Terms, please contact us at:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:clothify.com">clothify.com</a></li>
            <li><strong>Phone:</strong> +94 11 225 4569</li>
            <li><strong>Address:</strong> 165 Negombo Road, Negombo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
