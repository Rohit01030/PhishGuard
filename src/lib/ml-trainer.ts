import * as tf from '@tensorflow/tfjs';

export interface EmailFeatures {
  hasFailedAuth: number;
  hasSpoofedDomain: number;
  hasSuspiciousLinks: number;
  hasUrgentLanguage: number;
  hasCredentialRequest: number;
  hasGenericGreeting: number;
  hasAttachments: number;
  hasTooGoodOffer: number;
  linkCount: number;
  urlMismatchCount: number;
  urgencyScore: number;
  wordCount: number;
  suspiciousWordCount: number;
}

const SUSPICIOUS_WORDS = [
  'verify', 'confirm', 'update', 'urgent', 'immediate', 'action',
  'click', 'password', 'account', 'suspended', 'locked', 'expires',
  'expiring', 'today', 'agora', 'hoje', 'resgate', 'pontos',
  'reconfirm', 're-confirm', 'authenticate', 'authorization',
  'security alert', 'unusual activity', 'unauthorized access',
  'validate', 'compliance', 'confirm receipt', 'pending',
  'limited', 'restricted', 'disabled', 'frozen', 'deactivated'
];

export function extractFeatures(emailContent: string, analysisResult?: any): EmailFeatures {
  const hasFailedAuth = /spf=(fail|temperror|softfail)|dkim=(fail|none)|compauth=fail/i.test(emailContent) ? 1 : 0;
  const hasSpoofedDomain = /from:.*@(?!bradesco\.com\.br|bbcombr\.com\.br|bb\.com\.br|google\.com|apple\.com|microsoft\.com|amazon\.com|support\.|noreply\.).*\.(com|br|net)|@atendimento\.com\.br|@seguimento|return-path:.*different|from:.*reply-to:|display.*name.*mismatch/i.test(emailContent) ? 1 : 0;
  const hasSuspiciousLinks = /(bit\.ly|tinyurl|goo\.gl|href=.*blog\d+|\.me\/|my.*domain|href=.*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|shortened|ipv4|update-account|verify-account|confirm-account)/i.test(emailContent) ? 1 : 0;
  const hasUrgentLanguage = /(urgent|immediate|expir|hoje|today|agora|now|act now|limited time|verify now|must.*immediately).{0,40}(action|points|pontos|resgate|account|password)/i.test(emailContent) ? 1 : 0;
  const hasCredentialRequest = /(password|social security|ssn|credit card|verify.*account|confirm.*identity|acesso|senha|bank.*details|reconfirm|re-confirm|authenticate|update.*payment|validate.*account)/i.test(emailContent) ? 1 : 0;
  const hasGenericGreeting = /(dear (customer|user|member|valued|sir|madam)|valued (customer|member)|to whom it may concern|vocês?|cliente|user|account holder|dear)/i.test(emailContent) ? 1 : 0;
  const hasAttachments = /attachment.*\.(exe|zip|scr|bat|cmd|vbs|jar|ps1|dll|msi|app)/i.test(emailContent) ? 1 : 0;
  const hasTooGoodOffer = /(congratulations.*prize|won.*prize|claim.*reward|free money|pontos.*expir|resgat|inheritance|lottery|million|exclusive.*offer|limited.*deal)/i.test(emailContent) ? 1 : 0;

  const linkCount = (emailContent.match(/href=/gi) || []).length;
  const urlMismatchCount = (emailContent.match(/href=.*>(?!https?:\/\/)[^<]+</i) || []).length;

  const wordCount = emailContent.split(/\s+/).length;
  const suspiciousWords = emailContent.toLowerCase().match(
    new RegExp(`\\b(${SUSPICIOUS_WORDS.join('|')})\\b`, 'g')
  );
  const suspiciousWordCount = suspiciousWords ? suspiciousWords.length : 0;

  const urgencyScore = hasUrgentLanguage + (suspiciousWordCount > 5 ? 1 : 0);

  return {
    hasFailedAuth,
    hasSpoofedDomain,
    hasSuspiciousLinks,
    hasUrgentLanguage,
    hasCredentialRequest,
    hasGenericGreeting,
    hasAttachments,
    hasTooGoodOffer,
    linkCount: Math.min(linkCount / 10, 1),
    urlMismatchCount: Math.min(urlMismatchCount / 5, 1),
    urgencyScore: Math.min(urgencyScore / 2, 1),
    wordCount: Math.min(wordCount / 1000, 1),
    suspiciousWordCount: Math.min(suspiciousWordCount / 20, 1),
  };
}

export function featuresToArray(features: EmailFeatures): number[] {
  return [
    features.hasFailedAuth,
    features.hasSpoofedDomain,
    features.hasSuspiciousLinks,
    features.hasUrgentLanguage,
    features.hasCredentialRequest,
    features.hasGenericGreeting,
    features.hasAttachments,
    features.hasTooGoodOffer,
    features.linkCount,
    features.urlMismatchCount,
    features.urgencyScore,
    features.wordCount,
    features.suspiciousWordCount,
  ];
}

export async function buildModel(): Promise<tf.Sequential> {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [13], units: 64, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.3 }),
      tf.layers.dense({ units: 32, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 16, activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' }),
    ],
  });

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

export async function trainModel(
  model: tf.Sequential,
  trainingData: { features: EmailFeatures; label: number }[]
): Promise<tf.History | null> {
  if (trainingData.length < 2) return null;

  const xs = tf.tensor2d(trainingData.map(d => featuresToArray(d.features)));
  const ys = tf.tensor2d(trainingData.map(d => [d.label]), [trainingData.length, 1]);

  try {
    const history = await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 8,
      verbose: 0,
      validationSplit: 0.2,
    });

    xs.dispose();
    ys.dispose();

    return history;
  } catch (error) {
    xs.dispose();
    ys.dispose();
    throw error;
  }
}

export async function predictPhishing(
  model: tf.Sequential,
  features: EmailFeatures
): Promise<number> {
  const input = tf.tensor2d([featuresToArray(features)]);
  const prediction = await model.predict(input) as tf.Tensor;
  const result = (await prediction.array())[0][0];

  input.dispose();
  prediction.dispose();

  return Math.round(result * 100);
}

export function calculateMetrics(predictions: number[], labels: number[]): {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
} {
  let tp = 0, fp = 0, fn = 0, tn = 0;

  predictions.forEach((pred, i) => {
    const predicted = pred > 50 ? 1 : 0;
    const actual = labels[i];

    if (predicted === 1 && actual === 1) tp++;
    else if (predicted === 1 && actual === 0) fp++;
    else if (predicted === 0 && actual === 1) fn++;
    else tn++;
  });

  const accuracy = (tp + tn) / (tp + tn + fp + fn) || 0;
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1 = 2 * (precision * recall) / (precision + recall) || 0;

  return { accuracy, precision, recall, f1 };
}
