/**
 * openCodeEngine.ts
 * Wrapper for OpenCode / Qwen2.5-Coder (qwen/qwen-2.5-coder-32k) via OpenRouter.
 * Provides AI-powered automated shift schedule rule generation and custom payroll JSON workflow export scripts.
 * Includes robust fallback mock handlers for offline development or API failure recovery.
 */

// Define interfaces for inputs and outputs
export interface ScheduleRuleRequest {
  eventName: string;
  staffType: string;
  shiftDurationHours: number;
  maxConsecutiveDays: number;
  customConstraints?: string[];
}

export interface GeneratedScheduleRule {
  ruleId: string;
  ruleName: string;
  description: string;
  conditions: string[];
  generatedCode: string; // e.g., JavaScript filter/validation function string
}

export interface PayrollWorkflowRequest {
  exportFormatName: string;
  fieldsRequired: string[];
  overtimeMultiplier: number;
  taxDeductionRules?: string;
}

export interface GeneratedPayrollScript {
  scriptId: string;
  formatName: string;
  description: string;
  transformationScript: string; // JavaScript code to transform raw timesheet data to target JSON
  exampleOutputJson: string;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'qwen/qwen-2.5-coder-32k';

// Helper to get OpenRouter API key from environment
function getApiKey(): string {
  // Check process.env (Node/Next.js) or import.meta.env (Vite)
  const proc = (globalThis as any).process;
  if (typeof proc !== 'undefined' && proc.env && proc.env.OPENROUTER_API_KEY) {
    return proc.env.OPENROUTER_API_KEY;
  }
  if (typeof (globalThis as any).import !== 'undefined' && (globalThis as any).import?.meta?.env?.OPENROUTER_API_KEY) {
    return (globalThis as any).import.meta.env.OPENROUTER_API_KEY;
  }
  return '';
}

/**
 * Fallback Mock Handlers
 */
function getMockScheduleRule(req: ScheduleRuleRequest): GeneratedScheduleRule {
  return {
    ruleId: `rule-${Date.now()}`,
    ruleName: `${req.eventName} - ${req.staffType} Schedule Constraints`,
    description: `Automated shift constraint rule for ${req.staffType} working ${req.shiftDurationHours}h shifts (Max ${req.maxConsecutiveDays} consecutive days).`,
    conditions: [
      `Shift duration must equal ${req.shiftDurationHours} hours`,
      `Cannot exceed ${req.maxConsecutiveDays} consecutive working days`,
      ...(req.customConstraints || [])
    ],
    generatedCode: `// Auto-generated Qwen2.5-Coder Mock Rule Validator
function validateShiftRule(employee, proposedShifts) {
  // Check shift duration
  const validDuration = proposedShifts.every(s => s.duration === ${req.shiftDurationHours});
  if (!validDuration) return { valid: false, reason: "Invalid shift duration" };
  
  // Check consecutive days
  let consecutive = 0;
  for (const shift of proposedShifts) {
    if (shift.scheduled) consecutive++;
    else consecutive = 0;
    if (consecutive > ${req.maxConsecutiveDays}) return { valid: false, reason: "Max consecutive days exceeded" };
  }
  
  return { valid: true, reason: "Passed all rules" };
}`
  };
}

function getMockPayrollScript(req: PayrollWorkflowRequest): GeneratedPayrollScript {
  return {
    scriptId: `script-${Date.now()}`,
    formatName: req.exportFormatName,
    description: `Custom payroll JSON export script for ${req.exportFormatName} format with overtime multiplier ${req.overtimeMultiplier}x.`,
    transformationScript: `// Auto-generated Qwen2.5-Coder Mock Payroll Transformation Script
function generatePayrollExport(timesheets) {
  return timesheets.map(entry => {
    const regularHours = Math.min(entry.totalHours, 40);
    const overtimeHours = Math.max(0, entry.totalHours - 40);
    const totalPay = (regularHours * entry.baseRate) + (overtimeHours * entry.baseRate * ${req.overtimeMultiplier});
    
    // Apply required fields
    const result = {};
    const required = ${JSON.stringify(req.fieldsRequired)};
    required.forEach(field => {
      if (field === 'totalPay') result[field] = totalPay;
      else result[field] = entry[field] || null;
    });
    
    return result;
  });
}`,
    exampleOutputJson: JSON.stringify([
      { employeeId: "EMP001", totalPay: 1250.00, hoursWorked: 45 },
      { employeeId: "EMP002", totalPay: 980.00, hoursWorked: 38 }
    ], null, 2)
  };
}

/**
 * Direct call to OpenRouter API with fallback handling
 */
async function callOpenRouterAI(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("OpenRouter API key not found. Proceeding with robust fallback mock handlers.");
    return null;
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://evento.app', // Optional but recommended by OpenRouter
        'X-Title': 'Evento OpenCode Engine',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      console.warn(`OpenRouter API error: ${response.status} ${response.statusText}. Using mock fallback.`);
      return null;
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.warn("Exception calling OpenRouter API:", error, ". Using mock fallback.");
    return null;
  }
}

