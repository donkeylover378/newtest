import type { Audit, ChecklistItem, AuditDocument, Query, ActivityEvent, DashboardStats, SavedView, Fund, ExtractedField } from './types';

export const mockFunds: Fund[] = [
  { id: 'f1', name: 'Acme Family Super Fund (sample)', abn: '12 345 678 901', structure: 'individual', trusteeNames: ['John Acme', 'Sarah Acme'], accountantName: 'Daniel Chen', accountantEmail: 'daniel@chenaccounting.com.au', accountantFirm: 'Chen & Associates', yearEndDate: '2025-06-30', createdAt: '2024-01-15T00:00:00Z' },
  { id: 'f2', name: 'Smith Family Super', abn: '23 456 789 012', structure: 'corporate', trusteeNames: ['Michael Smith', 'Jennifer Smith'], accountantName: 'Daniel Chen', accountantEmail: 'daniel@chenaccounting.com.au', accountantFirm: 'Chen & Associates', yearEndDate: '2025-06-30', createdAt: '2024-03-10T00:00:00Z' },
  { id: 'f3', name: 'Nguyen Retirement Fund', abn: '34 567 890 123', structure: 'individual', trusteeNames: ['Tran Nguyen', 'Mai Nguyen'], accountantName: 'Rebecca Torres', accountantEmail: 'rebecca@torresgroup.com.au', accountantFirm: 'Torres Group', yearEndDate: '2025-06-30', createdAt: '2024-02-20T00:00:00Z' },
  { id: 'f4', name: 'Williams Investment Super', abn: '45 678 901 234', structure: 'corporate', trusteeNames: ['David Williams'], accountantName: 'Mark Patterson', accountantEmail: 'mark@pattersonca.com.au', accountantFirm: 'Patterson Chartered Accountants', yearEndDate: '2025-06-30', createdAt: '2024-04-05T00:00:00Z' },
  { id: 'f5', name: 'O\'Brien Super Fund', abn: '56 789 012 345', structure: 'individual', trusteeNames: ['Patrick O\'Brien', 'Claire O\'Brien'], accountantName: 'Daniel Chen', accountantEmail: 'daniel@chenaccounting.com.au', accountantFirm: 'Chen & Associates', yearEndDate: '2025-06-30', createdAt: '2024-05-15T00:00:00Z' },
  { id: 'f6', name: 'Patel Super Fund', abn: '67 890 123 456', structure: 'individual_corporate', trusteeNames: ['Raj Patel', 'Priya Patel'], accountantName: 'Rebecca Torres', accountantEmail: 'rebecca@torresgroup.com.au', accountantFirm: 'Torres Group', yearEndDate: '2025-03-31', createdAt: '2024-06-01T00:00:00Z' },
  { id: 'f7', name: 'Chen Family Retirement', abn: '78 901 234 567', structure: 'corporate', trusteeNames: ['Wei Chen', 'Lin Chen'], accountantName: 'Mark Patterson', accountantEmail: 'mark@pattersonca.com.au', accountantFirm: 'Patterson Chartered Accountants', yearEndDate: '2025-06-30', createdAt: '2024-07-10T00:00:00Z' },
  { id: 'f8', name: 'Thompson Pension Fund', abn: '89 012 345 678', structure: 'individual', trusteeNames: ['Robert Thompson', 'Margaret Thompson'], accountantName: 'Daniel Chen', accountantEmail: 'daniel@chenaccounting.com.au', accountantFirm: 'Chen & Associates', yearEndDate: '2025-06-30', createdAt: '2024-08-20T00:00:00Z' },
];

