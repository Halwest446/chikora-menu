import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, Send, MapPin, User, Phone, CheckCircle2 } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    formatPrice,
    lang,
    restaurantInfo,
  } = useMenu();

  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'dinein' | 'takeaway'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [isOrderedSuccess, setIsOrderedSuccess] = useState(false);

  if (!isCartOpen) return null;

  const isKu = lang === 'ku';

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;

    let message = isKu
      ? `🍗 *داواکاری نوێ لە مێنیوی ئۆنلاینی چیکۆرا هه‌ولێر*\n`
      : `🍗 *New Order from Chikora Hawler Online Menu*\n`;

    message += `------------------------------------\n`;
    message += isKu ? `📍 جۆری داواکاری: ${orderType === 'delivery' ? 'گەیاندن (Delivery)' : orderType === 'dinein' ? 'لەناو ڕێستۆرانت (Dine-in)' : 'بردنەوە (Takeaway)'}\n`
                    : `📍 Order Type: ${orderType.toUpperCase()}\n`;

    if (customerName) {
      message += isKu ? `👤 ناوی کڕیار: ${customerName}\n` : `👤 Name: ${customerName}\n`;
    }
    if (customerPhone) {
      message += isKu ? `📞 تەلەفۆن: ${customerPhone}\n` : `📞 Phone: ${customerPhone}\n`;
    }
    if (customerLocation) {
      message += isKu ? `🏠 ناونیشان / ژمارەی مێز: ${customerLocation}\n` : `🏠 Address / Table: ${customerLocation}\n`;
    }

    message += `------------------------------------\n`;
    message += isKu ? `🛒 *خواردنەکان:*\n` : `🛒 *Items Ordered:*\n`;

    cart.forEach((ci, idx) => {
      const itemName = isKu ? (ci.item.nameKu || ci.item.name) : ci.item.name;
      message += `${idx + 1}. ${itemName} x${ci.quantity} - ${formatPrice(ci.item.price * ci.quantity)}\n`;
      if (ci.notes) {
        message += `   (تێبینی: ${ci.notes})\n`;
      }
    });

    message += `------------------------------------\n`;
    message += isKu
      ? `💰 *کۆی گشتی: ${formatPrice(cartTotal)}*\n`
      : `💰 *Grand Total: ${formatPrice(cartTotal)}*\n`;
    message += `------------------------------------\n`;
    message += isKu ? `سوپاس بۆ هەڵبژاردنی چیکۆرا هه‌ولێر! ❤️` : `Thank you for choosing Chikora Hawler! ❤️`;

    window.open(`https://wa.me/${restaurantInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    setIsOrderedSuccess(true);
    setTimeout(() => {
      setIsOrderedSuccess(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#160a0d] border-l border-[#3a1820] rtl:border-l-0 rtl:border-r h-full flex flex-col shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#311318] flex items-center justify-between bg-[#1f0d11]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ba181b]/30 text-[#f5a623] border border-[#ba181b]/60">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {isKu ? 'سەبەتەی داواکاری' : 'Your Order Bag'}
              </h2>
              <span className="text-xs text-gray-400">
                {cart.length} {isKu ? 'جۆر خواردن' : 'items selected'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-400 hover:text-red-300 font-semibold p-1.5"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg bg-[#2c1318] hover:bg-[#3d1a21] text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#271016] border border-[#441c26] flex items-center justify-center text-gray-500">
                <ShoppingBag className="w-8 h-8 text-[#f5a623]/60" />
              </div>
              <h3 className="text-base font-bold text-white">
                {isKu ? 'سەبەتەکەت بەتاڵە!' : 'Your Bag is Empty'}
              </h3>
              <p className="text-xs text-gray-400 max-w-xs">
                {isKu
                  ? 'خواردنە بەتامەکانی چیکۆرا هەڵبژێرە و لەمێژە چێژ لە کریسپیترین مریشک ببینە.'
                  : 'Add delicious Chikora fried chicken, burgers, and sides to get started.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((ci, index) => {
                const itemName = isKu ? (ci.item.nameKu || ci.item.name) : ci.item.name;
                return (
                  <div
                    key={`${ci.item.id}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#1f0e12] border border-[#37161e] hover:border-[#f5a623]/30 transition-all"
                  >
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-[#2b1218]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">
                        {itemName}
                      </h4>
                      <p className="text-xs font-black text-[#f5a623] mt-0.5">
                        {formatPrice(ci.item.price * ci.quantity)}
                      </p>
                      {ci.notes && (
                        <p className="text-[11px] text-gray-400 italic truncate mt-0.5">
                          "{ci.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#2a1218] border border-[#441a23] rounded-lg p-1 flex-shrink-0">
                      <button
                        onClick={() => updateCartQuantity(index, ci.quantity - 1)}
                        className="w-6 h-6 rounded bg-[#38181f] text-gray-300 hover:text-white flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(index, ci.quantity + 1)}
                        className="w-6 h-6 rounded bg-[#38181f] text-gray-300 hover:text-white flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-gray-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Order Options */}
              <div className="pt-3 border-t border-[#311318] space-y-3">
                <label className="block text-xs font-bold text-gray-300">
                  {isKu ? 'شێوازی وەرگرتن:' : 'Delivery Preference:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'delivery', labelEn: 'Delivery', labelKu: 'گەیاندن' },
                    { id: 'takeaway', labelEn: 'Takeaway', labelKu: 'سەفەری' },
                    { id: 'dinein', labelEn: 'Dine-In', labelKu: 'لەناو هۆڵ' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setOrderType(t.id)}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all ${
                        orderType === t.id
                          ? 'bg-[#ba181b] text-white border-[#f5a623]'
                          : 'bg-[#220f14] text-gray-400 border-[#38161e]'
                      }`}
                    >
                      {isKu ? t.labelKu : t.labelEn}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      placeholder={isKu ? 'ناوی بەڕێزت' : 'Your Full Name'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#1e0e12] border border-[#38161e] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#f5a623]"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      placeholder={isKu ? 'ژمارەی مۆبایل' : 'Phone Number'}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#1e0e12] border border-[#38161e] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#f5a623]"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      placeholder={
                        orderType === 'dinein'
                          ? (isKu ? 'ژمارەی مێز (بۆ نموونە: مێزی ٧)' : 'Table Number (e.g. Table 7)')
                          : (isKu ? 'گەڕەک / ناونیشانی ورد لە هەولێر' : 'Erbil Neighborhood / Delivery Address')
                      }
                      value={customerLocation}
                      onChange={(e) => setCustomerLocation(e.target.value)}
                      className="w-full bg-[#1e0e12] border border-[#38161e] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#f5a623]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#1a0c0f] border-t border-[#34151b] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-medium">
                {isKu ? 'کۆی گشتی داواکاری:' : 'Order Subtotal:'}
              </span>
              <span className="text-xl font-black text-[#f5a623]">
                {formatPrice(cartTotal)}
              </span>
            </div>

            {isOrderedSuccess && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isKu ? 'داواکاری ئامادەکرا و نێردرا بۆ واتسئەپ!' : 'Order formatted and opened in WhatsApp!'}</span>
              </div>
            )}

            <button
              onClick={handleSendWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all active:scale-98"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{isKu ? 'ناردنی داواکاری لە ڕێگەی واتسئەپ' : 'Send Order via WhatsApp'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
