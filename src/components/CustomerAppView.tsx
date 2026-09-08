import React, { useState, useRef, useEffect } from 'react';
import { MEDICINES_DATA } from '../data/initialData';
import { MedicineOffer, UserAccount } from '../types';
import { PrescriptionScannerModal } from './PrescriptionScannerModal';

interface CustomerAppViewProps {
  mobileFrameMode: boolean;
  onAddToCart: (offer: MedicineOffer, medicineKey: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

export const CustomerAppView: React.FC<CustomerAppViewProps> = ({
  mobileFrameMode,
  onAddToCart,
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('Paracetamol 650mg');
  const [selectedFilter, setSelectedFilter] = useState<'lowest' | 'speed' | 'rating' | 'instock'>('lowest');
  const [selectedLocation, setSelectedLocation] = useState('Dadar, Mumbai 400028');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showRxModal, setShowRxModal] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState<string | null>(null);

  // Voice Search states
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceSearch = () => {
    if (isListening) {
      stopVoiceSearch();
    } else {
      startVoiceSearch();
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setShowNotificationToast(
        'Voice search is not supported in this browser. Please use keyboard search or Chrome/Edge.'
      );
      setTimeout(() => setShowNotificationToast(null), 4000);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English pronunciation for medicine names

      setVoiceTranscript('');
      setIsListening(true);

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          setVoiceTranscript(interim);
        }

        if (final) {
          const cleaned = final.trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
          setSearchQuery(cleaned);
          setVoiceTranscript(cleaned);
          setIsListening(false);
          setShowNotificationToast(`Voice Search: "${cleaned}"`);
          setTimeout(() => setShowNotificationToast(null), 3500);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setShowNotificationToast('Microphone access was denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          setShowNotificationToast('No speech detected. Please try again.');
        } else {
          setShowNotificationToast(`Voice search note: ${event.error}`);
        }
        setTimeout(() => setShowNotificationToast(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setShowNotificationToast('Unable to start voice recognition.');
      setTimeout(() => setShowNotificationToast(null), 3000);
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Normalize search query
  const queryLower = searchQuery.toLowerCase();
  let currentMedicineKey = 'paracetamol';
  if (queryLower.includes('metform') || queryLower.includes('glyco')) {
    currentMedicineKey = 'metformin';
  } else if (queryLower.includes('atorva') || queryLower.includes('lip')) {
    currentMedicineKey = 'atorvastatin';
  } else if (queryLower.includes('panto') || queryLower.includes('pan')) {
    currentMedicineKey = 'pantoprazole';
  } else if (queryLower.includes('amox') || queryLower.includes('aug') || queryLower.includes('clav')) {
    currentMedicineKey = 'amoxicillin';
  }

  const medicine = MEDICINES_DATA[currentMedicineKey] || MEDICINES_DATA['paracetamol'];

  // Apply filters
  let filteredOffers = [...medicine.offers];
  if (selectedFilter === 'lowest') {
    filteredOffers.sort((a, b) => a.discountedPrice - b.discountedPrice);
  } else if (selectedFilter === 'speed') {
    filteredOffers.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (selectedFilter === 'rating') {
    filteredOffers.sort((a, b) => b.storeRating - a.storeRating);
  } else if (selectedFilter === 'instock') {
    filteredOffers = filteredOffers.filter((o) => o.inStock);
  }

  const handleAddToCart = (offer: MedicineOffer) => {
    onAddToCart(offer, currentMedicineKey);
    setShowNotificationToast(`Added ${offer.brandName} from ${offer.storeName} to cart!`);
    setTimeout(() => {
      setShowNotificationToast(null);
    }, 3000);
  };

  return (
    <div className={`flex justify-center ${mobileFrameMode ? 'py-6 px-3 bg-slate-200 min-h-[calc(100vh-80px)]' : 'p-0'}`}>
      <div
        className={`w-full bg-[#f7f9fb] transition-all relative ${
          mobileFrameMode
            ? 'max-w-[430px] rounded-[36px] shadow-2xl border-[8px] border-slate-800 overflow-hidden min-h-[860px]'
            : 'max-w-4xl mx-auto min-h-screen pb-24 shadow-sm'
        }`}
      >
        {/* Mobile Status Bar Simulation when in phone frame mode */}
        {mobileFrameMode && (
          <div className="bg-white px-6 pt-3 pb-1 flex justify-between items-center text-xs font-semibold text-slate-800 select-none">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black rounded-full mx-auto"></div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>5G</span>
              <span className="material-symbols-outlined text-xs">battery_full</span>
            </div>
          </div>
        )}

        {/* Customer Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                gm
              </div>
              <div>
                <span className="font-headline font-bold text-slate-900 tracking-tight text-base leading-none block">
                  genericmed
                </span>
                <button
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-700 transition mt-0.5"
                >
                  <span className="material-symbols-outlined text-[13px] text-blue-600">location_on</span>
                  <span className="truncate max-w-[170px] font-medium">{selectedLocation}</span>
                  <span className="material-symbols-outlined text-[12px]">expand_more</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {currentUser ? (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition"
                  title={`Signed in as ${currentUser.name} (${currentUser.role})`}
                >
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </span>
                  <span className="hidden sm:inline text-[11px] truncate max-w-[80px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
                >
                  <span className="material-symbols-outlined text-[15px]">account_circle</span>
                  <span className="hidden xs:inline">Sign In</span>
                </button>
              )}

              <button
                onClick={() => setShowRxModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 transition"
              >
                <span className="material-symbols-outlined text-[16px]">document_scanner</span>
                <span className="hidden xs:inline">Scan Rx</span>
              </button>
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition"
              >
                <span className="material-symbols-outlined text-xl">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Location Selector Popup */}
          {showLocationPicker && (
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
              <p className="font-semibold text-slate-800">Select Delivery Location in Mumbai:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'Dadar, Mumbai 400028',
                  'Bandra West 400050',
                  'Andheri East 400069',
                  'Colaba, Mumbai 400005',
                ].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationPicker(false);
                    }}
                    className={`text-left p-1.5 rounded text-[11px] transition ${
                      selectedLocation === loc
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search & Salt Discovery Bar */}
        <div className="p-4 bg-white border-b border-slate-100">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand (Calpol) or generic salt (Paracetamol)..."
              className="w-full pl-9 pr-28 py-2.5 bg-slate-100 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition border border-transparent focus:border-blue-600"
            />
            <div className="absolute right-2.5 flex items-center gap-1">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowRxModal(true)}
                className="p-1.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition flex items-center justify-center"
                title="Scan Handwritten Prescription (AI Rx Decoder)"
                aria-label="Scan Prescription"
              >
                <span className="material-symbols-outlined text-[19px]">document_scanner</span>
              </button>
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-1.5 rounded-full transition relative flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-500 hover:text-blue-600 hover:bg-slate-200'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice Search (Speak medicine name)'}
                aria-label="Voice Search"
              >
                <span className={`material-symbols-outlined text-[19px] ${isListening ? 'animate-pulse' : ''}`}>
                  {isListening ? 'mic' : 'mic_none'}
                </span>
                {isListening && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>
            </div>
          </div>

          {/* Voice Search Active Listening Banner */}
          {isListening && (
            <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-rose-50 border border-blue-200 flex items-center justify-between text-xs animate-fadeIn shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-base">mic</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">Listening...</span>
                    <span className="text-[11px] text-slate-500">Speak medicine name</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce"></span>
                      <span className="w-1 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-1 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    {voiceTranscript ? (
                      <span className="font-mono text-blue-800 font-bold bg-white/80 px-1.5 py-0.5 rounded border border-blue-200">
                        "{voiceTranscript}"
                      </span>
                    ) : (
                      'Try saying "Paracetamol 650", "Calpol", "Metformin", or "Augmentin"'
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={stopVoiceSearch}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs shadow-2xs transition shrink-0"
              >
                Done
              </button>
            </div>
          )}

          {/* Suggested Quick Searches */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar text-[11px]">
            <button
              onClick={() => setShowRxModal(true)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-semibold shrink-0 hover:bg-blue-100 transition shadow-2xs"
            >
              <span className="material-symbols-outlined text-[14px]">document_scanner</span>
              <span>AI Scan Rx</span>
            </button>
            <span className="text-slate-400 shrink-0">Popular:</span>
            {['Paracetamol 650mg', 'Metformin 500mg', 'Atorvastatin 10mg', 'Pantoprazole 40mg', 'Amoxicillin 625mg'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className={`px-2 py-0.5 rounded-full border shrink-0 transition ${
                  searchQuery.toLowerCase() === term.toLowerCase()
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 space-y-4">
          {/* Bioequivalence Match Tag */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg">verified</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  100% Bio-Equivalent Salt Match
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">CDSCO Tested</span>
              </div>
              <h3 className="font-headline font-bold text-slate-900 text-sm mt-1">
                {medicine.activeSalt} {medicine.saltStrength}
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {medicine.dosageForm} • {medicine.packaging} • Active API identical to high-cost branded versions.
              </p>
            </div>
          </div>

          {/* Hero Price Comparison Card */}
          <div className="bg-gradient-to-br from-[#003865] to-[#001f38] text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-blue-200 font-medium">Lowest Verified Dispensary Price</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold font-headline tracking-tight text-white">
                    ₹{medicine.lowestPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-md">
                    Save {medicine.maxSavingsPercent}%
                  </span>
                </div>
                <span className="text-[11px] text-blue-200/80 block mt-0.5">
                  approx. ₹{(medicine.lowestPrice / 15).toFixed(2)} / tablet
                </span>
              </div>

              {/* Branded Comparison Pill */}
              <div className="bg-blue-950/90 border border-blue-800/80 rounded-xl p-2.5 text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Branded Benchmark</span>
                <span className="text-xs font-bold text-slate-200 block">{medicine.brandedComparison.name}</span>
                <span className="text-xs text-slate-400 line-through">₹{medicine.brandedComparison.mrp.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block">₹{medicine.brandedComparison.perUnit.toFixed(2)}/tab</span>
              </div>
            </div>

            {/* Savings Progress Delta */}
            <div className="pt-2 border-t border-blue-800/60">
              <div className="flex justify-between text-[11px] text-blue-200 mb-1">
                <span>You save ₹{(medicine.brandedComparison.mrp - medicine.lowestPrice).toFixed(2)} per strip</span>
                <span className="font-semibold text-emerald-300 font-mono">61.8% Cheaper</span>
              </div>
              <div className="w-full bg-blue-950 h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${medicine.maxSavingsPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Quick Filters Rail */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'lowest', label: 'Lowest Price First', icon: 'savings' },
              { id: 'speed', label: 'Nearest / Fastest', icon: 'near_me' },
              { id: 'rating', label: '4.8+ Rated', icon: 'star' },
              { id: 'instock', label: 'In-Stock Only', icon: 'check_circle' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedFilter === f.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{f.icon}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>

          {/* Dispensary Offers List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {filteredOffers.length} Licensed Dispensaries in Area
              </span>
              <span className="text-[11px] text-slate-500">Real-time Stock Verified</span>
            </div>

            {filteredOffers.map((offer, idx) => (
              <div
                key={offer.id}
                className={`bg-white rounded-2xl border p-4 transition-all relative ${
                  offer.isLowest
                    ? 'border-blue-400 ring-2 ring-blue-100 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {offer.badge && (
                  <div className="mb-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        offer.isLowest
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {offer.isLowest ? 'verified' : 'award_star'}
                      </span>
                      {offer.badge}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline font-bold text-slate-900 text-sm sm:text-base">
                      {offer.brandName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{offer.manufacturer}</p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-baseline gap-1.5 justify-end">
                      <span className="text-xl font-extrabold text-slate-900 font-headline">
                        ₹{offer.discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">₹{offer.originalPrice.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      {offer.savingsPercent}% OFF (₹{offer.perTabletPrice.toFixed(2)}/tab)
                    </span>
                  </div>
                </div>

                {/* Dispensary info & delivery estimate */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{offer.storeName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center text-amber-600 font-medium">
                      <span className="material-symbols-outlined text-[14px] text-amber-500 fill mr-0.5">star</span>
                      {offer.storeRating} ({offer.reviewsCount})
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{offer.distanceKm} km</span>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[14px]">electric_bolt</span>
                    <span>{offer.deliveryEstimate}</span>
                  </div>
                </div>

                {/* Add to Cart & Buy Action */}
                <div className="mt-3.5 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500">
                    Batch: <span className="font-mono text-slate-700 font-medium">CIP-2409-A2</span> • Exp: 11/27
                  </span>

                  <button
                    onClick={() => handleAddToCart(offer)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Education / Why Generic Medicines Card */}
          <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
            <h4 className="font-headline font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <span className="material-symbols-outlined text-blue-600 text-base">shield</span>
              Why Choose Generic Medicines?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800 block">Identical Active Salt</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Same bioequivalence, dosage, strength, and therapeutic effect.</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800 block">Government Tested</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Every batch tested in CDSCO certified labs under Drug Rules 1945.</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800 block">No Marketing Markups</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Patients save 50% to 80% without paying for consumer advertising.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Bar when Cart has items */}
        {cartCount > 0 && (
          <div className="sticky bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-between shadow-lg z-40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {cartCount} item{cartCount > 1 ? 's' : ''} in cart
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                  Saving 61%
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">Dispatched by Metro Generic Chemist</span>
            </div>

            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition"
            >
              <span>View Cart & Checkout</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Notification Toast */}
        {showNotificationToast && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium z-50 flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>{showNotificationToast}</span>
          </div>
        )}

        {/* AI-Powered Prescription Scanner Modal */}
        <PrescriptionScannerModal
          isOpen={showRxModal}
          onClose={() => setShowRxModal(false)}
          onSelectMedicine={(medicineName) => {
            setSearchQuery(medicineName);
            setShowNotificationToast(`Prescription parsed: Search auto-populated with "${medicineName}"`);
            setTimeout(() => setShowNotificationToast(null), 4000);
          }}
        />
      </div>
    </div>
  );
};