export const mockAudits: Audit[] = [
  { id: 'a1', fundId: 'f1', fundName: 'Acme Family Super Fund (sample)', fundAbn: '12 345 678 901', year: 2024, status: 'signed', progress: 100, queriesOpen: 0, autoEnabled: true, autoItemsCompleted: 42, totalItems: 68, completedItems: 68, owner: 'Sarah Mitchell', lastActivity: '2024-09-15T14:30:00Z', yearEndDate: '2024-06-30', daysInStatus: 120, findingsCount: 1, documentsCount: 8, timeSavedMinutes: 134, createdAt: '2024-07-01T00:00:00Z', updatedAt: '2024-09-15T14:30:00Z' },
  { id: 'a2', fundId: 'f1', fundName: 'Acme Family Super Fund (sample)', fundAbn: '12 345 678 901', year: 2025, status: 'in_progress', progress: 62, queriesOpen: 2, autoEnabled: true, autoItemsCompleted: 31, totalItems: 71, completedItems: 44, owner: 'Sarah Mitchell', lastActivity: '2025-08-20T09:15:00Z', yearEndDate: '2025-06-30', daysInStatus: 14, findingsCount: 2, documentsCount: 12, timeSavedMinutes: 87, createdAt: '2025-07-01T00:00:00Z', updatedAt: '2025-08-20T09:15:00Z' },
  { id: 'a3', fundId: 'f2', fundName: 'Smith Family Super', fundAbn: '23 456 789 012', year: 2025, status: 'awaiting_accountant', progress: 45, queriesOpen: 3, autoEnabled: false, autoItemsCompleted: 0, totalItems: 65, completedItems: 29, owner: 'Sarah Mitchell', lastActivity: '2025-08-18T11:00:00Z', yearEndDate: '2025-06-30', daysInStatus: 7, findingsCount: 0, documentsCount: 6, timeSavedMinutes: 0, createdAt: '2025-07-15T00:00:00Z', updatedAt: '2025-08-18T11:00:00Z' },
  { id: 'a4', fundId: 'f3', fundName: 'Nguyen Retirement Fund', fundAbn: '34 567 890 123', year: 2025, status: 'in_progress', progress: 28, queriesOpen: 1, autoEnabled: true, autoItemsCompleted: 15, totalItems: 70, completedItems: 20, owner: 'Sarah Mitchell', lastActivity: '2025-08-19T16:45:00Z', yearEndDate: '2025-06-30', daysInStatus: 5, findingsCount: 1, documentsCount: 9, timeSavedMinutes: 45, createdAt: '2025-08-01T00:00:00Z', updatedAt: '2025-08-19T16:45:00Z' },
  { id: 'a5', fundId: 'f4', fundName: 'Williams Investment Super', fundAbn: '45 678 901 234', year: 2025, status: 'review', progress: 92, queriesOpen: 0, autoEnabled: true, autoItemsCompleted: 38, totalItems: 66, completedItems: 61, owner: 'James Park', lastActivity: '2025-08-21T10:30:00Z', yearEndDate: '2025-06-30', daysInStatus: 3, findingsCount: 2, documentsCount: 14, timeSavedMinutes: 112, createdAt: '2025-07-10T00:00:00Z', updatedAt: '2025-08-21T10:30:00Z' },
  { id: 'a6', fundId: 'f5', fundName: 'O\'Brien Super Fund', fundAbn: '56 789 012 345', year: 2025, status: 'not_started', progress: 0, queriesOpen: 0, autoEnabled: false, autoItemsCompleted: 0, totalItems: 64, completedItems: 0, owner: 'Sarah Mitchell', lastActivity: '2025-08-15T08:00:00Z', yearEndDate: '2025-06-30', daysInStatus: 10, findingsCount: 0, documentsCount: 0, timeSavedMinutes: 0, createdAt: '2025-08-15T00:00:00Z', updatedAt: '2025-08-15T08:00:00Z' },
  { id: 'a7', fundId: 'f6', fundName: 'Patel Super Fund', fundAbn: '67 890 123 456', year: 2025, status: 'in_progress', progress: 55, queriesOpen: 1, autoEnabled: false, autoItemsCompleted: 0, totalItems: 68, completedItems: 37, owner: 'James Park', lastActivity: '2025-08-20T14:00:00Z', yearEndDate: '2025-03-31', daysInStatus: 8, findingsCount: 1, documentsCount: 7, timeSavedMinutes: 0, createdAt: '2025-04-01T00:00:00Z', updatedAt: '2025-08-20T14:00:00Z' },
  { id: 'a8', fundId: 'f7', fundName: 'Chen Family Retirement', fundAbn: '78 901 234 567', year: 2025, status: 'signed', progress: 100, queriesOpen: 0, autoEnabled: true, autoItemsCompleted: 40, totalItems: 67, completedItems: 67, owner: 'Sarah Mitchell', lastActivity: '2025-08-10T16:00:00Z', yearEndDate: '2025-06-30', daysInStatus: 12, findingsCount: 0, documentsCount: 10, timeSavedMinutes: 98, createdAt: '2025-07-05T00:00:00Z', updatedAt: '2025-08-10T16:00:00Z' },
  { id: 'a9', fundId: 'f8', fundName: 'Thompson Pension Fund', fundAbn: '89 012 345 678', year: 2025, status: 'awaiting_accountant', progress: 38, queriesOpen: 4, autoEnabled: false, autoItemsCompleted: 0, totalItems: 72, completedItems: 27, owner: 'James Park', lastActivity: '2025-08-17T13:20:00Z', yearEndDate: '2025-06-30', daysInStatus: 11, findingsCount: 0, documentsCount: 5, timeSavedMinutes: 0, createdAt: '2025-08-01T00:00:00Z', updatedAt: '2025-08-17T13:20:00Z' },
  { id: 'a10', fundId: 'f2', fundName: 'Smith Family Super', fundAbn: '23 456 789 012', year: 2024, status: 'signed', progress: 100, queriesOpen: 0, autoEnabled: false, autoItemsCompleted: 0, totalItems: 65, completedItems: 65, owner: 'Sarah Mitchell', lastActivity: '2024-10-20T11:00:00Z', yearEndDate: '2024-06-30', daysInStatus: 300, findingsCount: 0, documentsCount: 8, timeSavedMinutes: 0, createdAt: '2024-07-15T00:00:00Z', updatedAt: '2024-10-20T11:00:00Z' },
];

