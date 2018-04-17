function init() {
  var $ = go.GraphObject.make;  // for conciseness in defining templates

  myDiagram =
    $(go.Diagram, "myDiagram",
      {
        initialContentAlignment: go.Spot.Center,
        validCycle: go.Diagram.CycleNotDirected,
        "undoManager.isEnabled": true
      });  // don't allow loops

  myDiagram.addDiagramListener("Modified", function(e) {
   var button = document.getElementById("SaveButton");
   if (button) button.disabled = !myDiagram.isModified;
   var idx = document.title.indexOf("*");
   if (myDiagram.isModified) {
     if (idx < 0) document.title += "*";
   } else {
     if (idx >= 0) document.title = document.title.substr(0, idx);
   }
  });
  var W_geometry = go.Geometry.parse("M 0,0 L 10,50 20,10 30,50 40,0", false);
  var D_geometry = go.Geometry.parse("M 0,0 L 40,0", false);
  var V_geometry = go.Geometry.parse("M 0,0 L 10,50 20,10", false);
  var fieldTemplate =
    $(go.Panel, "Horizontal",  // this Panel is a row in the containing Table
      new go.Binding("portId", "name"),  // this Panel is a "port"
      { background: "transparent",  // so this port's background can be picked by the mouse
        fromSpot: go.Spot.Right,  // links only go from the right side to the left side
        toSpot: go.Spot.Left,
        fromLinkable: true, toLinkable: true },  // allow drawing links from or to this port
      $(go.Shape,
        { width: 12, height: 12, column: 0, strokeWidth: 2, margin: 4,
          fromLinkable: false, toLinkable: false },
        new go.Binding("figure", "figure"),
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { margin: new go.Margin(0, 2), column: 1, font: "bold 13px sans-serif",
          fromLinkable: false, toLinkable: false, editable: true },
        new go.Binding("text", "name")),
      $(go.TextBlock,
        { margin: new go.Margin(0, 2), column: 2, font: "13px sans-serif",
          textValidation: isValidDataType,
          fromLinkable: false, toLinkable: false, editable: true },
        new go.Binding("text", "data_type")),
      $("Button",
        {
          row: 0, alignment: go.Spot.TopRight,
          "ButtonBorder.stroke": null,
          click: function(e, but) {
            console.log(but);
            console.log(but.part);
            console.log(but.part.data);
            var list = but.part.findObject("LIST");
            if (list !== null) {
              var shape = but.findObject("DSHAPE");
              
            }
            
            
//            var list = but.part.findObject("LIST");
//              if (list !== null) {
//                var shape = but.part.findObject("KEY");
//                list.itemArray.push(item_sample);
//                refresh();
//              }
            
            
            //alert('oi');
          } 
        },
        $(go.Shape, { geometry: D_geometry, strokeWidth: 2 },
          { name: "DSHAPE", width: 6, height: 4 }))
    );

  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      { 
        resizable: false,
        isShadowed: true,
        shadowColor: "#C5C1AA",
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        selectionAdorned: true,
        contextMenu: $(go.Adornment),
        selectable: true,
        movable: true,
        copyable: true,
        deletable: true 
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "Rectangle",
        { fill: "#EEEEEE", stroke: "#756875", strokeWidth: 3 }),
      
      $(go.Panel, "Table",
        { margin: 8, stretch: go.GraphObject.Fill },
        $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
        $(go.TextBlock,
          {
            name: "KEY",
            row: 0, 
            alignment: go.Spot.Center,
            margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
            font: "bold 16px sans-serif",
            editable: true
          },
          new go.Binding("text", "key")),
        $("Button",
          {
            row: 0, alignment: go.Spot.TopRight,
            "ButtonBorder.stroke": null,
            click: function(e, but) {
              var list = but.part.findObject("LIST");
              if (list !== null) {
                list.diagram.startTransaction("collapse/expand");
                list.visible = !list.visible;
                var shape = but.findObject("SHAPE");
                if (shape !== null) shape.figure = (list.visible ? "TriangleUp" : "TriangleDown");
                list.diagram.commitTransaction("collapse/expand");
              }
            } 
          },
          $(go.Shape, "TriangleUp",
            { name: "SHAPE", width: 6, height: 4 })),
        $(go.Panel, "Vertical",
          {
            name: "LIST",
            row: 1,
            padding: 3,
            alignment: go.Spot.TopLeft,
            defaultAlignment: go.Spot.Left,
            stretch: go.GraphObject.Horizontal,
            itemTemplate: fieldTemplate
          },
          new go.Binding("itemArray", "fields")),
        $("Button",
          {
            row: 10, 
            alignment: go.Spot.Center,
            "ButtonBorder.stroke": null,
            click: function(e, but) {
              var list = but.part.findObject("LIST");
              if (list !== null) {
                var shape = but.part.findObject("KEY");
                list.itemArray.push(item_sample);
                refresh();
              }
            } 
          },
          $(go.Shape, "ThickCross",
            { name: "SHAPE", width: 10, height: 10 }))
      )  // end Table Panel
    );  // end Node

  myDiagram.linkTemplate =
    $(go.Link,
      { relinkableFrom: true, relinkableTo: true, toShortLength: 4 },  // let user reconnect links
      $(go.Shape, { strokeWidth: 1.5 }),
      $(go.Shape, { toArrow: "Standard", stroke: null })
    );

  myDiagram.model =
    $(go.GraphLinksModel,
      { linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        nodeDataArray: [],
        linkDataArray: []
      }
     );

  myDiagram.contextMenu = $(go.Adornment);
  var cxElement = document.getElementById("contextMenu");
  cxElement.addEventListener("contextmenu", function(e) { e.preventDefault(); return false; }, false);
  cxElement.addEventListener("blur", function(e) { cxMenu.stopTool(); }, false);
  var cxTool = myDiagram.toolManager.contextMenuTool;
  cxTool.showContextMenu = function(contextmenu, obj) {
    var diagram = this.diagram;
    if (diagram === null) return;
    if (contextmenu !== this.currentContextMenu) {
      this.hideContextMenu();
    }
    var cmd = diagram.commandHandler;
    document.getElementById("cut").style.display = cmd.canCutSelection() ? "block" : "none";
    document.getElementById("copy").style.display = cmd.canCopySelection() ? "block" : "none";
    document.getElementById("paste").style.display = cmd.canPasteSelection() ? "block" : "none";
    document.getElementById("delete").style.display = cmd.canDeleteSelection() ? "block" : "none";
    document.getElementById("color").style.display = obj !== null ? "block" : "none";

    cxElement.style.display = "block";
    var mousePt = diagram.lastInput.viewPoint;
    cxElement.style.left = mousePt.x + "px";
    cxElement.style.top = mousePt.y + "px";

    this.currentContextMenu = contextmenu;
  }

  cxTool.hideContextMenu = function() {
    if (this.currentContextMenu === null) return;
    cxElement.style.display = "none";
    this.currentContextMenu = null;
  }
  load();
}

