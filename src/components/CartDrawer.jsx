import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, MapPin, User, Phone, CheckCircle2 } from 'lucide-react';

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
      ? `*داواکاری نوێ لە مێنیوی چیکۆرا هه‌ولێر*\n`
      : `*New Order from Chikora Hawler*\n`;

    message += `------------------------------------\n`;
    message += isKu ? `جۆری داواکاری: ${orderType === 'delivery' ? 'گەیاندن (Delivery)' : orderType === 'dinein' ? 'لەناو هۆڵ (Dine-in)' : 'بردنەوە (Takeaway)'}\n`
                    : `Order Type: ${orderType.toUpperCase()}\n`;

    if (customerName) {
      message += isKu ? `ناوی کڕیار: ${customerName}\n` : `Name: ${customerName}\n`;
    }
    if (customerPhone) {
      message += isKu ? `تەلەفۆن: ${customerPhone}\n` : `Phone: ${customerPhone}\n`;
    }
    if (customerLocation) {
      message += isKu ? `ناونیشان / مێز: ${customerLocation}\n` : `Address / Table: ${customerLocation}\n`;
    }

    message += `------------------------------------\n`;
    message += isKu ? `*خواردنەکان:*\n` : `*Items Ordered:*\n`;

    cart.forEach((ci, idx) => {
      const itemName = isKu ? (ci.item.nameKu || ci.item.name) : ci.item.name;
      message += `${idx + 1}. ${itemName} x${ci.quantity} - ${formatPrice(ci.item.price * ci.quantity)}\n`;
      if (ci.notes) {
        message += `   (تێبینی: ${ci.notes})\n`;
      }
    });

    message += `------------------------------------\n`;
    message += isKu
      ? `*کۆی گشتی: ${formatPrice(cartTotal)}*\n`
      : `*Grand Total: ${formatPrice(cartTotal)}*\n`;
    message += `------------------------------------\n`;
    message += isKu ? `سوپاس بۆ هەڵبژاردنی چیکۆرا هه‌ولێر.` : `Thank you for choosing Chikora Hawler.`;

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
        className="w-full max-w-md bg-zinc-900 border-l border-white/[0.08] rtl:border-l-0 rtl:border-r h-full flex flex-col shadow-dialog"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-800 text-amber-400 border border-white/10">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {isKu ? 'سەبەتەی داواکاری' : 'Your Order Bag'}
              </h2>
              <span className="text-[11px] text-zinc-400">
                {cart.length} {isKu ? 'خواردن' : 'items'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-zinc-400 hover:text-red-400 p-1"
                title="Clear All"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400">
                <ShoppingBag className="w-6 h-6 text-amber-400/80" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isKu ? 'سەبەتەکەت بەتاڵە' : 'Your Bag is Empty'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                {isKu
                  ? 'خواردنە بەتامەکانی چیکۆرا هەڵبژێرە و چێژ لە کریسپیترین مریشک ببینە.'
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
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-950 border border-white/[0.06]"
                  >
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-zinc-800"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {itemName}
                      </h4>
                      <p className="text-xs font-bold text-amber-400 tabular-nums mt-0.5">
                        {formatPrice(ci.item.price * ci.quantity)}
                      </p>
                      {ci.notes && (
                        <p className="text-[10px] text-zinc-400 italic truncate mt-0.5">
                          "{ci.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-800/80 border border-white/10 rounded-md p-0.5 flex-shrink-0">
                      <button
                        onClick={() => updateCartQuantity(index, ci.quantity - 1)}
                        className="w-5 h-5 rounded text-zinc-300 hover:text-white flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-white tabular-nums">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(index, ci.quantity + 1)}
                        className="w-5 h-5 rounded text-zinc-300 hover:text-white flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {/* Order Options */}
              <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
                <label className="block text-xs font-medium text-zinc-300">
                  {isKu ? 'شێوازی داواکاری:' : 'Order Type:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'delivery', labelEn: 'Delivery', labelKu: 'گەیاندن' },
                    { id: 'takeaway', labelEn: 'Takeaway', labelKu: 'سەفەری' },
                    { id: 'dinein', labelEn: 'Dine-In', labelKu: 'لە هۆڵ' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setOrderType(t.id)}
                      className={`py-1.5 px-1 text-xs font-semibold rounded-lg border text-center transition-all ${
                        orderType === t.id
                          ? 'bg-zinc-800 text-white border-white/20'
                          : 'bg-zinc-950 text-zinc-400 border-white/[0.06]'
                      }`}
                    >
                      {isKu ? t.labelKu : t.labelEn}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder={isKu ? 'ناوی بەڕێزت' : 'Your Full Name'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder={isKu ? 'ژمارەی مۆبایل' : 'Phone Number'}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder={
                        orderType === 'dinein'
                          ? (isKu ? 'ژمارەی مێز (بۆ نموونە: مێزی ٧)' : 'Table Number (e.g. Table 7)')
                          : (isKu ? 'ناونیشانی ورد لە هەولێر' : 'Erbil Delivery Address')
                      }
                      value={customerLocation}
                      onChange={(e) => setCustomerLocation(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-zinc-950 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-zinc-400 font-medium">
                {isKu ? 'کۆی گشتی:' : 'Subtotal:'}
              </span>
              <span className="text-base sm:text-lg font-bold text-white tabular-nums">
                {formatPrice(cartTotal)}
              </span>
            </div>

            {isOrderedSuccess && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isKu ? 'داواکاری ئامادەکرا لە واتسئەپ!' : 'Order opened in WhatsApp!'}</span>
              </div>
            )}

            <button
              onClick={handleSendWhatsApp}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{isKu ? 'ناردن بۆ واتسئەپ' : 'Order via WhatsApp'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
