import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import FinalSection from './FinalSection';

interface ApplicantFormProps {
  onSubmit: (data: FormData) => void;
}

interface ValidationError {
  hasError: boolean;
  message: string;
}

type Errors = {
  [key: string]: ValidationError;
};

const ApplicantForm: React.FC<ApplicantFormProps> = ({ onSubmit }) => {
  const [showFinalSection, setShowFinalSection] = useState(false);
  const [customerType, setCustomerType] = useState<'private' | 'business'>('private');
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    zipCode: '',
    city: '',
    phone: '',
    email: '',
  });
  
  const [errors, setErrors] = useState<Errors>({});

  const validateField = (name: string, value: string): ValidationError => {
    switch (name) {
      case 'companyName':
        if (value.length < 2) {
          return { 
            hasError: true, 
            message: 'Bitte geben Sie einen gültigen Firmennamen ein.' 
          };
        }
        break;

      case 'firstName':
      case 'lastName':
        if (value.length < 2 || /\d/.test(value)) {
          return { 
            hasError: true, 
            message: `Bitte geben Sie einen gültigen ${name === 'firstName' ? 'Vornamen' : 'Nachnamen'} ein.` 
          };
        }
        break;

      case 'street':
        if (value.length < 2) {
          return { 
            hasError: true, 
            message: 'Bitte geben Sie einen gültigen Straßennamen ein.' 
          };
        }
        break;

      case 'houseNumber':
        if (!value.match(/^[1-9]\d{0,3}[a-zA-Z]?(-[1-9]\d{0,3}[a-zA-Z]?)?$/)) {
          return { 
            hasError: true, 
            message: 'Bitte geben Sie eine gültige Hausnummer ein.' 
          };
        }
        break;

      case 'zipCode':
        if (!value.match(/^\d{5}$/)) {
          return { 
            hasError: true, 
            message: 'Bitte geben Sie eine gültige Postleitzahl ein.' 
          };
        }
        break;

      case 'city':
        if (value.length < 2 || /\d/.test(value)) {
          return { 
            hasError: true, 
            message: 'Bitte geben Sie einen gültigen Ortsnamen ein.' 
          };
        }
        break;

      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          return { 
            hasError: true, 
            message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' 
          };
        }
        break;

      case 'phone':
        // Remove all spaces, dashes, and parentheses for validation
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        // Check for German phone number formats:
        // +49..., 0049..., or 0... (followed by area code and number)
        if (value && !cleanPhone.match(/^(\+49|0049|0)[1-9]\d{6,14}$/)) {
          return { 
            hasError: true, 
            message: 'Bitte geben Sie eine gültige Telefonnummer ein.' 
          };
        }
        break;
    }
    return { hasError: false, message: '' };
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    const requiredFields = ['firstName', 'lastName', 'street', 'houseNumber', 'zipCode', 'city', 'email'];
    
    if (customerType === 'business') {
      requiredFields.push('companyName');
    }

    let isValid = true;

    // Check all required fields and perform validation regardless of empty state
    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      
      // Check if field is empty first
      if (!value) {
        newErrors[field] = {
          hasError: true,
          message: 'Dieses Feld ist erforderlich.'
        };
        isValid = false;
      }
      
      // Always perform validation check if there's a value
      if (value) {
        const validationResult = validateField(field, value);
        if (validationResult.hasError) {
          newErrors[field] = validationResult;
          isValid = false;
        }
      }
    });

    // Validate optional phone if provided
    if (formData.phone) {
      const phoneValidation = validateField('phone', formData.phone);
      if (phoneValidation.hasError) {
        newErrors.phone = phoneValidation;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: { hasError: false, message: '' }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowFinalSection(true);
      setTimeout(() => {
        document.getElementById('final-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleFinalSubmit = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    onSubmit(data);
  };

  return (
    <>
      <section className="space-y-6">
        <div className="bg-yellow-100 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900">
            Antragssteller und Lieferanschrift
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Type Selection */}
          <div className="space-y-2">
            <label className="font-bold text-gray-700">
              Ich bin <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="customerType"
                  checked={customerType === 'private'}
                  onChange={() => setCustomerType('private')}
                  className="text-yellow-500"
                />
                <span>Privatkunde/in</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="customerType"
                  checked={customerType === 'business'}
                  onChange={() => setCustomerType('business')}
                  className="text-yellow-500"
                />
                <span>Firmenkunde/in</span>
              </label>
            </div>
          </div>

          {/* Company Name */}
          {customerType === 'business' && (
            <div className="space-y-2">
              <label className="font-bold text-gray-700">
                Firmenname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.companyName?.hasError ? 'border-red-500' : ''}`}
              />
              {errors.companyName?.hasError && (
                <p className="text-red-500 text-sm">{errors.companyName.message}</p>
              )}
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-gray-700">
                Vorname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.firstName?.hasError ? 'border-red-500' : ''}`}
              />
              {errors.firstName?.hasError && (
                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-bold text-gray-700">
                Nachname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.lastName?.hasError ? 'border-red-500' : ''}`}
              />
              {errors.lastName?.hasError && (
                <p className="text-red-500 text-sm">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-gray-700">
                Straße <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.street?.hasError ? 'border-red-500' : ''}`}
              />
              {errors.street?.hasError && (
                <p className="text-red-500 text-sm">{errors.street.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-bold text-gray-700">
                Hausnummer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.houseNumber?.hasError ? 'border-red-500' : ''}`}
              />
              {errors.houseNumber?.hasError && (
                <p className="text-red-500 text-sm">{errors.houseNumber.message}</p>
              )}
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-gray-700">
                PLZ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.zipCode?.hasError ? 'border-red-500' : ''}`}
                maxLength={5}
              />
              {errors.zipCode?.hasError && (
                <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-bold text-gray-700">
                Ort <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${errors.city?.hasError ? 'border-red-500' : ''}`}
              />
              {errors.city?.hasError && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="space-y-2">
            <label className="font-bold text-gray-700">
              Telefon (für Rückfragen)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md ${errors.phone?.hasError ? 'border-red-500' : ''}`}
            />
            {errors.phone?.hasError && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="font-bold text-gray-700">
              E-Mail <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md ${errors.email?.hasError ? 'border-red-500' : ''}`}
              autoComplete="email"
            />
            {errors.email?.hasError && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="font-bold text-gray-700">
              Kopie Ausweis/Reisepass
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="font-medium mb-2">Ausweis oder Reisepass hochladen</h3>
                <p className="text-sm text-gray-500">Klicken Sie hier oder schieben Sie die Datei in dieses Fenster. Erlaubt sind PDF, JPG, JPEG (maximal 10 Dateien je 10MB).</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Wir empfehlen Ihnen als Identitätsnachweis bei der Behörde, Ihren Ausweis oder Reisepass hochzuladen.
            </p>
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
      </section>

      {showFinalSection && (
        <div id="final-section" className="mt-8">
          <FinalSection onSubmit={handleFinalSubmit} />
        </div>
      )}
    </>
  );
};

export default ApplicantForm;