/**
 * Generate automated shift schedule rules using Qwen2.5-Coder / OpenCode
 */
export async function generateShiftScheduleRules(request: ScheduleRuleRequest): Promise<GeneratedScheduleRule> {
  const systemPrompt = `You are OpenCode Engine, an expert automated shift schedule rule generator powered by Qwen2.5-Coder.
Your task is to generate strict JavaScript validation rules and conditions for employee shift scheduling based on user requirements.
Respond ONLY in valid JSON matching the following schema:
{
  "ruleId": "string (generated unique id)",
  "ruleName": "string",
  "description": "string",
  "conditions": ["string", "string"],
  "generatedCode": "string (JavaScript validator function validateShiftRule(employee, proposedShifts))"
}`;

  const userPrompt = `Generate shift schedule rules for event: "${request.eventName}", staff type: "${request.staffType}".
Constraints:
- Shift duration: ${request.shiftDurationHours} hours
- Max consecutive days: ${request.maxConsecutiveDays} days
- Custom constraints: ${JSON.stringify(request.customConstraints || [])}`;

  const responseText = await callOpenRouterAI(systemPrompt, userPrompt);
  
  if (!responseText) {
    return getMockScheduleRule(request);
  }

  try {
    const parsed = JSON.parse(responseText);
    return {
      ruleId: parsed.ruleId || `rule-${Date.now()}`,
      ruleName: parsed.ruleName || `${request.eventName} - ${request.staffType} Rules`,
      description: parsed.description || 'AI-generated shift schedule rule',
      conditions: parsed.conditions || [],
      generatedCode: parsed.generatedCode || getMockScheduleRule(request).generatedCode
    };
  } catch (e) {
    console.warn("Failed to parse OpenRouter response as JSON. Falling back to mock handler.");
    return getMockScheduleRule(request);
  }
}

/**
 * Generate custom payroll JSON workflow export scripts using Qwen2.5-Coder / OpenCode
 */
export async function generatePayrollExportScript(request: PayrollWorkflowRequest): Promise<GeneratedPayrollScript> {
  const systemPrompt = `You are OpenCode Engine, an expert custom payroll JSON workflow script generator powered by Qwen2.5-Coder.
Your task is to generate custom JavaScript export scripts that transform raw timesheet records into tailored JSON workflows for third-party payroll systems.
Respond ONLY in valid JSON matching the following schema:
{
  "scriptId": "string",
  "formatName": "string",
  "description": "string",
  "transformationScript": "string (JavaScript function generatePayrollExport(timesheets))",
  "exampleOutputJson": "string (JSON string representing example output)"
}`;

  const userPrompt = `Generate payroll workflow export script for target format: "${request.exportFormatName}".
Requirements:
- Required fields in output: ${JSON.stringify(request.fieldsRequired)}
- Overtime multiplier: ${request.overtimeMultiplier}
- Tax deduction rules / notes: ${request.taxDeductionRules || 'None'}`;

  const responseText = await callOpenRouterAI(systemPrompt, userPrompt);

  if (!responseText) {
    return getMockPayrollScript(request);
  }

  try {
    const parsed = JSON.parse(responseText);
    return {
      scriptId: parsed.scriptId || `script-${Date.now()}`,
      formatName: parsed.formatName || request.exportFormatName,
      description: parsed.description || `AI-generated payroll script for ${request.exportFormatName}`,
      transformationScript: parsed.transformationScript || getMockPayrollScript(request).transformationScript,
      exampleOutputJson: parsed.exampleOutputJson || getMockPayrollScript(request).exampleOutputJson
    };
  } catch (e) {
    console.warn("Failed to parse OpenRouter response as JSON. Falling back to mock handler.");
    return getMockPayrollScript(request);
  }
}
