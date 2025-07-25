
// MatchmakingForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createPreference, getPreferences, updatePreference } from '../../slice/matchMakingSlice';
import { useAuth } from '../../context/AuthContext';
import { sendMessage } from '../../slice/AgencyChatSlice';
import { parseHeight, parseIncome, ParseRange,ConvertCmToFeetInches,FormatIncome } from '../../utilityFunctions';

// Validation schema
const validateForm = (formData) => {
  const errors = {};

  // Age range validation (e.g., "25-30")
  if (!formData.preferredAgeRange) {
    errors.preferredAgeRange = 'Age range is required';
  } else if (!/^\d+\s*-\s*\d+$/.test(formData.preferredAgeRange)) {
    errors.preferredAgeRange = 'Please enter a valid age range (e.g., 25-30)';
  } else {
    const [minAge, maxAge] = formData.preferredAgeRange.split('-').map(Number);
    if (minAge >= maxAge) {
      errors.preferredAgeRange = 'Minimum age must be less than maximum age';
    }
    if (minAge < 18 || maxAge < 18) {
      errors.preferredAgeRange = 'Age must be 18 or above';
    }
    if (maxAge > 100) {
      errors.preferredAgeRange = 'Please enter a realistic maximum age';
    }
  }

  // Height validation (e.g., "5'6\" - 6'0\"")
  if (!formData.preferredHeight) {
    errors.preferredHeight = 'Height preference is required';
  } else if (!/^[\d\s'"]+(-|to|–)[\d\s'"]+$/i.test(formData.preferredHeight)) {
    errors.preferredHeight = 'Please enter a valid height range (e.g., 5\'6" - 6\'0")';
  }

  // Religion validation
  if (!formData.preferredReligion) {
    errors.preferredReligion = 'Religion preference is required';
  }

  if (
    formData.preferredIncome &&
    !/^\d{1,3}(,\d{3})*(\s*-\s*\d{1,3}(,\d{3})*)?$/.test(formData.preferredIncome)
  ) {
    errors.preferredIncome = 'Please enter a valid income range (e.g., 50,000 - 100,000)';
  }


  return errors;
};

const MatchmakingForm = ({ onClose, selectedSession }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const [id, setId] = useState("")
  const [formData, setFormData] = useState({
    preferredAgeRange: '',
    preferredHeight: '',
    preferredReligion: '',
    preferredCaste: '',
    preferredEducation: '',
    preferredOccupation: '',
    preferredIncome: '',
    otherPreferences: ''
  });
  const [errors, setErrors] = useState({});

  // Load existing preferences when component mounts
  useEffect(() => {
    dispatch(getPreferences(user.id)).unwrap().then((res) => {
      const prefs = res.data.preferences;
      if (prefs) {
        setId(res?.data?._id)
        setFormData({
          preferredAgeRange: `${prefs.preferredAgeRange?.min && prefs.preferredAgeRange?.max ? `${prefs.preferredAgeRange?.min || ''}-${prefs.preferredAgeRange?.max || ''}` : ""}`,
          preferredHeight: `${prefs.preferredHeight?.min && prefs.preferredHeight?.max ? `${ConvertCmToFeetInches(prefs.preferredHeight?.min || '')}-${ConvertCmToFeetInches(prefs.preferredHeight?.max || '')}` : ""}`,
          preferredReligion: prefs.preferredReligion || '',
          preferredCaste: prefs.preferredCaste || '',
          preferredEducation: prefs.preferredEducation || '',
          preferredOccupation: prefs.preferredOccupation || '',
          preferredIncome: `${prefs.preferredIncome?.min && prefs.preferredIncome?.max ? `${FormatIncome(prefs?.preferredIncome?.min || '')}-${FormatIncome(prefs.preferredIncome?.max || '')}` : ''}`,
          otherPreferences: prefs.otherPreferences || ''
        });
      }
    });
  }, [dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    // Validate form
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) {
      setLoading(false)
      return;
    }
    // Dispatch save action
    const structuredData = {
      preferredAgeRange: ParseRange(formData.preferredAgeRange),
      preferredHeight: parseHeight(formData.preferredHeight),
      preferredReligion: formData.preferredReligion,
      preferredCaste: formData.preferredCaste || undefined,
      preferredEducation: formData.preferredEducation || undefined,
      preferredOccupation: formData.preferredOccupation || undefined,
      preferredIncome: parseIncome(formData.preferredIncome),
      otherPreferences: formData.otherPreferences || undefined,
    };

    if (id) {
      dispatch(updatePreference(structuredData )).unwrap().then((response) => {
        if (response.data) {
          setLoading(false)
          const payload = {
            sessionId: selectedSession?._id || '',
            sender: user?.role,
            type: 'formResponse',
            formData: JSON.stringify(response?.data?.preferences),
          };
          dispatch(sendMessage(payload))
          onClose()
          alert("✅ Preferences Updated successfully!");
        }
      });
    } else {
      dispatch(createPreference(structuredData)).unwrap().then((response) => {
        if (response.data) {
          setLoading(false)
          const payload = {
            sessionId: selectedSession?._id || '',
            sender: user?.role,
            type: 'formResponse',
            formData: JSON.stringify(response?.data?.preferences),
          };
          dispatch(sendMessage(payload))
          onClose()
          alert("✅ Preferences Set successfully!");
        }
      });
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === 'preferredIncome' && value.includes('-')) {
      const [min, max] = value.split('-').map(v =>
        v.trim().replace(/\D/g, '') // remove non-digits
      );

      if (min && max) {
        const formattedMin = min.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const formattedMax = max.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setFormData(prev => ({
          ...prev,
          [name]: `${formattedMin} - ${formattedMax}`
        }));
      }
    }

  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Matchmaking Preferences</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Age Range Field */}
            <div>
              <label htmlFor="preferredAgeRange" className="block text-sm font-medium text-gray-700">
                Preferred Age Range <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="preferredAgeRange"
                name="preferredAgeRange"
                value={formData.preferredAgeRange}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., 25-30"
                className={`mt-1 block w-full border ${errors.preferredAgeRange ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink`}
                required
              />
              {errors.preferredAgeRange && (
                <p className="mt-1 text-sm text-red-500">{errors.preferredAgeRange}</p>
              )}
            </div>

            {/* Height Field */}
            <div>
              <label htmlFor="preferredHeight" className="block text-sm font-medium text-gray-700">
                Preferred Height <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="preferredHeight"
                name="preferredHeight"
                value={formData.preferredHeight}
                onChange={handleChange}
                placeholder={'e.g., 5\'6" - 6\'0"'}
                className={`mt-1 block w-full border ${errors.preferredHeight ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink`}
                required
              />
              {errors.preferredHeight && (
                <p className="mt-1 text-sm text-red-500">{errors.preferredHeight}</p>
              )}
            </div>

            {/* Religion Field */}
            <div>
              <label htmlFor="preferredReligion" className="block text-sm font-medium text-gray-700">
                Preferred Religion <span className="text-red-500">*</span>
              </label>
              <select
                id="preferredReligion"
                name="preferredReligion"
                value={formData.preferredReligion}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.preferredReligion ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink`}
                required
              >
                <option value="">Select Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Jain">Jain</option>
                <option value="Other">Other</option>
              </select>
              {errors.preferredReligion && (
                <p className="mt-1 text-sm text-red-500">{errors.preferredReligion}</p>
              )}
            </div>

            {/* Caste Field */}
            <div>
              <label htmlFor="preferredCaste" className="block text-sm font-medium text-gray-700">
                Preferred Caste
              </label>
              <input
                type="text"
                id="preferredCaste"
                name="preferredCaste"
                value={formData.preferredCaste}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink"
              />
            </div>

            {/* Education Field */}
            <div>
              <label htmlFor="preferredEducation" className="block text-sm font-medium text-gray-700">
                Preferred Education
              </label>
              <select
                id="preferredEducation"
                name="preferredEducation"
                value={formData.preferredEducation}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink"
              >
                <option value="">Any Education</option>
                <option value="High School">High School</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            {/* Occupation Field */}
            <div>
              <label htmlFor="preferredOccupation" className="block text-sm font-medium text-gray-700">
                Preferred Occupation
              </label>
              <input
                type="text"
                id="preferredOccupation"
                name="preferredOccupation"
                value={formData.preferredOccupation}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink"
              />
            </div>

            {/* Income Field */}
            <div>
              <label htmlFor="preferredIncome" className="block text-sm font-medium text-gray-700">
                Preferred Income (Annual)
              </label>
              <input
                type="text"
                id="preferredIncome"
                name="preferredIncome"
                value={formData.preferredIncome}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., 50,000-100,000"
                className={`mt-1 block w-full border ${errors.preferredIncome ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink`}
              />
              {errors.preferredIncome && (
                <p className="mt-1 text-sm text-red-500">{errors.preferredIncome}</p>
              )}
            </div>

            {/* Other Preferences Field */}
            <div>
              <label htmlFor="otherPreferences" className="block text-sm font-medium text-gray-700">
                Other Preferences
              </label>
              <textarea
                id="otherPreferences"
                name="otherPreferences"
                value={formData.otherPreferences}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink"
                rows="3"
                placeholder="Any other important preferences (diet, hobbies, etc.)"
              />
            </div>

            {errors?.general && <p className="text-red-500 text-sm">{errors.general}</p>}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marriageHotPink"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-marriageHotPink hover:bg-marriageRed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marriageHotPink disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Preferences'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatchmakingForm;