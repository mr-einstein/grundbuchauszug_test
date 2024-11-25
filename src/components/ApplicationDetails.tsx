import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import ApplicantForm from './ApplicantForm';

const ApplicationDetails = () => {
  const [purpose, setPurpose] = useState('');
  const [interest, setInterest] = useState('');
  const [otherPurpose, setOtherPurpose] = useState('');
  const [otherInterest, setOtherInterest] = useState('');
  const [showApplicantForm, setShowApplicantForm] = useState(false);

  const purposeOptions = [
    { value: '', label: '- Bitte auswählen -' },
    { value: 'bauantrag', label: 'Bauantrag/Abriss/Nutzungsänderung' },
    { value: 'gutachten', label: 'Gutachten/Bewertung/Wertermittlung' },
    { value: 'finanzierung', label: 'Finanzierung/Kredit/Umschuldung' },
    { value: 'kauf', label: 'Kauf/Verkauf/Beurkundung' },
    { value: 'sonstiges', label: 'Sonstiges' }
  ];

  const interestOptions = [
    { value: 'eigentuemer', label: 'Eigentümer/in (oder Recht im Grundbuch)' },
    { value: 'vollmacht_vorhanden', label: 'Bevollmächtigt (Vollmacht liegt vor)' },
    { value: 'vollmacht_fehlt', label: 'Bevollmächtigt (Vollmacht liegt nicht vor)' },
    { value: 'kauf', label: 'Kauf des Grundstücks/ der Immobilie' },
    { value: 'erbbau', label: 'Erbbauberechtigt' },
    { value: 'erbe', label: 'Im Rahmen einer Erbangelegenheit' },
    { value: 'sonstiges', label: 'Sonstiger Grund' }
  ];

  const needsProof = ['vollmacht_vorhanden', 'kauf', 'erbbau', 'erbe'].includes(interest);
  const showVollmachtNotice = interest === 'vollmacht_fehlt';
  const showOtherReason = interest === 'sonstiges';

  const handleOtherPurposeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 80) {
      setOtherPurpose(value);
    }
  };

  const handleOtherInterestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 255) {
      setOtherInterest(value);
    }
  };

  const handleWeiterClick = () => {
    setShowApplicantForm(true);
    setTimeout(() => {
      document.getElementById('applicant-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleApplicantFormSubmit = (formData: FormData) => {
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <>
      <section className="space-y-6">
        <div className="bg-yellow-100 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900">
            Angaben zum Antrag
          </h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              Soll der Grundbuchauszug beglaubigt werden?
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="beglaubigt" className="text-yellow-500" />
                <span>Ja, beglaubigt</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="beglaubigt" className="text-yellow-500" defaultChecked />
                <span>Nein</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              Soll auf der Lageverzeichniskarte die Eigentümerinfo nachgewiesen werden?
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="eigentuemer" className="text-yellow-500" />
                <span>Ja, mit Eigentümer</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="eigentuemer" className="text-yellow-500" defaultChecked />
                <span>Nein</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              Für welchen Zweck benötigen Sie die Dokumente?
            </label>
            <select
              className="w-full p-3 border rounded-md bg-white"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              {purposeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {purpose === 'sonstiges' && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-bold text-gray-700">
                Sonstiger Zweck
              </label>
              <textarea
                className="w-full p-3 border rounded-md"
                rows={3}
                placeholder="Bitte geben Sie eine kurze Begründung an"
                required
                maxLength={80}
                value={otherPurpose}
                onChange={handleOtherPurposeChange}
              />
              <div className="text-sm text-gray-500">
                {otherPurpose.length} von maximal 80 Zeichen.
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              Welches berechtigte Interesse besteht?
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>
            <select
              className="w-full p-3 border rounded-md bg-white"
              required
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            >
              <option value="">- Bitte auswählen -</option>
              {interestOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {showOtherReason && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-bold text-gray-700">
                Sonstige Begründung für das berechtigte Interesse *
              </label>
              <textarea
                className="w-full p-3 border rounded-md"
                rows={3}
                placeholder="Bitte beschreiben Sie Ihr berechtigtes Interesse"
                required
                maxLength={255}
                value={otherInterest}
                onChange={handleOtherInterestChange}
              />
              <div className="text-sm text-gray-500">
                {otherInterest.length} von maximal 255 Zeichen.
              </div>
            </div>
          )}

          {showVollmachtNotice && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-blue-800">
              Nach Abschluss der Bestellung erhalten Sie von uns eine Vollmachts-Vorlage per E-Mail. 
              Diese, oder auch eine andere Vollmacht des Eigentümers, können Sie uns dann einfach zu 
              einem späteren Zeitpunkt nachreichen. Weitere Informationen dazu erhalten Sie in der E-Mail.
            </div>
          )}

          {needsProof && (
            <>
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-bold text-gray-700">
                  Für das ausgewählte berechtigte Interesse benötigen wir einen Nachweis
                </label>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Zum Beispiel:</li>
                  <li>Vollmacht des Eigentümers</li>
                  <li>Vorsorge- oder Generalvollmacht</li>
                  <li>Kaufvertrag oder Nachweis der Vertragsverhandlungen</li>
                  <li>Maklervertrag</li>
                  <li>Erbschein / Testament / Erbvertrag</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Vollmacht, Kaufvertrag, Erbschein oder sonstigen Nachweis hochladen.</h3>
                    <p className="text-sm text-gray-500">Dateityp: PDF, JPG, PNG (max. 10MB)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="text-yellow-500" id="noProof" />
                <label htmlFor="noProof" className="text-sm text-gray-600">
                  Ich habe gerade keinen Nachweis zur Hand und möchte diesen nachreichen
                </label>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleWeiterClick}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-md font-medium transition-colors"
            >
              Weiter
            </button>
          </div>
        </div>
      </section>

      {showApplicantForm && (
        <div id="applicant-form" className="mt-8">
          <ApplicantForm onSubmit={handleApplicantFormSubmit} />
        </div>
      )}
    </>
  );
};

export default ApplicationDetails;