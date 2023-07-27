package ru.deep.contacts;

import android.Manifest;
import android.database.Cursor;
import android.provider.CallLog;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
        name = "CallHistory",
        permissions = {@Permission(strings = {Manifest.permission.READ_CALL_LOG}, alias = "CallHistory")}
)
public class CallHistory extends Plugin {

    @PluginMethod
    public void getPermissions(PluginCall call) {
        if (!hasRequiredPermissions()) {
            requestPermissions(call);
        } else {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
        }
    }

    @PluginMethod
    public void getCallHistory(PluginCall call){
        JSObject result = new JSObject();

        JSArray call_list = new JSArray();

        Cursor cursor = getContext().getContentResolver().query(CallLog.Calls.CONTENT_URI, null, null, null, CallLog.Calls.DATE + " DESC");

        while (cursor.moveToNext()) {
            int number_call = cursor.getColumnIndex(CallLog.Calls.NUMBER);
            JSObject call_object = new JSObject();

            if(number_call >= 0){
                String number = cursor.getString(number_call);
                call_object.put("phoneNumber", number);
            }

            int type_call = cursor.getColumnIndex(CallLog.Calls.TYPE);
            if(type_call >= 0){
                String type = cursor.getString(type_call);
                int number_type = Integer.parseInt(type);
                if(number_type == CallLog.Calls.INCOMING_TYPE){
                    call_object.put("type", "INCOMING_TYPE");
                }else if(number_type == CallLog.Calls.OUTGOING_TYPE){
                    call_object.put("type", "OUTGOING_TYPE");
                }else if(number_type == CallLog.Calls.MISSED_TYPE){
                    call_object.put("type", "MISSED_TYPE");
                }else if(number_type == CallLog.Calls.VOICEMAIL_TYPE){
                    call_object.put("type", "VOICEMAIL_TYPE");
                }else if(number_type == CallLog.Calls.REJECTED_TYPE){
                    call_object.put("type", "REJECTED_TYPE");
                }else if(number_type == CallLog.Calls.BLOCKED_TYPE){
                    call_object.put("type", "BLOCKED_TYPE");
                }
            }

            int date_call = cursor.getColumnIndex(CallLog.Calls.DATE);
            if(date_call >= 0) {
                String date = cursor.getString(date_call);
                call_object.put("date", date);
            }

            int duration_call = cursor.getColumnIndex(CallLog.Calls.DURATION);
            if(duration_call >= 0){
                String duration = cursor.getString(duration_call);
                call_object.put("duration", duration);
            }
            call_list.put(call_object);
        }
        cursor.close();

        result.put("call_log", call_list);
        call.resolve(result);
    }
}
