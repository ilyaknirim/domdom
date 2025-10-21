import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ChatPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-semibold">{t('chat.title')}</h1>
            <p className="text-sm text-gray-500">{t('chat.online')}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-center text-gray-500 py-12">
          {t('chat.noMessages')}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chat.typeMessage')}
            className="input-field flex-1"
          />
          <button className="btn-primary px-4">
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
