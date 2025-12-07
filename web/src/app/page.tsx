"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type Scenario = {
  title: string;
  description: string;
  highlight: string;
};

const scenarios: Scenario[] = [
  {
    title: "הנחות וקניות חכמות",
    description:
      "פירוק אחוזי הנחה על תוויות מחיר הופך קל כשמחשבים כמה באמת נחסוך וכמה נשלם בסוף הקופה.",
    highlight: "דוגמה: חולצה במחיר 180 ₪ עם הנחה של 25% תעלה 135 ₪ בלבד.",
  },
  {
    title: "טיפים ושירות",
    description:
      "טיפ במסעדה, לשליח או למכוניות – אחוז מסכום החשבון עוזר לנו לתת תגמול הוגן ושקוף.",
    highlight: "טיפ של 12% על חשבון של 220 ₪ שווה 26.4 ₪.",
  },
  {
    title: "בריאות וכושר",
    description:
      "אחוזי שומן, התקדמות באימונים או ירידה במשקל – כך ניתן לעקוב אחרי שינוי ולא רק אחרי המספרים הגולמיים.",
    highlight: "אם ירדתם מ־72 ק״ג ל־68 ק״ג ירדתם 5.6% מהמשקל.",
  },
  {
    title: "חיסכון ויעדים",
    description:
      "תכנון תקציב, חיסכון לעצמאות כלכלית או ידיעת האחוז שכבר השגתם מתוך מטרה שנתית.",
    highlight: "חיסכון של 12,000 ₪ מתוך יעד של 18,000 ₪ שווה ל־67%.",
  },
];

const quickWins = [
  "זכרו ש-10% הם עשירית: הזיזו את הנקודה העשרונית צעד שמאלה.",
  "כפולה של 5% היא פשוט חצי מהתוצאה של 10%.",
  "כאשר מנכים אחוז ואז מוסיפים אותו מחדש – לא חוזרים לאותו סכום (בגלל בסיס שונה).",
  "אחוז שינוי מחושב יחסית לערך המקורי בלבד.",
];

const steps = [
  "זהו את הערך המלא (לדוגמה מחיר, כמות קלוריות או שעות עבודה).",
  "המירו את האחוז לשבר עשרוני על ידי חלוקה ב-100.",
  "חשבו את החלק הרצוי באמצעות כפל הערך המלא בשבר העשרוני.",
  "החליטו אם יש צורך להוסיף או להפחית את החלק שקיבלתם.",
  "סמנו לעצמכם את התוצאה והקשר – האם מדובר ברווח, חיסכון או שינוי.",
];

function parseDecimal(value: string): number | null {
  const numeric = Number(value.replace(",", "."));
  return Number.isFinite(numeric) ? numeric : null;
}

