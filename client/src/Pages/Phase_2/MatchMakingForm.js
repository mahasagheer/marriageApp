// MatchmakingForm.js
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  createPreference,
  getPreferences,
  updatePreference,
} from '../../slice/matchMakingSlice';
import { useAuth } from '../../context/AuthContext';
import { sendMessage } from '../../slice/AgencyChatSlice';
import {
  parseHeight,
  parseIncome,
  ParseRange,
  ConvertCmToFeetInches,
  FormatIncome,
} from '../../utilityFunctions';
import { Button } from '../../Components/Layout/Button';
import { toast } from 'react-toastify';

const validateForm = (formData) => {
  const errors = {};
  const ageRegex = /^\d+\s*-\s*\d+$/;
  const heightRegex = /^[\d\s'"]+(-|to|–)[\d\s'"]+$/i;
  const incomeRegex = /^\d{1,3}(,\d{3})*(\s*-\s*\d{1,3}(,\d{3})*)?$/;

  if (!formData.preferredAgeRange) {
    errors.preferredAgeRange = 'Age range is required';
  } else if (!ageRegex.test(formData.preferredAgeRange)) {
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

  if (!formData.preferredHeight) {
    errors.preferredHeight = 'Height preference is required';
  } else if (!heightRegex.test(formData.preferredHeight)) {
    errors.preferredHeight = 'Please enter a valid height range (e.g., 5\'6" - 6\'0")';
  }

  if (!formData.preferredReligion) {
    errors.preferredReligion = 'Religion preference is required';
  }

  if (
    formData.preferredIncome &&
    !incomeRegex.test(formData.preferredIncome)
  ) {
    errors.preferredIncome = 'Please enter a valid income range (e.g., 50,000 - 100,000)';
  }

  return errors;
};

const MatchmakingForm = ({ onClose, selectedSession }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferredAgeRange: '',
    preferredHeight: '',
    preferredReligion: '',
    preferredCaste: '',
    preferredEducation: '',
    preferredOccupation: '',
    preferredIncome: '',
    otherPreferences: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getPreferences(user.id))
      .unwrap()
      .then((res) => {
        const prefs = res?.data?.preferences;
        if (prefs) {
          setId(res?.data?._id);
          setFormData({
            preferredAgeRange: prefs.preferredAgeRange?.min && prefs.preferredAgeRange?.max
              ? `${prefs.preferredAgeRange?.min}-${prefs.preferredAgeRange?.max}`
              : '',
            preferredHeight: prefs.preferredHeight?.min && prefs.preferredHeight?.max
              ? `${ConvertCmToFeetInches(prefs.preferredHeight?.min)}-${ConvertCmToFeetInches(prefs.preferredHeight?.max)}`
              : '',
            preferredReligion: prefs.preferredReligion ?? '',
            preferredCaste: prefs.preferredCaste ?? '',
            preferredEducation: prefs.preferredEducation ?? '',
            preferredOccupation: prefs.preferredOccupation ?? '',
            preferredIncome: prefs.preferredIncome?.min && prefs.preferredIncome?.max
              ? `${FormatIncome(prefs.preferredIncome?.min)}-${FormatIncome(prefs.preferredIncome?.max)}`
              : '',
            otherPreferences: prefs.otherPreferences ?? '',
          });
        }
      });
  }, [dispatch, user.id]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'preferredIncome' && value.includes('-')) {
      const [min, max] = value.split('-').map((v) =>
        v.trim().replace(/\D/g, '')
      );
      if (min && max) {
        const formattedMin = min.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const formattedMax = max.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setFormData((prev) => ({
          ...prev,
          [name]: `${formattedMin} - ${formattedMax}`,
        }));
      }
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const formErrors = validateForm(formData);
      setErrors(formErrors);
      if (Object.keys(formErrors).length > 0) {
        setLoading(false);
        return;
      }

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

      const response = id
        ? await dispatch(updatePreference(structuredData)).unwrap()
        : await dispatch(createPreference(structuredData)).unwrap();

      if (response?.data) {
        const payload = {
          sessionId: selectedSession?._id || '',
          sender: user?.role,
          type: 'formResponse',
          formData: JSON.stringify(response?.data?.preferences),
        };
        await dispatch(sendMessage(payload));
        setLoading(false);
        onClose();
        toast.success(id ? '✅ Preferences Updated successfully!' : '✅ Preferences Set successfully!');
      }
    },
    [formData, dispatch, id, onClose, selectedSession, user?.role]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Matchmaking Preferences</h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
              aria-label="Close form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {[
              { name: 'preferredAgeRange', label: 'Preferred Age Range', required: true, placeholder: 'e.g., 25-30' },
              { name: 'preferredHeight', label: 'Preferred Height', required: true, placeholder: 'e.g., 5\'6" - 6\'0"' },
              { name: 'preferredIncome', label: 'Preferred Income (Annual)', required: false, placeholder: 'e.g., 50,000-100,000' }
            ].map(({ name, label, required, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  className={`mt-1 block w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink`}
                  required={required}
                />
                {errors[name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}

            <div>
              <label htmlFor="preferredReligion" className="block text-sm font-medium">
                Preferred Religion <span className="text-red-500">*</span>
              </label>
              <select
                id="preferredReligion"
                name="preferredReligion"
                value={formData.preferredReligion}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.preferredReligion ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink`}
                required
              >
                <option value="">Select Religion</option>
                {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.preferredReligion && (
                <p className="mt-1 text-sm text-red-500">{errors.preferredReligion}</p>
              )}
            </div>

            {['preferredCaste', 'preferredOccupation'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium">
                  {field.replace('preferred', 'Preferred ')}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink"
                />
              </div>
            ))}

            <div>
              <label htmlFor="preferredEducation" className="block text-sm font-medium">
                Preferred Education
              </label>
              <select
                id="preferredEducation"
                name="preferredEducation"
                value={formData.preferredEducation}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink"
              >
                <option value="">Any Education</option>
                {['High School', 'Bachelor', 'Master', 'PhD', 'Professional'].map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="otherPreferences" className="block text-sm font-medium">
                Other Preferences
              </label>
              <textarea
                id="otherPreferences"
                name="otherPreferences"
                value={formData.otherPreferences}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-marriageHotPink focus:border-marriageHotPink"
                rows="3"
                placeholder="Any other important preferences (diet, hobbies, etc.)"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                onClick={onClose}
                btnText={"Cancel"}
                btnColor='dark:bg-gray-700 bg-gray-200'
                textColor='text-gray-800 dark:text-white'
                disabled={loading}
                hoverColor='dark:bg-gray-800'
              />
              <Button
                type="submit"
                disabled={loading}

                btnText={loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Preferences'
                )}
              // className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-marriageHotPink hover:bg-marriageRed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marriageHotPink disabled:opacity-50"
              />

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatchmakingForm;
