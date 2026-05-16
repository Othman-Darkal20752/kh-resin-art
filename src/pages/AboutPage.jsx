import logo from '../assets/logo-clean.png';

const values = [
  { title: 'مصنوعة بحب', text: 'كل قطعة تأخذ وقتها لتقدم عملاً فنياً يدوياً متقناً.', icon: '♡' },
  { title: 'جودة عالية', text: 'نختار موادنا بعناية فائقة لضمان بقاء القطعة جميلة ولامعة.', icon: '☆' },
  { title: 'هدايا مميزة', text: 'الخيار الأمثل لهدايا الزفاف، التخرج، والمناسبات الخاصة.', icon: '□' },
];

export default function AboutPage() {
  return (
    <section className="about-page page-section">
      <div className="page-title">
        <h1>عن Kh Resin Art</h1>
        <p>نصنع كل قطعة بحب وعناية، لتكون إضافة مميزة لمناسباتك أو هدية لا تُنسى لمن تحبين.</p>
      </div>

      <div className="about-card">
        <div className="about-image">
          <img src={logo} alt="Kh Resin Art" />
        </div>
        <div className="about-text">
          <h2>شغفنا بالفن والتفاصيل</h2>
          <p>
            في Kh Resin Art، نؤمن بأن الجمال يكمن في التفاصيل. بدأت رحلتنا بشغف كبير نحو فن الريزن، وكيف يمكن لهذه المادة الساحرة أن تتحول إلى قطع صلبة تنبض بالحياة والألوان.
          </p>
          <p>
            كل قطعة تُصنع يدوياً بالكامل، مما يعني أنه لا توجد قطعتان متطابقتان تماماً. نستخدم أجود أنواع الريزن وألوان المايكا وورق الذهب والورود الطبيعية المجففة لضمان جودة استثنائية ولمسة أنثوية ناعمة.
          </p>
        </div>
      </div>

      <div className="values-grid">
        {values.map((value) => (
          <article key={value.title}>
            <span>{value.icon}</span>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
