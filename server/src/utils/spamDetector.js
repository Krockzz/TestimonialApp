const DISPOSABLE_EMAIL_DOMAINS = [
  "tempmail.com",
  "10minutemail.com",
  "mailinator.com",
  "guerrillamail.com",
  "yopmail.com"
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function detectSpam({
  text = "",
  email = "",
  sentimentLabel = null,
  existingTexts = [],
  emailSendFailed = false
}) {
  let score = 0;
  const reasons = [];

  if (!EMAIL_REGEX.test(email)) {
    score += 3;
    reasons.push("Invalid email format");
  }


  if (isDisposableEmail(email)) {
    score += 4;
    reasons.push("Disposable email domain");
  }

  if (containsLinkOrContact(text)) {
    score += 3;
    reasons.push("Contains link or contact information");
  }

 
  if (
    text &&
    text.trim().length < 5 &&
    sentimentLabel === "POSITIVE"
  ) {
    score += 3;
    reasons.push("Very short and generic positive testimonial");
  }

 
  if (isDuplicateText(text, existingTexts)) {
    score += 4;
    reasons.push("Duplicate testimonial content");
  }

 
  if (emailSendFailed) {
    score += 1;
    reasons.push("Email delivery failed");
  }

  return {
    status: score >= 5 ? "spam" : "active",
    spam: {
      score,
      reasons
    }
  };
}


function isDisposableEmail(email) {
  if (!email.includes("@")) return false;
  const domain = email.split("@")[1].toLowerCase();
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

function containsLinkOrContact(text) {
  if (!text) return false;

  const linkRegex = /(https?:\/\/|www\.)/i;
  const phoneRegex = /\b\d{10}\b/;
  const whatsappRegex = /whatsapp/i;

  return (
    linkRegex.test(text) ||
    phoneRegex.test(text) ||
    whatsappRegex.test(text)
  );
}

function isDuplicateText(text, existingTexts) {
  if (!text || !existingTexts.length) return false;

  const normalizedText = normalize(text);

  return existingTexts.some(existing =>
    normalize(existing) === normalizedText
  );
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
