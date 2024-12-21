import React from "react";
import logo from "/logo.png";
import style from "./privacy.module.css"
function PrivacyPolicy() {
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
        <h1 className="text-center mb-4">Privacy Policy</h1>

        <div
          className="card shadow-sm p-4"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        >
          <h4>Effective Date: 12-21-2024</h4>

          <p>
            At <strong>Clothify</strong>, we take your privacy seriously. This
            Privacy Policy outlines how we collect, use, and protect your
            personal information when you use our website (the "Service"). By
            using our Service, you consent to the data practices described in
            this policy.
          </p>

          <h5>1. Information We Collect</h5>
          <p>
            When you use our Service, we collect the following types of
            information:
          </p>
          <ul>
            <li>
              <strong>Personal Information:</strong> Full name, email address,
              profile picture, and other information provided via OAuth login
              (Google or Facebook).
            </li>
            <li>
              <strong>Order and Transaction Information:</strong> Order-related
              data, such as product details, order status, and shipping
              information.
            </li>
            <li>
              <strong>Payment Information:</strong> We do <strong>not</strong>{" "}
              store any payment methods or credit card details. Payment
              processing is handled via a third-party gateway. For more details,
              please visit{" "}
              <a
                href="https://www.payhere.lk/privacy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pay Here Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Usage Data:</strong> IP address, browser type, device
              information, and pages visited to improve the Service and
              personalize your experience.
            </li>
          </ul>

          <h5>2. How We Use Your Information</h5>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>
              To facilitate account creation and logins via OAuth
              (Google/Facebook).
            </li>
            <li>
              To provide personalized services, such as order tracking and
              recommendations.
            </li>
            <li>To fulfill your orders and deliver products on time.</li>
            <li>
              To communicate with you regarding your orders, customer service
              inquiries, or updates.
            </li>
            <li>To improve and optimize our services based on usage data.</li>
          </ul>

          <h5>3. Data Visibility and Access</h5>
          <p>
            <strong>User Data Visibility:</strong> Your personal details (name,
            email, profile picture) are not visible to other users except for
            the admin user.
          </p>
          <p>
            <strong>Admin Access:</strong> Admin users have access to customer
            data solely for the purpose of order fulfillment and customer
            support.
          </p>

          <h5>4. OAuth Login and Third-Party Access</h5>
          <ul>
            <li>
              <strong>OAuth Login:</strong> We collect your full name, email
              address, and profile picture when you log in via Google or
              Facebook. We do not store any of your Google or Facebook
              credentials.
            </li>
            <li>
              <strong>Third-Party Payment Processor:</strong> Payment details
              are processed by a third-party payment gateway. We do not store or
              have access to your payment information. For more details, refer
              to the{" "}
              <a
                href="https://www.payhere.lk/privacy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pay Here Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Third-Party Analytics:</strong> We may use third-party
              analytics tools to monitor and analyze user activity. These tools
              collect usage data but do not access your personal information.
            </li>
          </ul>

          <h5>5. Data Retention</h5>
          <p>
            We retain your personal information for as long as it is necessary
            to fulfill the purposes outlined in this Privacy Policy. If you
            request that your account be deleted, we will remove your personal
            information from our system, subject to legal obligations for
            retention (e.g., financial records).
          </p>

          <h5>6. Data Security</h5>
          <p>
            We implement a variety of security measures to protect your personal
            data, including:
          </p>
          <ul>
            <li>
              <strong>Encryption:</strong> We encrypt your passwords before
              storing them in our database to ensure their safety.
            </li>
            <li>
              <strong>Access Control:</strong> Only authorized personnel have
              access to sensitive data.
            </li>
            <li>
              <strong>Secure Connections:</strong> We use SSL/TLS encryption to
              ensure that data sent to and from our website is secure.
            </li>
          </ul>
          <p>
            However, please note that while we take reasonable precautions, no
            method of transmission over the Internet is 100% secure, and we
            cannot guarantee the absolute security of your data.
          </p>

          <h5>7. User Rights</h5>
          <p>
            You have certain rights regarding your personal information,
            including:
          </p>
          <ul>
            <li>
              <strong>Right to Access:</strong> You can request access to the
              personal information we store about you.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You can request
              corrections to your personal information if it is inaccurate or
              incomplete.
            </li>
            <li>
              <strong>Right to Erasure:</strong> You can request the deletion of
              your personal information if you no longer wish to use our
              Service, provided that the data is not needed for legal or
              contractual obligations.
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> You can request to
              restrict the processing of your data in certain circumstances.
            </li>
            <li>
              <strong>Right to Object:</strong> You can object to certain uses
              of your data, including direct marketing.
            </li>
          </ul>

          <h5>8. Changes to This Privacy Policy</h5>
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will post the updated policy on this page and revise the "Effective
            Date" at the top. We encourage you to review this policy
            periodically to stay informed about how we are protecting your
            information.
          </p>

          <h5>9. Contact Us</h5>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            the way we handle your personal information, please contact us at:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:clothify.com">clothify.com</a>
            </li>
            <li>
              <strong>Phone:</strong> +94 11 225 4569
            </li>
            <li>
              <strong>Address:</strong> 165 Negombo Road, Negombo
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
