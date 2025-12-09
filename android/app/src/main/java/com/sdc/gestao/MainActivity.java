package com.sdc.gestao;

import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onBackPressed() {
        WebView webView = getBridge().getWebView();
        
        if (webView.canGoBack()) {
            // Se pode voltar no histórico, volta
            webView.goBack();
        } else {
            // Se está na página raiz, executa o comportamento padrão (fechar)
            super.onBackPressed();
        }
    }
}
