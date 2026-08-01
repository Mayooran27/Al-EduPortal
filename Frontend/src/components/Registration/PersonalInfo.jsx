import React, { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import StepIndicator from './StepIndicator';
import '../../styles/Registration.css';
import { FaUsers, FaChalkboardTeacher, FaGift } from 'react-icons/fa';

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    sex: 'male',
    dateOfBirth: '',
    nicNumber: '',
    nicFront: null,
    nicBack: null,
    schoolImage: null
  });

  const steps = [
    { number: 1, label: 'Personal Info' },
    { number: 2, label: 'Academic' },
    { number: 3, label: 'Documents' },
    { number: 4, label: 'Review' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit form data to backend
    console.log('Form submitted:', formData);
  };

  return (
    <div className="registration-container">
      <div className="header">
        <h1>Registration 001</h1>
        <div className="subtitle">EduPortal A/L - Your Gateway to A/L Excellence</div>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          {currentStep === 1 && (
            <PersonalInfo 
              formData={formData}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
            />
          )}
          {/* Add other steps here */}
        </div>

        <div className="stats">
          <div className="stat-item">
            <FaUsers className="stat-icon" />
            <div className="stat-number">5000+</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-item">
            <FaChalkboardTeacher className="stat-icon" />
            <div className="stat-number">Expert</div>
            <div className="stat-label">Tutors</div>
          </div>
          <div className="stat-item">
            <FaGift className="stat-icon" />
            <div className="stat-number">100%</div>
            <div className="stat-label">Free</div>
          </div>
        </div>

        <div className="navigation-buttons">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </button>
          {currentStep === 4 ? (
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;