import React from 'react';
import logo from '../assets/logo-clean.png';

const values = [
  {
    title: 'شغل يدوي متقن',
    text: 'كل قطعة تُحضّر وتُصب وتُنهى بعناية، لذلك تحمل لمسة فنية خاصة بها.',
    icon: '♡',
  },
  {
    title: 'مواد مختارة بعناية',
    text: 'نستخدم ريزن وألوان وإضافات مناسبة للحفاظ على لمعان القطعة وجمال تفاصيلها.',
    icon: '☆',
  },
  {
    title: 'هدايا قريبة من القلب',
    text: 'تصاميم مناسبة للمناسبات، التخرج، الخطوبة، أعياد الميلاد، والديكور المنزلي.',
    icon: '✧',
  },
];

export default function AboutPage() {
  return (
    <section className="about-page page-section">
      <div className="page-title">
        <h1>من نحن</h1>
        <p>
          Kh Resin Art مشروع فني يقدم قطع ريزن يدوية ناعمة للهدايا، الديكور، والمناسبات الخاصة.
        </p>
      </div>

      <div className="about-card">
        <div className="about-image">
          <img src={logo} alt="Kh Resin Art" />
        </div>

        <div className="about-text">
          <h2>فن مصنوع بحب وتفاصيل دقيقة</h2>
          <p>
            في Kh Resin Art نؤمن أن الهدية الجميلة ليست فقط في شكلها، بل في التفاصيل التي تجعلها قريبة من الشخص والمناسبة. لذلك نصنع قطع ريزن يدوية يمكن اختيار ألوانها، إضافاتها، وعباراتها حسب الطلب.
          </p>
          <p>
            كل قطعة تمر بمراحل تحضير وصب وتشطيب، وقد تختلف قليلاً عن غيرها لأنها مصنوعة يدوياً وليست إنتاجاً متكرراً. هذا الاختلاف البسيط هو ما يجعل كل تصميم مميزاً وفريداً.
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
