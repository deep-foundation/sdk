package com.deepfoundation.deep;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import ru.deep.contacts.CallHistory;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CallHistory.class);
        super.onCreate(savedInstanceState);
    }
}
