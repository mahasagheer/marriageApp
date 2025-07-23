// MatchmakingForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MatchmakingForm = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`/api/chat/${chatId}/submit-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          formData
        })
      });
      
      if (response.ok) {
        navigate(`/chat/${chatId}`);
      } else {
        setError('Failed to submit form');
      }
    } catch (err) {
      setError('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Matchmaking Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Preferred Age Range</label>
          <input
            type="text"
            name="preferredAgeRange"
            value={formData.preferredAgeRange}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        
        <div>
          <label className="block">Preferred Height</label>
          <input
            type="text"
            name="preferredHeight"
            value={formData.preferredHeight}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        
        <div>
          <label className="block">Preferred Religion</label>
          <input
            type="text"
            name="preferredReligion"
            value={formData.preferredReligion}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        
        <div>
          <label className="block">Preferred Caste</label>
          <input
            type="text"
            name="preferredCaste"
            value={formData.preferredCaste}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        
        <div>
          <label className="block">Preferred Education</label>
          <input
            type="text"
            name="preferredEducation"
            value={formData.preferredEducation}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        
        <div>
          <label className="block">Preferred Occupation</label>
          <input
            type="text"
            name="preferredOccupation"
            value={formData.preferredOccupation}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        
        <div>
          <label className="block">Preferred Income</label>
          <input
            type="text"
            name="preferredIncome"
            value={formData.preferredIncome}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        
        <div>
          <label className="block">Other Preferences</label>
          <textarea
            name="otherPreferences"
            value={formData.otherPreferences}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows="3"
          />
        </div>
        
        {error && <p className="text-red-500">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="bg-marriageHotPink text-white px-4 py-2 rounded hover:bg-marriageRed disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Preferences'}
        </button>
      </form>
    </div>
  );
};

export default MatchmakingForm;