const sampleExtractedFields: ExtractedField[] = [
  { id: 'ef1', label: 'Account holder', value: 'Acme Family Super Fund', confidence: 0.98, confirmed: true },
  { id: 'ef2', label: 'Account number', value: '062-000 1234 5678', confidence: 0.95, confirmed: false },
  { id: 'ef3', label: 'Opening balance', value: '$245,890.12', confidence: 0.92, confirmed: false },
  { id: 'ef4', label: 'Closing balance', value: '$267,432.56', confidence: 0.97, confirmed: false },
  { id: 'ef5', label: 'Interest earned', value: '$1,012.50', confidence: 0.88, confirmed: false },
  { id: 'ef6', label: 'Statement period', value: '01/07/2024 - 30/06/2025', confidence: 0.99, confirmed: true },
];

export const mockDocuments: AuditDocument[] = [
  { id: 'd1', auditId: 'a2', filename: 'CommBank_Statement_FY25.pdf', classification: 'bank_statement', classificationLabel: 'Bank Statement', uploadedAt: '2025-08-01T10:00:00Z', autoClassified: true, confidence: 0.96, extractedFields: sampleExtractedFields, pageCount: 4, fileSize: 2400000 },
  { id: 'd2', auditId: 'a2', filename: 'Acme_Trust_Deed_2018.pdf', classification: 'trust_deed', classificationLabel: 'Trust Deed', uploadedAt: '2025-07-15T09:00:00Z', autoClassified: true, confidence: 0.99, pageCount: 28, fileSize: 5800000 },
  { id: 'd3', auditId: 'a2', filename: 'Financial_Statements_FY25.pdf', classification: 'financial_statements', classificationLabel: 'Financial Statements', uploadedAt: '2025-08-05T14:30:00Z', autoClassified: true, confidence: 0.94, pageCount: 12, fileSize: 1800000 },
  { id: 'd4', auditId: 'a2', filename: 'CommSec_Holdings_FY25.pdf', classification: 'investment_report', classificationLabel: 'Investment Report', uploadedAt: '2025-08-10T11:00:00Z', autoClassified: true, confidence: 0.91, pageCount: 6, fileSize: 980000 },
  { id: 'd5', auditId: 'a2', filename: 'Member_Statement_JohnAcme.pdf', classification: 'member_statement', classificationLabel: 'Member Statement', uploadedAt: '2025-08-12T08:45:00Z', autoClassified: true, confidence: 0.93, pageCount: 2, fileSize: 450000 },
];