function cxcommand(val) {
  var diagram = myDiagram;
  if (!(diagram.currentTool instanceof go.ContextMenuTool)) return;
  switch (val) {
    case "Cortar": diagram.commandHandler.cutSelection(); break;
    case "Copiar": diagram.commandHandler.copySelection(); break;
    case "Colar": diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint); break;
    case "Deletar": diagram.commandHandler.deleteSelection(); break;
    case "Cor": changeColor(diagram); break;
  }
  diagram.currentTool.stopTool();
}

function changeColor(diagram) {
  var cmObj = diagram.toolManager.contextMenuTool.currentObject;

  diagram.startTransaction("change color");
  diagram.selection.each(function(node) {
    if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
      var data = node.data;
      if (data.color === "red") {
        diagram.model.setDataProperty(data, "color", go.Brush.randomColor());
      } else {
        diagram.model.setDataProperty(data, "color", "red");
      }
    }
  });
  diagram.commitTransaction("change color");
}

function saveDiagramProperties() {
 myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
}

function loadDiagramProperties(e) {
  var pos = myDiagram.model.modelData.position;
  if (pos) myDiagram.position = go.Point.parse(pos);
}

function isValidDataType(textblock, oldstr, newstr){
  if(newstr.match(/(checkbox|boolean|currency|number|primary_key|date|radio|email|input|password|select|textarea|url|sub_document)/) == null)
    return false;
  else
    return true;
}

var entity_sample = {
  "key":"Entidade", 
  "fields":[ 
     {"name":"id", "data_type":"primary_key", "color":"#FFB900", "figure":"Square"},
     {"name":"name", "data_type":"input", "color":"#F25022", "figure":"Rectangle"}
  ], 
  "loc":"250 0"
}

var item_sample = { 
  "name":"Name", 
  "data_type":"input", 
  "color":"#44444", 
  "figure":"Triangle"
}

var data_types = {
  checkbox: 'Boolean',
  boolean: 'Boolean',
  primary_key: 'Number',
  currency: 'Number',
  number: 'Number',
  date: 'Date',
  radio: 'String',
  email: 'String',
  input: 'String',
  password: 'String',
  select: 'String',
  textarea: 'String',
  url: 'String',
  sub_document: 'SubDoc'
} 

function load() {
  myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}

function save() {
  saveDiagramProperties();  // do this first, before writing to JSON
  document.getElementById("mySavedModel").value = myDiagram.model.toJson();
  myDiagram.isModified = false;
}

function refresh() {
  var current_model = JSON.parse(myDiagram.model.toJson());
  myDiagram.model = go.Model.fromJson(JSON.stringify(current_model));
  document.getElementById("mySavedModel").value = JSON.stringify(current_model);
  //save();
  //load();
}

function add() {
  var current_model = JSON.parse(myDiagram.model.toJson());
  current_model.nodeDataArray.push(entity_sample);
  myDiagram.model = go.Model.fromJson(JSON.stringify(current_model));
  document.getElementById("mySavedModel").value = JSON.stringify(current_model);
}

function showModel() {
  document.getElementById("mySavedModel").textContent = myDiagram.model.toJson();
}
