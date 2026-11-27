// Shadowrocket script-response-body: spoof webpage timezone
// Rewrite rule (add ONE rule in Shadowrocket -> Config -> Rewrite):
//   ^https://.* url script-response-body <URL of this file>
// Scope is controlled by MitM hostnames: add the domains below to
// Config -> HTTPS Decryption -> Hostnames (or the script never sees them).
// Default spoof zone: America/New_York. Change the TZ line for another
// zone, e.g. 'America/Los_Angeles'.
// Limits: web pages only (apps are not affected); sites with a strict
// Content-Security-Policy may block the injected script; checks that
// derive the offset from getHours()/getUTCHours() are NOT spoofed.

var TZ = 'America/New_York';
var MARKER = 'tz-spoof-v1';

// Only these hosts get the injection (edit to add/remove sites).
var HOSTS = [
  'chatgpt.com', 'openai.com', 'claude.ai', 'anthropic.com',
  'gemini.google.com', 'aistudio.google.com', 'deepseek.com',
  'grok.com', 'x.ai', 'perplexity.ai', 'hackerone.com',
  'x.com', 'discord.com', 'medium.com', 'quora.com', 'signal.org',
  'sora.com', 'poe.com', 'mistral.ai', 'huggingface.co',
  'openrouter.ai', 'cursor.com'
];

function hostMatches(url) {
  try {
    var h = url.split('/')[2].split(':')[0].toLowerCase();
    for (var i = 0; i < HOSTS.length; i++) {
      var d = HOSTS[i];
      if (h === d || h.endsWith('.' + d)) return true;
    }
  } catch (e) {}
  return false;
}

var SNIPPET = '<script>/* ' + MARKER + ' */(function(){try{'
+ 'var TZ="' + TZ + '";'
+ 'var OrigDTF=Intl.DateTimeFormat;'
+ 'function tzOff(d){try{var f=new OrigDTF("en-US",{timeZone:TZ,hour12:false,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"});var p={};f.formatToParts(d).forEach(function(x){p[x.type]=x.value;});var h=+p.hour;if(h===24)h=0;var u=Date.UTC(+p.year,+p.month-1,+p.day,h,+p.minute,+p.second);return Math.round((u-d.getTime())/60000);}catch(e){return -300;}}'
+ 'Date.prototype.getTimezoneOffset=function(){return -tzOff(new Date(this.getTime()));};'
+ 'var _ro=OrigDTF.prototype.resolvedOptions;'
+ 'OrigDTF.prototype.resolvedOptions=function(){var o=_ro.call(this);o.timeZone=TZ;return o;};'
+ 'Intl.DateTimeFormat=function(l,o){o=o||{};if(!o.timeZone)o.timeZone=TZ;return new OrigDTF(l,o);};'
+ 'Intl.DateTimeFormat.prototype=OrigDTF.prototype;'
+ 'Intl.DateTimeFormat.supportedLocalesOf=OrigDTF.supportedLocalesOf;'
+ '["toLocaleString","toLocaleDateString","toLocaleTimeString"].forEach(function(m){var o=Date.prototype[m];Date.prototype[m]=function(l,op){op=op||{};if(!op.timeZone)op.timeZone=TZ;return o.call(this,l,op);};});'
+ 'var _ts=Date.prototype.toString;'
+ 'Date.prototype.toString=function(){try{var off=tzOff(this);var s=off<=0?"-":"+",a=Math.abs(off);var g="GMT"+s+("0"+Math.floor(a/60)).slice(-2)+("0"+(a%60)).slice(-2);return new OrigDTF("en-US",{timeZone:TZ,weekday:"short",month:"short",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(this)+" "+g+" ("+TZ+")";}catch(e){return _ts.call(this);}};'
+ '}catch(e){}})();</script>';

try {
  var url = ($request && $request.url) || '';
  var body = ($response && $response.body) || '';
  if (typeof body === 'string' && body.indexOf(MARKER) === -1
      && hostMatches(url) && /<head[^>]*>/i.test(body)) {
    body = body.replace(/<head[^>]*>/i, function(m){ return m + SNIPPET; });
    $done({body: body});
  } else {
    $done({});
  }
} catch (e) {
  $done({});
}
