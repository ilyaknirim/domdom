import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { showAlert, hapticFeedback } from '../utils/telegram';
import { api } from '../services/api';
import AddressSelector from '../components/AddressSelector';
import { AddressData } from '../services/types';

const CreatePropertyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    dealType: 'RENT',
    address: '',
    city: '',
    latitude: 0,
    longitude: 0,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    area: 50,
    price: 1000,
    images: [] as string[],
  });

  const [addressSelected, setAddressSelected] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleAddressSelect = (addressData: AddressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address,
      city: addressData.city,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
    }));
    setAddressSelected(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        const response = await api.uploadImage(file);
        return response.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      hapticFeedback.notification('success');
      showAlert(t('property.imagesUploaded', { count: uploadedUrls.length }));
    } catch (error) {
      hapticFeedback.notification('error');
      showAlert(t('errors.general'));
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showAlert(t('property.title') + ' ' + t('errors.validation'));
      return;
    }

    if (!formData.description.trim()) {
      showAlert(t('property.description') + ' ' + t('errors.validation'));
      return;
    }

    if (!addressSelected) {
      showAlert(t('property.addressRequired'));
      return;
    }

    if (formData.area <= 0) {
      showAlert(t('property.area') + ' ' + t('errors.validation'));
      return;
    }

    if (formData.price <= 0) {
      showAlert(t('common.price') + ' ' + t('errors.validation'));
      return;
    }

    try {
      hapticFeedback.impact('medium');
      await api.createProperty(formData);
      hapticFeedback.notification('success');
      showAlert(t('property.createSuccess'));
      navigate('/my-properties');
    } catch (error) {
      hapticFeedback.notification('error');
      const msg = (error as any)?.message || t('errors.general');
      const code = (error as any)?.name;
      showAlert(code ? `${msg} (${code})` : msg);
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
          <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.title')}</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.description')}</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.type')}</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.dealType')}</label>
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

        {/* Address Selector */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.location')}</label>
          <AddressSelector
            onAddressSelect={handleAddressSelect}
            className="mb-4"
          />
          {!addressSelected && (
            <p className="text-sm text-red-600 mt-1">{t('property.addressRequired')}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.rooms')}</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.bedrooms')}</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.bathrooms')}</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.area')} (м²)</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-700">{t('common.price')} (₪)</label>
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

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">{t('property.photos')}</label>
          <div className="space-y-4">
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadingImages}
              />
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {uploadingImages ? t('common.loading') : t('property.uploadPhotos')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={uploadingImages}>
          {t('property.publish')}
        </button>
      </form>
    </div>
  );
};

export default CreatePropertyPage;
