import { Accordion, AccordionItem, AccordionHeader, AccordionPanel } from '../components/Accordion';

const faqs = [
  {
    id: 'q1',
    question: 'What materials are used in Karigar shirts?',
    answer: 'We source premium Egyptian cotton and fine linen blends to ensure maximum breathability, durability, and a luxurious feel. Our fabrics are carefully selected to provide all-day comfort without compromising on a crisp, professional look.',
  },
  {
    id: 'q2',
    question: 'How do I care for my Karigar shirt?',
    answer: 'For best results, machine wash cold on a gentle cycle with like colors. Avoid using bleach. Tumble dry on low or hang to dry. If needed, iron on a medium setting while the shirt is slightly damp.',
  },
  {
    id: 'q3',
    question: 'Do you offer custom tailoring?',
    answer: 'Currently, we offer a range of sizes designed to fit modern professionals impeccably. While we do not offer bespoke tailoring right now, our size guide is detailed to help you find your perfect fit.',
  },
  {
    id: 'q4',
    question: 'What is your return and exchange policy?',
    answer: 'We offer a 14-day return and exchange policy for unworn, unwashed items with original tags attached. Please contact our support team at hello@karigar.co to initiate a return or exchange.',
  },
  {
    id: 'q5',
    question: 'Where are Karigar shirts manufactured?',
    answer: 'Our shirts are proudly crafted in Karachi, Pakistan, by skilled artisans who have generations of experience in fine tailoring and garment manufacturing.',
  },
  {
    id: 'q6',
    question: 'How long does shipping take?',
    answer: 'Standard shipping within Pakistan takes 3-5 business days. We also offer expedited shipping options at checkout. International shipping times vary by destination, typically ranging from 7-14 days.',
  },
  {
    id: 'q7',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to select countries worldwide. International shipping costs and estimated delivery times will be calculated at checkout based on your location.',
  },
  {
    id: 'q8',
    question: 'How can I track my order?',
    answer: 'Once your order is dispatched, you will receive an email with a tracking number and a link to monitor your shipment\'s progress.',
  },
];

function FaqPage() {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Frequently Asked Questions</h1>
        <p style={styles.subtitle}>
          Everything you need to know about Karigar Co. and our products.
        </p>
      </div>

      <Accordion>
        {faqs.map(faq => (
          <AccordionItem key={faq.id} id={faq.id}>
            <AccordionHeader>{faq.question}</AccordionHeader>
            <AccordionPanel>{faq.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '80px 20px 120px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '16px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
};

export default FaqPage;
