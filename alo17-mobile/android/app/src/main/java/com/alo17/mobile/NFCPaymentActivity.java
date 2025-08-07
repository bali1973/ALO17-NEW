package com.alo17.mobile;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.IsoDep;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.ProgressBar;
import android.os.Vibrator;
import android.content.Context;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class NFCPaymentActivity extends Activity {
    private static final String TAG = "NFCPaymentActivity";
    
    private NfcAdapter nfcAdapter;
    private PendingIntent pendingIntent;
    private IntentFilter[] intentFilters;
    private String[][] techLists;
    
    private TextView statusText;
    private ProgressBar progressBar;
    private Button cancelButton;
    private Vibrator vibrator;
    private ExecutorService executor;
    private Handler mainHandler;
    
    private double paymentAmount;
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nfc_payment);
        
        // Get payment data from intent
        Intent intent = getIntent();
        paymentAmount = intent.getDoubleExtra("amount", 0.0);
        cardNumber = intent.getStringExtra("card_number");
        expiryDate = intent.getStringExtra("expiry_date");
        cvv = intent.getStringExtra("cvv");
        
        initializeViews();
        initializeNFC();
        startNFCDetection();
    }
    
    private void initializeViews() {
        statusText = findViewById(R.id.status_text);
        progressBar = findViewById(R.id.progress_bar);
        cancelButton = findViewById(R.id.cancel_button);
        vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        executor = Executors.newSingleThreadExecutor();
        mainHandler = new Handler(Looper.getMainHandler());
        
        statusText.setText("NFC kartınızı telefonun arkasına yaklaştırın");
        
        cancelButton.setOnClickListener(v -> {
            setResult(RESULT_CANCELED);
            finish();
        });
    }
    
    private void initializeNFC() {
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        
        if (nfcAdapter == null) {
            Toast.makeText(this, "Bu cihaz NFC desteklemiyor", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
        
        if (!nfcAdapter.isEnabled()) {
            Toast.makeText(this, "Lütfen NFC'yi etkinleştirin", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
        
        // Create PendingIntent for NFC detection
        Intent intent = new Intent(this, getClass());
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        pendingIntent = PendingIntent.getActivity(this, 0, intent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
        
        // Create intent filters for NFC
        IntentFilter ndef = new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED);
        try {
            ndef.addDataType("*/*");
        } catch (IntentFilter.MalformedMimeTypeException e) {
            throw new RuntimeException("MIME type error", e);
        }
        intentFilters = new IntentFilter[]{ndef};
        
        // Define supported technologies
        techLists = new String[][]{
            {IsoDep.class.getName()},
            {android.nfc.tech.NfcA.class.getName()},
            {android.nfc.tech.NfcB.class.getName()},
            {android.nfc.tech.NfcF.class.getName()},
            {android.nfc.tech.NfcV.class.getName()}
        };
    }
    
    private void startNFCDetection() {
        if (nfcAdapter != null) {
            nfcAdapter.enableForegroundDispatch(this, pendingIntent, intentFilters, techLists);
        }
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        startNFCDetection();
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        if (nfcAdapter != null) {
            nfcAdapter.disableForegroundDispatch(this);
        }
    }
    
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        
        if (NfcAdapter.ACTION_TECH_DISCOVERED.equals(intent.getAction()) ||
            NfcAdapter.ACTION_TAG_DISCOVERED.equals(intent.getAction())) {
            
            Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
            if (tag != null) {
                processNFCPayment(tag);
            }
        }
    }
    
    private void processNFCPayment(Tag tag) {
        updateStatus("Kart okunuyor...");
        vibrate();
        
        executor.execute(() -> {
            try {
                // Simulate NFC card reading and payment processing
                Thread.sleep(2000); // Simulate processing time
                
                // Validate card data
                if (validateCardData()) {
                    // Process payment
                    boolean paymentSuccess = processPayment();
                    
                    mainHandler.post(() -> {
                        if (paymentSuccess) {
                            handlePaymentSuccess();
                        } else {
                            handlePaymentFailed("Ödeme işlemi başarısız");
                        }
                    });
                } else {
                    mainHandler.post(() -> {
                        handlePaymentFailed("Kart bilgileri geçersiz");
                    });
                }
                
            } catch (Exception e) {
                Log.e(TAG, "NFC payment error", e);
                mainHandler.post(() -> {
                    handlePaymentFailed("NFC işlemi sırasında hata oluştu");
                });
            }
        });
    }
    
    private boolean validateCardData() {
        // Basic card validation
        if (cardNumber == null || cardNumber.length() < 13 || cardNumber.length() > 19) {
            return false;
        }
        
        if (expiryDate == null || expiryDate.length() != 5) {
            return false;
        }
        
        if (cvv == null || cvv.length() < 3 || cvv.length() > 4) {
            return false;
        }
        
        // Luhn algorithm validation
        return validateLuhn(cardNumber);
    }
    
    private boolean validateLuhn(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        
        return (sum % 10 == 0);
    }
    
    private boolean processPayment() {
        // Simulate payment processing
        try {
            Thread.sleep(1500);
            
            // Simulate payment success (90% success rate)
            return Math.random() > 0.1;
            
        } catch (InterruptedException e) {
            return false;
        }
    }
    
    private void handlePaymentSuccess() {
        updateStatus("Ödeme başarılı!");
        vibrate();
        
        // Send result to React Native
        Intent resultIntent = new Intent();
        resultIntent.putExtra("status", "success");
        resultIntent.putExtra("amount", paymentAmount);
        resultIntent.putExtra("payment_method", "nfc");
        resultIntent.putExtra("transaction_id", generateTransactionId());
        setResult(RESULT_OK, resultIntent);
        
        Toast.makeText(this, "NFC ödeme başarılı!", Toast.LENGTH_SHORT).show();
        
        // Close activity after delay
        new Handler().postDelayed(this::finish, 2000);
    }
    
    private void handlePaymentFailed(String error) {
        updateStatus("Ödeme başarısız: " + error);
        vibrate();
        
        Intent resultIntent = new Intent();
        resultIntent.putExtra("status", "failed");
        resultIntent.putExtra("error", error);
        setResult(RESULT_CANCELED, resultIntent);
        
        Toast.makeText(this, "NFC ödeme başarısız: " + error, Toast.LENGTH_SHORT).show();
        
        // Close activity after delay
        new Handler().postDelayed(this::finish, 3000);
    }
    
    private void updateStatus(String status) {
        mainHandler.post(() -> {
            statusText.setText(status);
        });
    }
    
    private void vibrate() {
        if (vibrator != null && vibrator.hasVibrator()) {
            vibrator.vibrate(200);
        }
    }
    
    private String generateTransactionId() {
        return "NFC_" + System.currentTimeMillis();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (executor != null) {
            executor.shutdown();
        }
    }
} 