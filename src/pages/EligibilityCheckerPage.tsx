import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGovFlow } from '../store/GovFlowContext';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  RotateCcw,
  Building2
} from 'lucide-react';

export const EligibilityCheckerPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { getServiceById, citizenProfile } = useGovFlow();
  const navigate = useNavigate();

  const service = getServiceById(serviceId || '');

  // Pre-seed form values from profile where applicable (safe for visitors)
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    return {
      annualIncome: citizenProfile?.employment?.annualIncome ?? 240000,
      category: citizenProfile?.category ?? 'General',
      isEnrolledDegree: true,
      residentState: citizenProfile?.address?.state ?? 'Maharashtra',
      hasAddressProof: true,
      noPuccaHouse: true,
      isFarmer: true,
      hasLandRecord: true,
      hasPANAndGST: true,
      hasRationOrAadhaar: true,
      hasHospitalDischarge: true,
      age: 23,
      isBPL: false,
    };
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!service) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Service Not Found</h2>
        <Link to="/services" className="text-gov-blue text-xs font-bold underline mt-2 block">
          Return to services
        </Link>
      </div>
    );
  }

  const rules = service.eligibilityRules;
  const totalSteps = rules.length;
  const currentRule = rules[currentStep];

  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentRule.field]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Evaluate eligibility
  const evaluations = rules.map(rule => {
    const userVal = answers[rule.field];
    let isSatisfied = true;
    let explanationText = '';

    if (rule.type === 'number') {
      if (rule.max !== undefined && userVal > rule.max) {
        isSatisfied = false;
        explanationText = `Exceeds upper threshold of ₹${rule.max.toLocaleString('en-IN')}`;
      } else if (rule.min !== undefined && userVal < rule.min) {
        isSatisfied = false;
        explanationText = `Below minimum requirement of ${rule.min}`;
      } else {
        explanationText = `Within required criteria range`;
      }
    } else if (rule.type === 'select') {
      if (rule.requiredValue !== undefined && userVal !== rule.requiredValue) {
        isSatisfied = false;
        explanationText = `Must be ${rule.requiredValue}`;
      } else if (rule.options && !rule.options.includes(userVal)) {
        isSatisfied = false;
        explanationText = `Option outside notified list`;
      } else {
        explanationText = `Selected category eligible`;
      }
    } else if (rule.type === 'boolean') {
      if (rule.requiredValue !== undefined && userVal !== rule.requiredValue) {
        isSatisfied = false;
        explanationText = `Requirement not met`;
      } else {
        explanationText = `Mandatory declaration verified`;
      }
    }

    return {
      rule,
      isSatisfied,
      explanationText,
    };
  });

  const isOverallEligible = evaluations.every(e => e.isSatisfied);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Top breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <Link to={`/services/${service.id}`} className="hover:text-gov-blue flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {service.name}</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Interactive Eligibility Assistant</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gov-navy leading-snug mb-1">
          {service.name}
        </h1>
        <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" />
          <span>{service.department}</span>
        </p>

        {!isCompleted ? (
          /* Multi-Step Questionnaire */
          <form onSubmit={handleNext} className="space-y-6">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gov-blue h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Criterion {currentStep + 1}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {currentRule.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {currentRule.explanation}
                </p>
              </div>

              {/* Dynamic Input Control */}
              <div>
                {currentRule.type === 'number' && (
                  <div>
                    <input
                      type="number"
                      value={answers[currentRule.field] ?? ''}
                      onChange={(e) => handleAnswerChange(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gov-blue"
                      required
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Auto-populated from verified profile (editable for simulation).
                    </span>
                  </div>
                )}

                {currentRule.type === 'select' && (
                  <div className="grid grid-cols-2 gap-2">
                    {currentRule.options?.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => handleAnswerChange(opt)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          answers[currentRule.field] === opt
                            ? 'bg-gov-blue text-white border-gov-blue shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {currentRule.type === 'boolean' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleAnswerChange(true)}
                      className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        answers[currentRule.field] === true
                          ? 'bg-gov-blue text-white border-gov-blue shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Yes, Satisfied</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerChange(false)}
                      className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        answers[currentRule.field] === false
                          ? 'bg-gov-blue text-white border-gov-blue shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>No</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30"
              >
                Previous Step
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>{currentStep === totalSteps - 1 ? 'Evaluate Eligibility' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          /* Preliminary Results Screen */
          <div className="space-y-6 animate-fadeIn">
            <div className={`p-6 rounded-2xl border ${
              isOverallEligible 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isOverallEligible ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {isOverallEligible ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {isOverallEligible ? 'You appear eligible!' : 'You may not meet one or more criteria'}
                  </h3>
                  <p className="text-xs opacity-80">
                    Preliminary evaluation based on declared parameters.
                  </p>
                </div>
              </div>
            </div>

            {/* Transparent Criteria Breakdown */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Criteria Evaluation Summary
              </h4>
              {evaluations.map((ev, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                    ev.isSatisfied ? 'bg-slate-50 border-slate-200' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      ev.isSatisfied ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {ev.isSatisfied ? '✓' : '✕'}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{ev.rule.label}</p>
                      <p className="text-[11px] text-slate-500">{ev.rule.explanation}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ev.isSatisfied ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {ev.explanationText}
                  </span>
                </div>
              ))}
            </div>

            {/* Statutory Disclaimer */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-gov-blue flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-700">Notice:</strong> This is an algorithmic preliminary assessment to help you prepare your paperwork. Final legal eligibility and sanction is strictly determined by the concerned government authority upon review of verified documents.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentStep(0);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retest Eligibility
              </button>

              <Link
                to={`/services/${service.id}/apply`}
                className="px-6 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>Proceed to Apply with Auto-fill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
