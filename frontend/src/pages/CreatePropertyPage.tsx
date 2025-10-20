import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { showAlert, hapticFeedback } from '../utils/telegram';
import { api } from '../services/api';

const CreatePropertyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    dealType: 'RENT',
    city: '',
    address: '',
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    price: 0,
    images: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      hapticFeedback.impact('medium');
      await api.createProperty(formData);
      hapticFeedback.notification('success');
      showAlert(t('property.createSuccess'));
      navigate('/my-properties');
    } catch (error) {
      hapticFeedback.notification('error');
      showAlert(t('errors.general'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">{t('property.create')}</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('property.title')}</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('property.description')}</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('property.type')}</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
            >
              <option value="APARTMENT">{t('property.apartment')}</option>
              <option value="HOUSE">{t('property.house')}</option>
              <option value="ROOM">{t('property.room')}</option>
              <option value="STUDIO">{t('property.studio')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('property.dealType')}</label>
            <select
              value={formData.dealType}
              onChange={(e) => setFormData({ ...formData, dealType: e.target.value })}
              className="input-field"
            >
              <option value="RENT">{t('property.forRent')}</option>
              <option value="SALE">{t('property.forSale')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('property.city')}</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('property.address')}</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('property.rooms')}</label>
            <input
              type="number"
              value={formData.rooms}
              onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) })}
              className="input-field"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('property.bedrooms')}</label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
              className="input-field"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('property.bathrooms')}</label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
              className="input-field"
              min="1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('property.area')} (м²)</label>
            <input
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
              className="input-field"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('common.price')} (₪)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="input-field"
              min="0"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          {t('property.publish')}
        </button>
      </form>
    </div>
  );
};

export default CreatePropertyPage;
