import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisResult {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: {
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    found: boolean;
  }[];
  summary: string;
  recommendations: string[];
}

function analyzeEmail(emailContent: string): AnalysisResult {
  const indicators = [
    {
      category: 'Suspicious Links',
      severity: 'high' as const,
      description: 'Contains suspicious or shortened URLs',
      pattern: /(bit\.ly|tinyurl|goo\.gl|shortened|click here now|urgent.*link)/i,
    },
    {
      category: 'Urgent Language',
      severity: 'medium' as const,
      description: 'Uses urgent or threatening language',
      pattern: /(urgent|immediate action|account.*suspended|verify.*now|act now|limited time|expires|suspended)/i,
    },
    {
      category: 'Request for Credentials',
      severity: 'critical' as const,
      description: 'Requests sensitive information like passwords or SSN',
      pattern: /(password|social security|ssn|credit card|bank account|verify.*account|confirm.*identity|update.*payment)/i,
    },
    {
      category: 'Spoofed Sender',
      severity: 'high' as const,
      description: 'Sender address may be spoofed or suspicious',
      pattern: /(from:.*@(?!.*\.(com|org|net|edu|gov))|reply-to:.*@(?!.*\.(com|org|net|edu|gov)))/i,
    },
    {
      category: 'Generic Greeting',
      severity: 'low' as const,
      description: 'Uses generic greetings instead of your name',
      pattern: /(dear (customer|user|member|sir|madam)|valued (customer|member)|to whom it may concern)/i,
    },
    {
      category: 'Poor Grammar',
      severity: 'medium' as const,
      description: 'Contains spelling or grammatical errors',
      pattern: /(\b\w+\s+\1\b|recieve|occured|seperate|definately|priviledge|untill)/i,
    },
    {
      category: 'Suspicious Attachments',
      severity: 'high' as const,
      description: 'Contains potentially dangerous file attachments',
      pattern: /attachment.*\.(exe|zip|scr|bat|cmd|vbs|js|jar)/i,
    },
    {
      category: 'Prize or Money Offer',
      severity: 'high' as const,
      description: 'Offers prizes, money, or too-good-to-be-true deals',
      pattern: /(you.*won|congratulations.*prize|claim.*reward|million dollars|inheritance|lottery|free money)/i,
    },
    {
      category: 'Mismatched URLs',
      severity: 'critical' as const,
      description: 'Link text does not match actual URL destination',
      pattern: /(href=["]https?:\/\/[^">]+[^">]*>(?!https?:\/\/)[^<]+<\/a>)/i,
    },
    {
      category: 'IP Address Links',
      severity: 'high' as const,
      description: 'Links contain IP addresses instead of domain names',
      pattern: /(https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i,
    },
  ];

  const foundIndicators = indicators.map(indicator => ({
    category: indicator.category,
    severity: indicator.severity,
    description: indicator.description,
    found: indicator.pattern.test(emailContent),
  }));

  const severityWeights = {
    low: 10,
    medium: 20,
    high: 30,
    critical: 40,
  };

  const foundCount = foundIndicators.filter(i => i.found).length;
  const totalWeight = foundIndicators
    .filter(i => i.found)
    .reduce((sum, i) => sum + severityWeights[i.severity], 0);

  let riskScore = Math.min(100, totalWeight + (foundCount * 5));
  
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (riskScore < 25) riskLevel = 'low';
  else if (riskScore < 50) riskLevel = 'medium';
  else if (riskScore < 75) riskLevel = 'high';
  else riskLevel = 'critical';

  const recommendations: string[] = [];
  
  if (foundIndicators.find(i => i.category === 'Request for Credentials' && i.found)) {
    recommendations.push('Never share passwords or sensitive information via email');
  }
  if (foundIndicators.find(i => i.category === 'Suspicious Links' && i.found)) {
    recommendations.push('Do not click on suspicious links - verify URLs before clicking');
  }
  if (foundIndicators.find(i => i.category === 'Suspicious Attachments' && i.found)) {
    recommendations.push('Do not download or open unexpected attachments');
  }
  if (riskLevel === 'high' || riskLevel === 'critical') {
    recommendations.push('Mark this email as spam and delete it immediately');
    recommendations.push('Report this to your IT security team if received at work');
  }
  if (riskLevel === 'medium') {
    recommendations.push('Verify the sender through alternative means before taking action');
  }
  
  recommendations.push('When in doubt, contact the supposed sender directly using known contact information');

  const summary = riskLevel === 'critical' 
    ? 'This email shows multiple signs of a phishing attempt and should be treated as highly dangerous.'
    : riskLevel === 'high'
    ? 'This email contains several suspicious elements that strongly suggest it may be a phishing attempt.'
    : riskLevel === 'medium'
    ? 'This email has some concerning characteristics. Exercise caution and verify before taking action.'
    : 'This email appears relatively safe, but always stay vigilant.';

  return {
    riskScore,
    riskLevel,
    indicators: foundIndicators,
    summary,
    recommendations,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { emailContent } = await req.json();

    if (!emailContent || typeof emailContent !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email content is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const analysis = analyzeEmail(emailContent);

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Analysis failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});