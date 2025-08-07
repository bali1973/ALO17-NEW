package com.alo17.mobile;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.widget.Toast;
import android.util.Log;

public class PayTRActivity extends Activity {
    private static final String TAG = "PayTRActivity";
    private WebView webView;
    private String paymentUrl;
    private String successUrl;
    private String failUrl;
    private String cancelUrl;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Get payment data from intent
        Intent intent = getIntent();
        paymentUrl = intent.getStringExtra("payment_url");
        successUrl = intent.getStringExtra("success_url");
        failUrl = intent.getStringExtra("fail_url");
        cancelUrl = intent.getStringExtra("cancel_url");
        
        if (paymentUrl == null) {
            Toast.makeText(this, "Ödeme URL'i bulunamadı", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
        
        setupWebView();
        loadPaymentPage();
    }
    
    private void setupWebView() {
        webView = new WebView(this);
        setContentView(webView);
        
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(true);
        webSettings.setDefaultTextEncodingName("utf-8");
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                Log.d(TAG, "Loading URL: " + url);
                
                // Handle PayTR callback URLs
                if (url.contains("alo17://payment/success")) {
                    handlePaymentSuccess(url);
                    return true;
                } else if (url.contains("alo17://payment/failed")) {
                    handlePaymentFailed(url);
                    return true;
                } else if (url.contains("alo17://payment/cancelled")) {
                    handlePaymentCancelled(url);
                    return true;
                }
                
                return false;
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d(TAG, "Page loaded: " + url);
            }
            
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.e(TAG, "WebView error: " + error.getDescription());
                Toast.makeText(PayTRActivity.this, "Ödeme sayfası yüklenirken hata oluştu", Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private void loadPaymentPage() {
        Log.d(TAG, "Loading payment URL: " + paymentUrl);
        webView.loadUrl(paymentUrl);
    }
    
    private void handlePaymentSuccess(String url) {
        Log.d(TAG, "Payment success: " + url);
        
        // Extract payment data from URL
        Uri uri = Uri.parse(url);
        String token = uri.getQueryParameter("token");
        String amount = uri.getQueryParameter("amount");
        
        // Send result to React Native
        Intent resultIntent = new Intent();
        resultIntent.putExtra("status", "success");
        resultIntent.putExtra("token", token);
        resultIntent.putExtra("amount", amount);
        setResult(RESULT_OK, resultIntent);
        
        Toast.makeText(this, "Ödeme başarılı!", Toast.LENGTH_SHORT).show();
        finish();
    }
    
    private void handlePaymentFailed(String url) {
        Log.d(TAG, "Payment failed: " + url);
        
        Uri uri = Uri.parse(url);
        String error = uri.getQueryParameter("error");
        
        Intent resultIntent = new Intent();
        resultIntent.putExtra("status", "failed");
        resultIntent.putExtra("error", error);
        setResult(RESULT_CANCELED, resultIntent);
        
        Toast.makeText(this, "Ödeme başarısız: " + error, Toast.LENGTH_SHORT).show();
        finish();
    }
    
    private void handlePaymentCancelled(String url) {
        Log.d(TAG, "Payment cancelled: " + url);
        
        Intent resultIntent = new Intent();
        resultIntent.putExtra("status", "cancelled");
        setResult(RESULT_CANCELED, resultIntent);
        
        Toast.makeText(this, "Ödeme iptal edildi", Toast.LENGTH_SHORT).show();
        finish();
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            handlePaymentCancelled("User pressed back button");
        }
    }
} 