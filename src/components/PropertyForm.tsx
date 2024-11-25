import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import DocumentSelection from './DocumentSelection';
import ApplicationDetails from './ApplicationDetails';

const PropertyForm = () => {
  const [showNextSections, setShowNextSections] = useState(false);
  const [plz, setPlz] = useState('');
  const [city, setCity] = useState('');

  const handlePlzChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setPlz(value);
    
    if (value.length === 5) {
      try {
        const response = await fetch(`https://api.zippopotam.us/DE/${value}`);
        if (response.ok) {
          const data = await response.json();
          setCity(data.places[0]['place name']);
        } else {
          setCity('');
        }
      } catch (error) {
        console.error('Error fetching city:', error);
        setCity('');
      }
    } else {
      setCity('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNextSections(true);
    setTimeout(() => {
      document.getElementById('document-selection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-yellow-100 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900">
            Angaben zum Grundstück oder der Immobilie
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              Straße
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
              placeholder="Straßenname"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              Hausnummer
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
              placeholder="Nr."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-gray-700">PLZ</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
              placeholder="Postleitzahl"
              required
              value={plz}
              onChange={handlePlzChange}
              maxLength={5}
              pattern="[0-9]{5}"
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-gray-700">Ort</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md bg-gray-50"
              placeholder="wird automatisch befüllt"
              value={city}
              readOnly
            />
          </div>
        </div>

        <div className="text-yellow-600 flex items-start gap-2 py-2">
          <span className="text-lg">•</span>
          <p className="text-sm">
            Um eine schnellere Bearbeitung zu ermöglichen, bitten wir Sie auch die nachfolgenden Daten anzugeben.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              Flur und Flurstücknummer (falls bekannt)
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              Blattnummer (falls bekannt)
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-gray-700">
            Bemerkung (falls bekannt)
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </label>
          <textarea
            className="w-full p-3 border rounded-md"
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-md font-medium transition-colors"
          >
            Weiter
          </button>
        </div>
      </form>

      {showNextSections && (
        <div className="mt-8 space-y-8">
          <DocumentSelection />
          <ApplicationDetails />
        </div>
      )}
    </>
  );
};

export default PropertyForm;