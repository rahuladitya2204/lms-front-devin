import { Common, Learner } from "@adewaskar/lms-common";

export default function LearnerPrivacyPolicy() {
  const {
    data: { alias, name },
  } = Learner.Queries.useGetOrgDetails();
  return (
    <div className="wrapper">
      <div className="page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>Comprehensive Policies for {name}</h1>
              <p>
                Welcome to https://{alias}.testmint.ai. Our commitment is to
                ensure a transparent, secure, and user-friendly experience.
                Here, we outline our Terms of Use, Privacy Policy,
                Refund/Cancellation Policy, and Shipping Policy, guiding your
                interaction with our services and platform.
              </p>

              <section id="terms-of-use">
                <h2>Terms of Use</h2>
                <p>
                  These Terms of Use constitute a legally binding agreement made
                  between you, whether personally or on behalf of an entity
                  (“you”) and {name} (“we,” “us” or “our”), concerning your
                  access to and use of the https://{alias}.testmint.ai website
                  as well as any other media form, media channel, mobile
                  website, or mobile application related, linked, or otherwise
                  connected thereto. You agree that by accessing the site, you
                  have read, understood, and agreed to be bound by all of these
                  Terms of Use. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF
                  USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND
                  YOU MUST DISCONTINUE USE IMMEDIATELY.
                </p>
              </section>

              <section id="privacy-policy">
                <h2>Privacy Policy</h2>
                <p>
                  Our Privacy Policy describes how we collect, use, and handle
                  your information when you use our websites and services. The
                  data we collect includes information you provide us, like your
                  email and name, when you sign up for an account, content that
                  you submit to the website such as comments, and technical
                  details like your IP address. We use this information to
                  provide, improve, and protect our services, communicate with
                  you, and offer personalized ads (with your consent). We
                  respect your privacy and give you control over your
                  information, with tools to manage it and protect it. Your data
                  is stored securely, and we work to protect it from
                  unauthorized access or disclosure.
                </p>
              </section>

              <section id="refund-cancellation-policy">
                <h2>Refund/Cancellation Policy</h2>
                <p>
                  At {name}, we value your satisfaction with our services. Our
                  Refund/Cancellation Policy is designed to ensure a transparent
                  and fair process for requesting refunds or canceling services.
                  If you are not satisfied with a purchase or a service you have
                  paid for, you may be eligible for a refund based on the
                  conditions outlined in this policy. We detail the process for
                  requesting a refund, including the timeline for such requests,
                  and any conditions or limitations that may apply.
                  Cancellations of services or subscriptions can be made at any
                  time, but please be aware of our policy regarding prorated
                  refunds or any potential cancellation fees.
                </p>
              </section>

              <section id="shipping-policy">
                <h2>Shipping Policy</h2>
                <p>
                  For customers purchasing physical products from {name}, our
                  Shipping Policy provides important information regarding the
                  shipping process. This includes details on our shipping
                  partners, estimated delivery times based on location, shipping
                  costs, and tracking options. We strive to ensure that your
                  order arrives on time and in good condition. Please note,
                  shipping times may vary due to factors outside of our control,
                  such as customs delays or weather conditions. For digital
                  products or services, this section may be adapted to include
                  information on how these offerings are delivered
                  electronically to you.
                </p>
              </section>

              <h2>Contact Us</h2>
              <p>
                For any questions, concerns, or comments regarding our policies,
                please don't hesitate to reach out. Your feedback is invaluable
                to us as we strive to improve our services and your experience
                with {name}. Contact us through our website, or email us
                directly at support@{alias}.testmint.ai for assistance.
              </p>

              <h2>Our Address</h2>
              <p>SS Residency, Koramangala, Bangalore</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
