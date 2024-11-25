import React, { useState } from 'react';
import Modal from './Modal';

interface LegalContent {
  title: string;
  content: string;
}

const legalContents: Record<string, LegalContent> = {
  agb: {
    title: 'AGB',
    content: 'Allgemeine Geschäftsbedingungen für Verträge, die über die Website www.dein-grundbuch-online.de geschlossen werden.'
  },
  datenschutz: {
    title: 'Datenschutz',
    content: 'Informationen zur Erhebung, Verarbeitung und Nutzung Ihrer personenbezogenen Daten gemäß DSGVO.'
  },
  widerruf: {
    title: 'Widerrufsbelehrung',
    content: 'Informationen zu Ihrem Widerrufsrecht und den Bedingungen für die Ausübung dieses Rechts.'
  },
  widerrufsformular: {
    title: 'Muster-Widerrufsformular',
    content: 'Standardformular für die Ausübung Ihres Widerrufsrechts.'
  }
};

interface LegalModalProps {
  type: keyof typeof legalContents;
  isOpen: boolean;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ type, isOpen, onClose }) => {
  const { title, content } = legalContents[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="prose max-w-none">
        <p>{content}</p>
        <p className="text-sm text-gray-500 mt-4">
          Hinweis: Dies ist ein Platzhaltertext. Der finale rechtliche Text muss hier eingefügt werden.
        </p>
      </div>
    </Modal>
  );
};

export function useLegalModals() {
  const [openModal, setOpenModal] = useState<keyof typeof legalContents | null>(null);

  const openLegalModal = (type: keyof typeof legalContents) => {
    setOpenModal(type);
  };

  const closeLegalModal = () => {
    setOpenModal(null);
  };

  return {
    openModal,
    openLegalModal,
    closeLegalModal,
    LegalModalComponent: (
      <LegalModal
        type={openModal || 'agb'}
        isOpen={openModal !== null}
        onClose={closeLegalModal}
      />
    )
  };
}

export default LegalModal;