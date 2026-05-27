<%@ Page Language="C#" AutoEventWireup="true" Inherits="Hdis.Connectors.Dam.Bynder.SitecoreXp.sitecore.shell.Controls.Rich_Text_Editor.Hdis.ConfigurableFile" %>

var scEditor = null;

Telerik.Web.UI.Editor.CommandList["InsertHdisDamLink"] = function (commandName, editor, args)
{
  var d = Telerik.Web.UI.Editor.CommandList._getLinkArgument(editor);
  Telerik.Web.UI.Editor.CommandList._getDialogArguments(d, "A", editor, "DocumentManager");

  scEditor = editor;

  editor.showExternalDialog(
    "/AssetSelector/AssetSelector.aspx?mode=SingleSelectFile&language=<% = Configuration.Remote.Bynder.AssetSelector.Language %>&portalUrl=<% = Configuration.PortalUrlEncoded %>&dam=<% = Configuration.Remote.Bynder.AssetSelector.Dam %>&apiKey=<% = Configuration.ApiKey %>&apiKeyValid=<% = Configuration.ApiKeyValid %>",
    null,
    1100,
    600,
    scInsertHdisDamLink,
    null,
    "Insert DAM link",
    true,
    Telerik.Web.UI.WindowBehaviors.Close + Telerik.Web.UI.WindowBehaviors.Move,
    false,
    true
  );

  document.getElementsByClassName('rwCloseButton')[0].style.left = '0px';
  document.getElementsByClassName('rwIcon')[0].style.marginLeft = '5px';
};

function scInsertHdisDamLink(sender, json)
{
  if (json && json.file && json.assets && json.assets.length > 0) {
    var asset = json.assets[0];
    var file = json.file;

    var html = scEditor.getSelectionHtml();

    if (!html) {
      html = asset.name;
    }

    scEditor.pasteHtml(`<a href="${file.url}" title="${asset.description}" target="_blank" data-damid="${asset.id}">${html}</a>`, "DocumentManager");
  }
}