function formatCurrency(amount: number | null, fractionDigits = 1) {
  if (amount === null || Number.isNaN(amount)) {
    return "—";
  }
  return amount.toLocaleString("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });
}

function formatPercent(amount: number | null, fractionDigits = 1) {
  if (amount === null || Number.isNaN(amount)) {
    return "—";
  }
  return `${amount.toFixed(fractionDigits)}%`;
}

function DiscountCalculator() {
  const [price, setPrice] = useState("220");
  const [discount, setDiscount] = useState("15");

  const { finalPrice, saved } = useMemo(() => {
    const base = parseDecimal(price);
    const percent = parseDecimal(discount);
    if (base === null || percent === null) {
      return { finalPrice: null, saved: null };
    }
    const savedValue = (base * percent) / 100;
    return { finalPrice: base - savedValue, saved: savedValue };
  }, [price, discount]);

  return (
    <div className={styles.calculatorCard}>
      <h3>מחשבון הנחה</h3>
      <p className={styles.calculatorDescription}>
        הזינו מחיר לפני הנחה ואחוז הנחה כדי להבין כמה תשלמו וכמה חסכתם.
      </p>
      <label className={styles.field}>
        <span>מחיר מקורי (₪)</span>
        <input
          inputMode="decimal"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="לדוגמה 180"
        />
      </label>
      <label className={styles.field}>
        <span>אחוז הנחה (%)</span>
        <input
          inputMode="decimal"
          value={discount}
          onChange={(event) => setDiscount(event.target.value)}
          placeholder="לדוגמה 25"
        />
      </label>
      <div className={styles.resultRow}>
        <span>מחיר לאחר הנחה</span>
        <strong>{formatCurrency(finalPrice)}</strong>
      </div>
      <div className={styles.resultRow}>
        <span>חיסכון כולל</span>
        <strong>{formatCurrency(saved)}</strong>
      </div>
    </div>
  );
}

function TipCalculator() {
  const [amount, setAmount] = useState("185");
  const [tip, setTip] = useState("12");
  const [diners, setDiners] = useState("2");

  const { tipValue, total, perPerson } = useMemo(() => {
    const bill = parseDecimal(amount);
    const tipPercent = parseDecimal(tip);
    const dinersCount = Number(diners);

    if (bill === null || tipPercent === null || !Number.isFinite(dinersCount)) {
      return { tipValue: null, total: null, perPerson: null };
    }
    const tipAmount = (bill * tipPercent) / 100;
    const totalBill = bill + tipAmount;
    const perGuest =
      dinersCount > 0 ? Number(totalBill / dinersCount) : Number.NaN;

    return { tipValue: tipAmount, total: totalBill, perPerson: perGuest };
  }, [amount, tip, diners]);

  return (
    <div className={styles.calculatorCard}>
      <h3>חלוקת טיפ והחשבון</h3>
      <p className={styles.calculatorDescription}>
        חשבו טיפ בעבור שירות וחלקו את הסכום בין יושבי השולחן בצורה הוגנת.
      </p>
      <label className={styles.field}>
        <span>סה״כ חשבון (₪)</span>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="לדוגמה 220"
        />
      </label>
      <label className={styles.field}>
        <span>אחוז טיפ (%)</span>
        <input
          inputMode="decimal"
          value={tip}
          onChange={(event) => setTip(event.target.value)}
          placeholder="לדוגמה 12"
        />
      </label>
      <label className={styles.field}>
        <span>מספר סועדים</span>
        <input
          inputMode="numeric"
          value={diners}
          onChange={(event) => setDiners(event.target.value)}
          placeholder="לדוגמה 3"
        />
      </label>
      <div className={styles.resultRow}>
        <span>סכום טיפ</span>
        <strong>{formatCurrency(tipValue, 2)}</strong>
      </div>
      <div className={styles.resultRow}>
        <span>סה״כ לתשלום</span>
        <strong>{formatCurrency(total, 2)}</strong>
      </div>
      <div className={styles.resultRow}>
        <span>עלות לכל סועד</span>
        <strong>{formatCurrency(perPerson, 2)}</strong>
      </div>
    </div>
  );
}

function ProgressTracker() {
  const [target, setTarget] = useState("10000");
  const [current, setCurrent] = useState("6300");

  const { completion, remaining, difference } = useMemo(() => {
    const goal = parseDecimal(target);
    const now = parseDecimal(current);
    if (goal === null || now === null || goal === 0) {
      return { completion: null, remaining: null, difference: null };
    }
    const completionValue = (now / goal) * 100;
    const remainingValue = goal - now;
    const differenceValue = ((now - goal) / goal) * 100;
    return {
      completion: Math.max(0, Math.min(100, completionValue)),
      remaining: remainingValue,
      difference: differenceValue,
    };
  }, [target, current]);

  return (
    <div className={styles.calculatorCard}>
      <h3>מעקב אחר יעד</h3>
      <p className={styles.calculatorDescription}>
        בדקו כמה התקדמתם לעבר מטרה כספית או כמותית וכמה אחוז עוד נשאר.
      </p>
      <label className={styles.field}>
        <span>יעד כולל (₪)</span>
        <input
          inputMode="decimal"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          placeholder="לדוגמה 15000"
        />
      </label>
      <label className={styles.field}>
        <span>התקדמות נוכחית</span>
        <input
          inputMode="decimal"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          placeholder="לדוגמה 8200"
        />
      </label>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${completion ?? 0}%` }}
          aria-hidden="true"
        />
      </div>
      <div className={styles.resultRow}>
        <span>השלמה עד כה</span>
        <strong>{formatPercent(completion, 1)}</strong>
      </div>
      <div className={styles.resultRow}>
        <span>סכום שנותר</span>
        <strong>{formatCurrency(remaining, 2)}</strong>
      </div>
      <div className={styles.resultRow}>
        <span>פער מול היעד</span>
        <strong>{formatPercent(difference, 1)}</strong>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.heroTag}>מדריך יומיומי</span>
        <h1>אחוזים בחיי היום יום</h1>
        <p className={styles.heroLead}>
          אחוזים נמצאים בכל החלטה – מהסופרמרקט ועד לתכנון החיסכון. כאן תמצאו
          דוגמאות פשוטות, נוסחאות קצרות וכלים אינטראקטיביים שיעזרו לכם להבין
          את התמונה המלאה בכמה שניות.
        </p>
        <div className={styles.heroStats}>
          <div>
            <strong>₪250</strong>
            <span>החיסכון הממוצע למשק בית בשנה מהשוואת אחוזי הנחה</span>
          </div>
          <div>
            <strong>18%</strong>
            <span>ירידה בהוצאות כשעוקבים אחרי אחוזי שימוש חודשיים</span>
          </div>
          <div>
            <strong>5 דקות</strong>
            <span>מספיקות להבין את העקרונות הבסיסיים</span>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>איפה פוגשים אחוזים ביומיום?</h2>
          <p>
            שימוש מודע באחוזים הופך החלטות פיננסיות, תזונתיות והתנהלות עם זמן
            לשקופות ומבוססות נתונים.
          </p>
        </div>
        <div className={styles.scenarioGrid}>
          {scenarios.map((scenario) => (
            <article key={scenario.title} className={styles.scenarioCard}>
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
              <footer>{scenario.highlight}</footer>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>כלים לחישוב מהיר</h2>
          <p>בחרו את הסיטואציה המתאימה, הזינו מספרים וקבלו תשובה מידית.</p>
        </div>
        <div className={styles.calculatorGrid}>
          <DiscountCalculator />
          <TipCalculator />
          <ProgressTracker />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>צעדים לפתרון בעיות באחוזים</h2>
          <p>שיטה קצרה שתעזור לכם להישאר מדויקים בכל חישוב.</p>
        </div>
        <ol className={styles.stepsList}>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className={styles.tipList}>
          {quickWins.map((item) => (
            <div key={item} className={styles.tipItem}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