export const mockChecklistItems: ChecklistItem[] = [
  { id: 'ci1', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Revenue', questionText: 'Have all sources of revenue been identified and correctly recorded in the financial statements?', status: 'pass', sisReference: 'ASA200', lastChanged: '2025-08-18T10:00:00Z', autoCompleted: true, autoConfidence: 0.94, notes: 'Revenue sources verified against bank statements and investment reports.', evidenceIds: ['d1', 'd3'], order: 1 },
  { id: 'ci2', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Revenue', questionText: 'Is interest income correctly calculated and recorded, including franking credits?', status: 'auto', sisReference: 'ASA200', lastChanged: '2025-08-18T10:01:00Z', autoCompleted: true, autoConfidence: 0.91, notes: '', evidenceIds: ['d1'], order: 2 },
  { id: 'ci3', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Revenue', questionText: 'Have dividend and distribution income been recorded at correct amounts with correct imputation credits?', status: 'query', sisReference: 'ASA200', lastChanged: '2025-08-17T14:00:00Z', autoCompleted: false, notes: 'Variance of $12.50 between GL and CommSec statement.', evidenceIds: ['d4'], queryId: 'q1', order: 3 },
  { id: 'ci4', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Expenses', questionText: 'Are all fund expenses properly authorised and in accordance with the trust deed?', status: 'pass', sisReference: 'ASA200', lastChanged: '2025-08-16T09:30:00Z', autoCompleted: true, autoConfidence: 0.96, notes: 'All expenses verified. Insurance premiums, accounting and audit fees, ASIC levy confirmed.', evidenceIds: ['d3'], order: 4 },
  { id: 'ci5', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Expenses', questionText: 'Have management and administration fees been charged at arm\'s length rates?', status: 'pass', sisReference: 's109', lastChanged: '2025-08-16T09:45:00Z', autoCompleted: false, notes: 'Fees consistent with market rates for similar funds.', evidenceIds: ['d3'], order: 5 },
  { id: 'ci6', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Assets', questionText: 'Have all assets been valued at market value as at the reporting date?', status: 'auto', sisReference: 'r13.14', lastChanged: '2025-08-19T08:00:00Z', autoCompleted: true, autoConfidence: 0.89, notes: '', evidenceIds: ['d4'], order: 6 },
  { id: 'ci7', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Assets', questionText: 'Is the bank reconciliation complete and are there any unexplained reconciling items?', status: 'pass', sisReference: 'ASA200', lastChanged: '2025-08-18T11:00:00Z', autoCompleted: true, autoConfidence: 0.97, notes: 'Bank reconciliation complete. No unexplained items.', evidenceIds: ['d1'], order: 7 },
  { id: 'ci8', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Liabilities', questionText: 'Have all liabilities been correctly identified and disclosed?', status: 'todo', sisReference: 'ASA200', lastChanged: '2025-08-15T00:00:00Z', autoCompleted: false, notes: '', evidenceIds: [], order: 8 },
  { id: 'ci9', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Member Benefits', questionText: 'Do member opening balances agree to prior year closing balances?', status: 'pass', sisReference: 'ASA200', lastChanged: '2025-08-17T15:00:00Z', autoCompleted: true, autoConfidence: 0.99, notes: 'Agreed to prior year signed accounts.', evidenceIds: ['d5'], order: 9 },
  { id: 'ci10', auditId: 'a2', phase: 'A', phaseLabel: 'A. Financial Statements', section: 'Member Benefits', questionText: 'Are contributions allocated to members correctly and within legislative caps?', status: 'auto', sisReference: 'ASA200', lastChanged: '2025-08-19T08:05:00Z', autoCompleted: true, autoConfidence: 0.93, notes: '', evidenceIds: ['d3', 'd5'], order: 10 },
  { id: 'ci11', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Sole Purpose', questionText: 'Is the fund maintained solely for the provision of retirement benefits or approved purposes (s62)?', status: 'pass', sisReference: 's62', lastChanged: '2025-08-18T12:00:00Z', autoCompleted: false, notes: 'No evidence of personal use of fund assets. All investments appear to be for retirement purposes.', evidenceIds: [], order: 11 },
  { id: 'ci12', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Sole Purpose', questionText: 'Are all fund assets held separately from personal assets of members and trustees (s52)?', status: 'pass', sisReference: 's52', lastChanged: '2025-08-18T12:10:00Z', autoCompleted: true, autoConfidence: 0.95, notes: 'All assets held in name of fund. Bank accounts in fund name confirmed.', evidenceIds: ['d1'], order: 12 },
  { id: 'ci13', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Investment Strategy', questionText: 'Does the fund have a current, documented investment strategy (SISR 4.09)?', status: 'pass', sisReference: 'r4.09', lastChanged: '2025-08-17T10:00:00Z', autoCompleted: false, notes: 'Reviewed investment strategy dated March 2025. Covers risk, return, liquidity, diversification, and insurance.', evidenceIds: ['d2'], order: 13 },
  { id: 'ci14', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Investment Strategy', questionText: 'Have investments been made in accordance with the investment strategy?', status: 'auto', sisReference: 'r4.09', lastChanged: '2025-08-19T08:10:00Z', autoCompleted: true, autoConfidence: 0.87, notes: '', evidenceIds: ['d4'], order: 14 },
  { id: 'ci15', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Lending & Borrowing', questionText: 'Has the fund lent money to or provided financial assistance to members or relatives (s65)?', status: 'na', sisReference: 's65', lastChanged: '2025-08-18T13:00:00Z', autoCompleted: true, autoConfidence: 0.98, notes: 'No loans to members identified.', evidenceIds: [], order: 15 },
  { id: 'ci16', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Lending & Borrowing', questionText: 'Has the fund borrowed money other than under a compliant LRBA (s67)?', status: 'na', sisReference: 's67', lastChanged: '2025-08-18T13:05:00Z', autoCompleted: true, autoConfidence: 0.97, notes: 'No borrowings identified.', evidenceIds: [], order: 16 },
  { id: 'ci17', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Related Party', questionText: 'Have any assets been acquired from related parties (s66)?', status: 'fail', sisReference: 's66', lastChanged: '2025-08-19T09:00:00Z', autoCompleted: false, notes: 'Property at 42 Elm Street appears to have been acquired from a related entity below market value.', evidenceIds: [], findingId: 'fi1', order: 17 },
  { id: 'ci18', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Related Party', questionText: 'Are in-house assets within the 5% limit (s84)?', status: 'todo', sisReference: 's84', lastChanged: '2025-08-15T00:00:00Z', autoCompleted: false, notes: '', evidenceIds: [], order: 18 },
  { id: 'ci19', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Trustees', questionText: 'Have all trustees signed the required declarations (s35B)?', status: 'pass', sisReference: 's35B', lastChanged: '2025-08-16T14:00:00Z', autoCompleted: true, autoConfidence: 0.96, notes: 'Trustee declarations sighted for both John and Sarah Acme.', evidenceIds: ['d2'], order: 19 },
  { id: 'ci20', auditId: 'a2', phase: 'B', phaseLabel: 'B. Compliance', section: 'Residency', questionText: 'Is the fund an Australian resident fund for the entire year (s35A)?', status: 'pass', sisReference: 's35A', lastChanged: '2025-08-16T14:10:00Z', autoCompleted: true, autoConfidence: 0.99, notes: 'Both trustees are Australian residents. Central management and control in Australia.', evidenceIds: [], order: 20 },
];

export const mockQueries: Query[] = [
  {
    id: 'q1', auditId: 'a2', checklistItemId: 'ci3', subject: 'Dividend income variance — CommSec holdings', body: 'We have identified a variance of $12.50 between the dividend income per the general ledger and the CommSec holdings statement. Could you please provide a reconciliation or explain the difference?', status: 'sent', accountantName: 'Daniel Chen', accountantEmail: 'daniel@chenaccounting.com.au', raisedAt: '2025-08-17T14:00:00Z',
    messages: [
      { id: 'qm1', from: 'Sarah Mitchell', fromRole: 'auditor', body: 'We have identified a variance of $12.50 between the dividend income per the general ledger and the CommSec holdings statement. Could you please provide a reconciliation or explain the difference?', timestamp: '2025-08-17T14:00:00Z' },
    ],
  },
  {
    id: 'q2', auditId: 'a2', checklistItemId: 'ci17', subject: 'Related party property acquisition — 42 Elm Street', body: 'Our review indicates the property at 42 Elm Street may have been acquired from a related entity. Could you confirm the identity of the vendor and provide an independent valuation at the date of acquisition?', status: 'responded', accountantName: 'Daniel Chen', accountantEmail: 'daniel@chenaccounting.com.au', raisedAt: '2025-08-19T09:30:00Z', respondedAt: '2025-08-20T11:00:00Z',
    messages: [
      { id: 'qm2', from: 'Sarah Mitchell', fromRole: 'auditor', body: 'Our review indicates the property at 42 Elm Street may have been acquired from a related entity. Could you confirm the identity of the vendor and provide an independent valuation at the date of acquisition?', timestamp: '2025-08-19T09:30:00Z' },
      { id: 'qm3', from: 'Daniel Chen', fromRole: 'accountant', body: 'The property was acquired from Acme Holdings Pty Ltd, which is a company controlled by John Acme. We have an independent valuation from Knight Frank dated 15 March 2025 showing market value of $650,000. The acquisition price was $620,000. I will send the valuation report shortly.', timestamp: '2025-08-20T11:00:00Z' },
    ],
  },
  {
    id: 'q3', auditId: 'a3', subject: 'Missing bank statements — July to September 2024', body: 'We require bank statements for the Westpac operating account for the period July to September 2024. Could you please provide these at your earliest convenience?', status: 'sent', accountantName: 'Daniel Chen', accountantEmail: 'daniel@chenaccounting.com.au', raisedAt: '2025-08-16T10:00:00Z',
    messages: [
      { id: 'qm4', from: 'Sarah Mitchell', fromRole: 'auditor', body: 'We require bank statements for the Westpac operating account for the period July to September 2024. Could you please provide these at your earliest convenience?', timestamp: '2025-08-16T10:00:00Z' },
    ],
  },
  {
    id: 'q4', auditId: 'a2', subject: 'Insurance cover within super — member statement query', body: 'The member statement for John Acme shows insurance premiums of $2,340 but we cannot identify these in the fund expenses. Can you confirm how insurance is arranged and where premiums are recorded?', status: 'draft', accountantName: 'Daniel Chen', accountantEmail: 'daniel@chenaccounting.com.au', raisedAt: '2025-08-20T15:00:00Z',
    messages: [
      { id: 'qm5', from: 'Sarah Mitchell', fromRole: 'auditor', body: 'The member statement for John Acme shows insurance premiums of $2,340 but we cannot identify these in the fund expenses. Can you confirm how insurance is arranged and where premiums are recorded?', timestamp: '2025-08-20T15:00:00Z' },
    ],
  },
];

export const mockActivityEvents: ActivityEvent[] = [
  { id: 'ae1', type: 'document_uploaded', actor: 'Sarah Mitchell', actorInitials: 'SM', description: 'Uploaded CommSec_Holdings_FY25.pdf to Acme Family Super Fund', timestamp: '2025-08-20T09:15:00Z', auditId: 'a2', fundName: 'Acme Family Super Fund' },
  { id: 'ae2', type: 'auto_completed', actor: 'AuditHub Auto', actorInitials: 'AI', description: 'Completed 4 checklist items on Acme Family Super Fund', timestamp: '2025-08-19T08:10:00Z', auditId: 'a2', fundName: 'Acme Family Super Fund' },
  { id: 'ae3', type: 'finding_raised', actor: 'Sarah Mitchell', actorInitials: 'SM', description: 'Raised finding: Related party acquisition below market value', timestamp: '2025-08-19T09:00:00Z', auditId: 'a2', fundName: 'Acme Family Super Fund' },
  { id: 'ae4', type: 'query_replied', actor: 'Daniel Chen', actorInitials: 'DC', description: 'Replied to query on related party property acquisition', timestamp: '2025-08-20T11:00:00Z', auditId: 'a2', fundName: 'Acme Family Super Fund' },
  { id: 'ae5', type: 'status_change', actor: 'James Park', actorInitials: 'JP', description: 'Moved Williams Investment Super to Review', timestamp: '2025-08-21T10:30:00Z', auditId: 'a5', fundName: 'Williams Investment Super' },
  { id: 'ae6', type: 'query_sent', actor: 'Sarah Mitchell', actorInitials: 'SM', description: 'Sent 3 queries to Daniel Chen on Smith Family Super', timestamp: '2025-08-18T11:00:00Z', auditId: 'a3', fundName: 'Smith Family Super' },
  { id: 'ae7', type: 'audit_signed', actor: 'Sarah Mitchell', actorInitials: 'SM', description: 'Signed Chen Family Retirement FY25 audit', timestamp: '2025-08-10T16:00:00Z', auditId: 'a8', fundName: 'Chen Family Retirement' },
  { id: 'ae8', type: 'item_reviewed', actor: 'James Park', actorInitials: 'JP', description: 'Reviewed investment strategy compliance on Patel Super Fund', timestamp: '2025-08-20T14:00:00Z', auditId: 'a7', fundName: 'Patel Super Fund' },
  { id: 'ae9', type: 'document_uploaded', actor: 'Sarah Mitchell', actorInitials: 'SM', description: 'Uploaded Member_Statement_JohnAcme.pdf to Acme Family Super Fund', timestamp: '2025-08-12T08:45:00Z', auditId: 'a2', fundName: 'Acme Family Super Fund' },
  { id: 'ae10', type: 'note_added', actor: 'Sarah Mitchell', actorInitials: 'SM', description: 'Added working paper notes on bank reconciliation', timestamp: '2025-08-18T11:30:00Z', auditId: 'a2', fundName: 'Acme Family Super Fund' },
];

export const mockDashboardStats: DashboardStats = {
  fundsInAudit: 7,
  signedThisFY: 2,
  timeSavedHours: 5.5,
  planTier: 'Auto',
  fundsInAuditTrend: [3, 4, 4, 5, 5, 6, 5, 6, 7, 7, 7, 7],
  signedTrend: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2],
  timeSavedTrend: [0, 0, 0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.8, 5.5],
};

export const mockSavedViews: SavedView[] = [
  { id: 'sv1', name: 'All', filters: {}, isDefault: true },
  { id: 'sv2', name: 'In progress', filters: { status: 'in_progress' } },
  { id: 'sv3', name: 'Awaiting accountant', filters: { status: 'awaiting_accountant' } },
  { id: 'sv4', name: 'Auto active', filters: { autoEnabled: true } },
  { id: 'sv5', name: 'Overdue', filters: { overdue: true } },
  { id: 'sv6', name: 'Signed this month', filters: { signedRecently: true } },
];
