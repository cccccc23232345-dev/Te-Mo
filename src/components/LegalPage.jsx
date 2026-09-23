import React from 'react';

const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: September 23, 2026',
    sections: [
      ['Information we collect', 'When you create an account, place an order, or contact us, we collect the information needed to provide that service, such as your name, email address, shipping address, account credentials, cart contents, and transaction reference. We do not ask for private wallet keys or payment passwords.'],
      ['How we use information', 'We use this information to operate TeMo, authenticate accounts, process and verify orders, communicate about orders, prevent fraud, and improve the service. We do not sell personal information.'],
      ['Sharing and retention', 'We share information only with service providers that help operate TeMo, such as authentication, hosting, shipping, and payment-verification providers, or when required by law. We retain information for as long as needed for these purposes and applicable legal obligations.'],
      ['Your choices', 'You may request access to, correction of, or deletion of your personal information by contacting TeMo through the support channel provided with your order. You may also sign out and clear optional browser storage at any time.'],
      ['Cookies and local storage', 'TeMo currently uses essential browser storage to keep sign-in state, cart contents, saved items, theme preference, and your cookie choice working. Optional cookies are not enabled unless you choose to accept them. If we add analytics or advertising cookies, we will ask for consent where required and explain them here.'],
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    updated: 'Last updated: September 23, 2026',
    sections: [
      ['Using TeMo', 'You may use TeMo only for lawful purposes and must provide accurate information when creating an account or placing an order. Keep your account credentials private and notify us if you believe your account has been misused.'],
      ['Products and pricing', 'Product descriptions, images, availability, and prices may change. We aim for accuracy but do not guarantee that every listing is error-free. We may correct an error or cancel an affected order and will explain the next step.'],
      ['Orders and payment', 'An order is submitted when you complete checkout. Payment is confirmed only after the transaction reference has been verified. You are responsible for sending the correct amount to the wallet shown at checkout and for any network fees.'],
      ['Intellectual property', 'TeMo and its original content, branding, and interface are protected by applicable intellectual-property laws. Do not copy, modify, or use them without permission.'],
      ['Service availability', 'We may update, suspend, or discontinue part of the service. To the extent allowed by law, TeMo is not responsible for indirect losses caused by outages, network failures, or third-party services.'],
      ['Contact', 'Questions about these terms should be sent through the support channel provided with your order.'],
    ],
  },
  refunds: {
    title: 'No-Refund Policy',
    updated: 'Last updated: September 23, 2026',
    sections: [
      ['All sales are final', 'Because TeMo orders are paid and verified through cryptocurrency transactions, completed purchases are non-refundable and cannot be reversed. Please review the item, shipping information, wallet address, and total carefully before confirming payment.'],
      ['Before payment', 'You can review or change your cart and checkout details before submitting payment. Do not send funds until the wallet and total shown in checkout are correct.'],
      ['Errors and exceptions', 'This policy does not remove rights that cannot legally be waived. Contact TeMo promptly if we send the wrong item, an item is materially different from its description, or a payment was duplicated due to a verified technical error. We will investigate and explain any available remedy.'],
      ['Network fees and incorrect transfers', 'TeMo is not responsible for network fees, wrong-wallet transfers, unsupported assets, insufficient payments, or payments sent after an order expires. We cannot guarantee recovery of funds sent incorrectly.'],
    ],
  },
};

export default function LegalPage({ page, onBack, onOpenLegal }) {
  const content = legalContent[page] ?? legalContent.privacy;

  return (
    <main className="legal-page" id="main-content">
      <button className="text-button legal-back" type="button" onClick={onBack}>Back to shopping</button>
      <p className="legal-eyebrow">TeMo policies</p>
      <h1>{content.title}</h1>
      <p className="legal-updated">{content.updated}</p>
      <div className="legal-copy">
        {content.sections.map(([heading, body]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
      <nav className="legal-links" aria-label="Legal pages">
        <button type="button" onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>
        <button type="button" onClick={() => onOpenLegal('terms')}>Terms and Conditions</button>
        <button type="button" onClick={() => onOpenLegal('refunds')}>No-Refund Policy</button>
      </nav>
    </main>
  );
}