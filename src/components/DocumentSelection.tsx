import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import type { Document } from '../context/DocumentContext';

const DocumentSelection = () => {
  const { selectedDocuments, toggleDocument } = useDocuments();

  const documents: Document[] = [
    { id: 'grundbuchauszug', name: 'Grundbuchauszug', price: 29.90 },
    { id: 'liegenschaftskarte', name: 'Liegenschaftskarte', price: 29.90 },
    { id: 'teilungserklaerung', name: 'Teilungserklärung', price: 24.90 },
    { id: 'altlastenauskunft', name: 'Altlastenverzeichnis', price: 24.90 },
    { id: 'baulasten', name: 'Baulastenverzeichnis', price: 24.90 },
    { id: 'erschliessung', name: 'Erschließungsbesch.', price: 19.90 },
    { id: 'bebauungsplan', name: 'Bebauungsplan', price: 19.90 },
  ];

  const isSelected = (id: string) => selectedDocuments.some(doc => doc.id === id);

  return (
    <section id="document-selection" className="space-y-6">
      <div className="bg-yellow-100 p-4 rounded-md">
        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          Was möchten Sie beantragen?
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {documents.slice(0, 6).map((doc) => (
          <button
            key={doc.id}
            onClick={() => toggleDocument(doc)}
            className={`p-4 rounded-md text-left transition-colors ${
              isSelected(doc.id)
                ? 'bg-yellow-400 hover:bg-yellow-500'
                : 'bg-yellow-100 hover:bg-yellow-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{doc.name}</span>
              <span className="text-gray-600">{doc.price.toFixed(2)}€</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1">
        <button
          onClick={() => toggleDocument(documents[6])}
          className={`p-4 rounded-md text-left transition-colors ${
            isSelected(documents[6].id)
              ? 'bg-yellow-400 hover:bg-yellow-500'
              : 'bg-yellow-100 hover:bg-yellow-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{documents[6].name}</span>
            <span className="text-gray-600">{documents[6].price.toFixed(2)}€</span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default DocumentSelection;