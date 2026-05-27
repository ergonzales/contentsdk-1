<%@ Page Language="C#" AutoEventWireup="true" Inherits="Hdis.Connectors.Dam.Bynder.SitecoreXp.sitecore.shell.Hdis.FirstRunCheck" %>

var firstRunCheckFunc = (event) =>{

    var firstRun = <% = IsFirstRun %>;

    if (!firstRun) {
        return;
    }

    var html = "<style>";
    html += "#hdisFirstRunDialogContainer { position: absolute; background-color: #000000b8; width: 100%; height: 100%; top: 0; left: 0; z-index: 2000; }";
    html += "#hdisFirstRunDialog { background: #f8ede6; width: 800px; padding: 30px; border-radius: 20px; margin-left: auto; margin-right: auto; margin-top: 100px; color: #2f2735; }";
    html += "#hdisFirstRunDialog h1 { color: #e56464; font-weight: bold; font-size: 28px; margin-bottom: 15px; }";
    html += "#hdisFirstRunDialog h2 { font-weight: bold; font-size: 20px; margin-bottom: 10px; }";
    html += "#hdisFirstRunDialog p { font-size: 15px; }";
    html += "#hdisFirstRunDialog a { text-decoration: underline; }";
    html += "#hdisFirstRunDialog a.button { text-decoration: none; background: #e56464; padding: 10px 20px; display: inline-block; margin-top: 10px; color: #f8ede6; font-weight: bold; border-radius: 10px; }";
    html += "</style>";
    html += "<div id='hdisFirstRunDialog'>";
    html += "<h1>Human Digital Integration Services</h1>"
    html += "<h2>Bynder DAM Connector for Sitecore XP/XM &amp; XM Cloud</h2>";
    html += "<p>";
    html += "You have just installed the Bynder DAM Connector for Sitecore XP/XM.<br>";
    html += "Before you can use this integration, you must first complete additional setup steps.<br><br>";
    html += "When you confirm this dialog, you will be taken to the 'DAM Connector Settings' item in which you must configure your API key for the Human Digital Integration Services platform.<br>";
    html += "This API key is made available to you if you have a subscription for the platform.<br>";
    html += "To learn more about how subscriptions work, please consult the <a href='https://docs.bynder.humandigital.services' target='_blank'>documentation</a>.<br><br>";
    html += "Once the API key has been set up, all subsequent configuration can be done in our <a href='https://bynder.humandigital.services' target='_blank'>services portal</a>.<br><br>";
    html += "<a class='button' href='/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo=<%= ConnectorSettingsItemId %>'>Open DAM Connector Settings</a>";
    html += "</div>";

    var container = document.createElement("div");
    container.id = "hdisFirstRunDialogContainer";
    container.innerHTML = html;

    document.body.appendChild(container);
};

if (window.addEventListener) { 
  window.addEventListener('load', firstRunCheckFunc) 
}
else { 
  window.attachEvent('onload', firstRunCheckFunc) 
} 
