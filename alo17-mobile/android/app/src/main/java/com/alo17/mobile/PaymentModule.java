package com.alo17.mobile;

import android.app.Activity;
import android.content.Intent;
import android.nfc.NfcAdapter;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class PaymentModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG = "PaymentModule";
    private static final int PAYTR_REQUEST_CODE = 1001;
    private static final int NFC_REQUEST_CODE = 1002;
    
    private ReactApplicationContext reactContext;
    private Promise paytrPromise;
    private Promise nfcPromise;
    private NfcAdapter nfcAdapter;

    public PaymentModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "PaymentModule";
    }

    /**
     * PayTR ödeme işlemi başlat
     */
    @ReactMethod
    public void startPayTRPayment(ReadableMap paymentData, Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null) {
                promise.reject("NO_ACTIVITY", "Activity bulunamadı");
                return;
            }

            this.paytrPromise = promise;

            Intent intent = new Intent(currentActivity, PayTRActivity.class);
            intent.putExtra("payment_url", paymentData.getString("paymentUrl"));
            intent.putExtra("success_url", paymentData.getString("successUrl"));
            intent.putExtra("fail_url", paymentData.getString("failUrl"));
            intent.putExtra("cancel_url", paymentData.getString("cancelUrl"));

            currentActivity.startActivityForResult(intent, PAYTR_REQUEST_CODE);

        } catch (Exception e) {
            Log.e(TAG, "PayTR payment error", e);
            promise.reject("PAYTR_ERROR", e.getMessage());
        }
    }

    /**
     * NFC ödeme işlemi başlat
     */
    @ReactMethod
    public void startNFCPayment(ReadableMap paymentData, Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null) {
                promise.reject("NO_ACTIVITY", "Activity bulunamadı");
                return;
            }

            this.nfcPromise = promise;

            Intent intent = new Intent(currentActivity, NFCPaymentActivity.class);
            intent.putExtra("amount", paymentData.getDouble("amount"));
            intent.putExtra("card_number", paymentData.getString("cardNumber"));
            intent.putExtra("expiry_date", paymentData.getString("expiryDate"));
            intent.putExtra("cvv", paymentData.getString("cvv"));

            currentActivity.startActivityForResult(intent, NFC_REQUEST_CODE);

        } catch (Exception e) {
            Log.e(TAG, "NFC payment error", e);
            promise.reject("NFC_ERROR", e.getMessage());
        }
    }

    /**
     * NFC desteğini kontrol et
     */
    @ReactMethod
    public void isNFCSupported(Promise promise) {
        try {
            boolean isSupported = nfcAdapter != null;
            promise.resolve(isSupported);
        } catch (Exception e) {
            Log.e(TAG, "NFC support check error", e);
            promise.reject("NFC_CHECK_ERROR", e.getMessage());
        }
    }

    /**
     * NFC etkin mi kontrol et
     */
    @ReactMethod
    public void isNFCEnabled(Promise promise) {
        try {
            boolean isEnabled = nfcAdapter != null && nfcAdapter.isEnabled();
            promise.resolve(isEnabled);
        } catch (Exception e) {
            Log.e(TAG, "NFC enabled check error", e);
            promise.reject("NFC_ENABLED_CHECK_ERROR", e.getMessage());
        }
    }

    /**
     * NFC ayarlarını aç
     */
    @ReactMethod
    public void openNFCSettings(Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null) {
                promise.reject("NO_ACTIVITY", "Activity bulunamadı");
                return;
            }

            Intent intent = new Intent(Settings.ACTION_NFC_SETTINGS);
            currentActivity.startActivity(intent);
            promise.resolve(true);

        } catch (Exception e) {
            Log.e(TAG, "NFC settings error", e);
            promise.reject("NFC_SETTINGS_ERROR", e.getMessage());
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == PAYTR_REQUEST_CODE) {
            handlePayTRResult(resultCode, data);
        } else if (requestCode == NFC_REQUEST_CODE) {
            handleNFCResult(resultCode, data);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // Handle deep link intents if needed
    }

    /**
     * PayTR sonucunu işle
     */
    private void handlePayTRResult(int resultCode, Intent data) {
        if (paytrPromise == null) {
            return;
        }

        try {
            WritableMap result = Arguments.createMap();

            if (resultCode == Activity.RESULT_OK && data != null) {
                String status = data.getStringExtra("status");
                result.putString("status", status);

                if ("success".equals(status)) {
                    result.putString("token", data.getStringExtra("token"));
                    result.putDouble("amount", data.getDoubleExtra("amount", 0.0));
                    result.putString("payment_method", "paytr");
                } else if ("failed".equals(status)) {
                    result.putString("error", data.getStringExtra("error"));
                    result.putString("payment_method", "paytr");
                } else if ("cancelled".equals(status)) {
                    result.putString("payment_method", "paytr");
                }

                paytrPromise.resolve(result);
            } else {
                result.putString("status", "cancelled");
                result.putString("payment_method", "paytr");
                paytrPromise.resolve(result);
            }

        } catch (Exception e) {
            Log.e(TAG, "PayTR result handling error", e);
            paytrPromise.reject("PAYTR_RESULT_ERROR", e.getMessage());
        } finally {
            paytrPromise = null;
        }
    }

    /**
     * NFC sonucunu işle
     */
    private void handleNFCResult(int resultCode, Intent data) {
        if (nfcPromise == null) {
            return;
        }

        try {
            WritableMap result = Arguments.createMap();

            if (resultCode == Activity.RESULT_OK && data != null) {
                String status = data.getStringExtra("status");
                result.putString("status", status);

                if ("success".equals(status)) {
                    result.putDouble("amount", data.getDoubleExtra("amount", 0.0));
                    result.putString("payment_method", "nfc");
                    result.putString("transaction_id", data.getStringExtra("transaction_id"));
                } else if ("failed".equals(status)) {
                    result.putString("error", data.getStringExtra("error"));
                    result.putString("payment_method", "nfc");
                } else if ("cancelled".equals(status)) {
                    result.putString("payment_method", "nfc");
                }

                nfcPromise.resolve(result);
            } else {
                result.putString("status", "cancelled");
                result.putString("payment_method", "nfc");
                nfcPromise.resolve(result);
            }

        } catch (Exception e) {
            Log.e(TAG, "NFC result handling error", e);
            nfcPromise.reject("NFC_RESULT_ERROR", e.getMessage());
        } finally {
            nfcPromise = null;
        }
    }

    /**
     * React Native'e event gönder
     */
    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
} 