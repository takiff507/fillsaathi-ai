const formText = document.querySelector('#formText');
const result = document.querySelector('#result');
const generateBtn = document.querySelector('#generateBtn');
const sampleBtn = document.querySelector('#sampleBtn');
const clearBtn = document.querySelector('#clearBtn');
const copyBtn = document.querySelector('#copyBtn');

const sampleFields = `Name
Father/Husband Name
Date of Birth
Mobile Number
Address
Account Number
IFSC Code
PAN Number
Nominee Name
Passport Size Photo
Signature
Date and Place
Declaration`;

const sensitivePatterns = [
  'aadhaar', 'aadhar', 'pan', 'account', 'ifsc', 'bank', 'card', 'cvv', 'otp',
  'password', 'pin', 'upi', 'customer id', 'client id', 'passport', 'driving licence',
  'voter id', 'ration', 'ssn', 'tax id'
];

const highRiskPatterns = ['otp', 'password', 'cvv', 'pin', 'upi pin', 'card'];

const guideRules = [
  {
    match: ['name', 'applicant'],
    text: 'Write your full legal name exactly as shown on your official ID. Avoid short names or spelling changes.',
    level: 'safe'
  },
  {
    match: ['father', 'husband', 'guardian', 'parent'],
    text: 'Write the full legal name of the required person. Use the same spelling used in official documents.',
    level: 'safe'
  },
  {
    match: ['dob', 'date of birth', 'birth'],
    text: 'Fill date of birth in the format mentioned on the form. If no format is shown, use DD/MM/YYYY.',
    level: 'safe'
  },
  {
    match: ['mobile', 'phone', 'contact'],
    text: 'Write your active mobile number. Do not share OTP with anyone after submission.',
    level: 'warn'
  },
  {
    match: ['email', 'mail'],
    text: 'Write an email address you can access. Check spelling carefully because updates may come there.',
    level: 'safe'
  },
  {
    match: ['address'],
    text: 'Write the address requested by the form: current, permanent, or communication address. Match it with your proof document if asked.',
    level: 'safe'
  },
  {
    match: ['account'],
    text: 'Sensitive field. Copy the account number manually from passbook, cheque, or official bank app. Do not send the real number to AI.',
    level: 'danger'
  },
  {
    match: ['ifsc'],
    text: 'Sensitive banking field. Write the IFSC exactly as shown by your bank branch. It is usually 11 characters.',
    level: 'danger'
  },
  {
    match: ['pan'],
    text: 'Sensitive ID field. Fill manually from your PAN card. Do not upload or paste the real PAN unless the official form requires it.',
    level: 'danger'
  },
  {
    match: ['aadhaar', 'aadhar'],
    text: 'Highly sensitive ID field. Fill manually only on trusted official forms. Prefer masked Aadhaar where accepted.',
    level: 'danger'
  },
  {
    match: ['nominee'],
    text: 'Write nominee details carefully: full name, relationship, age/date of birth, and address if asked. Use legal spelling.',
    level: 'safe'
  },
  {
    match: ['photo', 'passport size'],
    text: 'Paste a recent passport-size photo in the photo box. Do not staple unless the form says so.',
    level: 'safe'
  },
  {
    match: ['signature', 'sign'],
    text: 'Sign inside the box only. Use the same signature as your bank or ID record if this is a financial or official form.',
    level: 'safe'
  },
  {
    match: ['date', 'place'],
    text: 'Write today’s date and your city/town in the requested boxes. Keep date format consistent across all pages.',
    level: 'safe'
  },
  {
    match: ['declaration', 'undertaking', 'consent'],
    text: 'Read this section before signing. It usually confirms that the information you provided is correct.',
    level: 'warn'
  },
  {
    match: ['income', 'salary', 'occupation', 'profession'],
    text: 'Write the correct income or occupation as asked. Keep proof ready if the form asks for documents.',
    level: 'safe'
  },
  {
    match: ['document', 'attachment', 'proof', 'kyc'],
    text: 'Attach only the documents listed by the form. If self-attestation is required, sign each photocopy.',
    level: 'warn'
  }
];

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getGuide(field) {
  const clean = normalize(field);
  const highRisk = highRiskPatterns.some((word) => clean.includes(word));
  if (highRisk) {
    return {
      text: 'Do not share this value with any AI or unknown person. Fill it manually only on the official trusted form.',
      level: 'danger'
    };
  }

  const directRule = guideRules.find((rule) => rule.match.some((word) => clean.includes(word)));
  if (directRule) return directRule;

  const sensitive = sensitivePatterns.some((word) => clean.includes(word));
  if (sensitive) {
    return {
      text: 'This looks like a sensitive field. Understand the label, then fill the real value manually. Do not paste the actual value into AI.',
      level: 'danger'
    };
  }

  return {
    text: 'Read the label carefully and fill only what is asked. Use clear handwriting, avoid overwriting, and keep format consistent.',
    level: 'safe'
  };
}

function getBadge(level) {
  if (level === 'danger') return '<span class="badge danger">Private</span>';
  if (level === 'warn') return '<span class="badge warn">Check</span>';
  return '<span class="badge safe">Safe</span>';
}

function parseFields(text) {
  return text
    .split(/\n|,|;/)
    .map((field) => field.trim())
    .filter(Boolean)
    .filter((field, index, arr) => arr.findIndex((item) => normalize(item) === normalize(field)) === index)
    .slice(0, 40);
}

function buildChecklist(fields) {
  const hasSignature = fields.some((field) => normalize(field).includes('sign'));
  const hasPhoto = fields.some((field) => normalize(field).includes('photo'));
  const hasSensitive = fields.some((field) => sensitivePatterns.some((word) => normalize(field).includes(word)));

  const checklist = [
    'Check spelling before submission.',
    'Use the requested pen color if the form mentions it.',
    'Avoid cutting, overwriting, or unclear handwriting.',
    'Attach only the documents requested by the form.'
  ];

  if (hasSignature) checklist.push('Make sure all signature boxes are signed.');
  if (hasPhoto) checklist.push('Paste the photo properly inside the photo box.');
  if (hasSensitive) checklist.push('Fill sensitive numbers manually and never share OTP/PIN/password.');

  return checklist;
}

function renderGuide() {
  const fields = parseFields(formText.value);

  if (!fields.length) {
    result.className = 'result empty-state';
    result.innerHTML = '<p>Paste form fields and click generate. Your guide will appear here.</p>';
    return;
  }

  result.className = 'result';

  const cards = fields.map((field) => {
    const guide = getGuide(field);
    return `
      <article class="guide-card">
        <h4>${escapeHtml(field)} ${getBadge(guide.level)}</h4>
        <p>${escapeHtml(guide.text)}</p>
      </article>
    `;
  });

  const checklist = buildChecklist(fields)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  result.innerHTML = `
    ${cards.join('')}
    <article class="guide-card">
      <h4>Final checklist <span class="badge warn">Before submit</span></h4>
      <p>Use this quick checklist after filling the form:</p>
      <ul>${checklist}</ul>
    </article>
  `;
}

async function copyGuide() {
  const text = result.innerText.trim();
  if (!text || result.classList.contains('empty-state')) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied';
    setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
  } catch {
    copyBtn.textContent = 'Copy failed';
    setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
  }
}

generateBtn.addEventListener('click', renderGuide);
sampleBtn.addEventListener('click', () => {
  formText.value = sampleFields;
  renderGuide();
});
clearBtn.addEventListener('click', () => {
  formText.value = '';
  renderGuide();
  formText.focus();
});
copyBtn.addEventListener('click', copyGuide);
