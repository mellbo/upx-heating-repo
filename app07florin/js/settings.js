  var gateway = `ws://${window.location.hostname}/ws`;
  var websocket;
/*------------------------------------------------------------------------------------------------*/
$(function() {	//run when doc loaded
	setTimeout(function(){
		//
	},1000);
});
/*------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
	createZonesByDb();
    initWebSocket();
    initButton();	
});
/*------------------------------------------------------------------------------------------------*/
  function onOpen(event) {
    console.log('Connection opened');
  }
/*------------------------------------------------------------------------------------------------*/
  function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
  }
/*------------------------------------------------------------------------------------------------*/
  function initWebSocket() {
    console.log('Trying to open a WebSocket connection...');
    websocket = new WebSocket(gateway);
    websocket.onopen    = onOpen;
    websocket.onclose   = onClose;
    websocket.onmessage = onMessage; // <-- add this line
  }
/*------------------------------------------------------------------------------------------------*/
  /*update fields*/
  function onMessage(event) {
	let jsonObject = JSON.parse(event.data);
		document.getElementById("cMillis").innerText = jsonObject['cMs'];
		jsonObject = null;
  }
/*------------------------------------------------------------------------------------------------*/
  function initButton() {
    document.getElementById('idBtnSaveName').addEventListener('click', updAllZoneName);
	document.getElementById('idBtnSavePsk').addEventListener('click', updConnectData);
	document.getElementById('idRestoreESP').addEventListener('click', restoreESP);
	document.getElementById('idRebootESP').addEventListener('click', rebootESP);
	document.getElementById('idBtnSafeMod').addEventListener('click', rebootInSafeMode);
	document.getElementById('idGateway').addEventListener('click', openGatewayLink);
	document.getElementById('idBtnSaveHisterizis').addEventListener('click', updHisterizis);	
  }
/*------------------------------------------------------------------------------------------------*/
function createZonesByDb(){
	let dbN = document.getElementById("idInitNmeZone").value;
	let dbH = document.getElementById("idInitHistZones").value;
	
	let html_code = [];
	let elContainerZoneName = document.getElementById("idContainerZoneName");
	/*Name Zones*/
	for (let i = 1; i <= 15; i++) {		
		let xName = dbN.split("::")[i-1];
		let xLblName = "Zona "+i.toString();
		
		html_code.push('<div class="input-group input-group-sm mb-2 inputSettings">');
		html_code.push('<div class="input-group-prepend inputSettings">');
		html_code.push('<span class="input-group-text inputSettings">'+xLblName+'</span></div>');
		html_code.push('<input type="text" class="form-control inputSettings" id="Z'+i.toString()+'NME" autocomplete="off" maxlength="12" value="'+xName+'" /></div>');
	}
	elContainerZoneName.innerHTML = html_code.join("");
	html_code = null;
	
	/* Histerizis Zones */
	let elContainerHisterizis = document.getElementById("idContainerHisterizis");
	html_code = [];
	html_code.push('<p class="m-0 mb-2 ml-2">Global Histerizis</p>');
	for (let i = 1; i <= 15; i++) {
		let xHist = (decodeTemperature(parseInt(dbH.split("::")[i-1]),0.25)).toFixed(1);
		let xLblName = "Histerizis Zona: " + i.toString();		
		html_code.push('<div class="form-group p-0 pl-4 pr-4 mb-2">');
		html_code.push('<label class="m-0 p-0" for>'+xLblName+'<br />');
		html_code.push('<span id="idLblValHistZ'+i.toString()+'" class="m-0 p-0">'+xHist+'</span></label>');
		html_code.push('<input type="range" class="form-control-range" id="Z'+i.toString()+'HST" min="0.25" max="2.5" step="0.25" value="'+xHist+'" /></div>');
	}
	elContainerHisterizis.innerHTML = html_code.join("");
	html_code = null;
	
	/*addEventListener*/
	// update tracking value
	for (let i = 1; i <= 15; i++) {
		let idxTracking = "Z"+i.toString()+"HST";
		let idxLblTracing = "idLblValHistZ"+i.toString()
		document.getElementById(idxTracking).addEventListener('change', function(e){
			document.getElementById(idxLblTracing).innerHTML = document.getElementById(idxTracking).value.toString();
		});
	}
}
/*------------------------------------------------------------------------------------------------*/
function updAllZoneName() {	
	let data = {};
	for (let i = 1; i <= 15; i++) {
		let idxField = "Z"+i.toString()+"NME";
		let nme = "SET"+i.toString()+"NAME";
		let val = document.getElementById([idxField]).value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		data[[nme]] = val;
	}
		
	let _js = JSON.stringify(data);	
    websocket.send(_js);
	_js	= null;
	data = null;
	document.getElementById('idBtnSaveName').disabled = true;
}
/*------------------------------------------------------------------------------------------------*/
function decodeTemperature(Tbyte, pasT = 0.5) {
  return (parseInt(Tbyte) * pasT);
}
/*------------------------------------------------------------------------------------------------*/
function encodeTemperature(fTemp, pasT = 0.5) {
  return  parseInt(fTemp / pasT);
}
/*------------------------------------------------------------------------------------------------*/
function updHisterizis() {
	let data = {};
	for (let i = 1; i <= 15; i++) {
		let idxTrack = "Z"+i.toString()+"HST"; /* Z1HST | histerizis */
		let nme = "SET"+i.toString()+"ZNHIST";
		let val = (encodeTemperature(parseFloat(document.getElementById([idxTrack]).value), 0.25)).toFixed(0);
		data[[nme]] = val;
	}	

	let _js = JSON.stringify(data);
    websocket.send(_js);
	_js	= null;
	data = null;
	document.getElementById('idBtnSaveHisterizis').disabled = true;
}
/*------------------------------------------------------------------------------------------------*/
function updConnectData() {
	let data = {
		"STASSID": document.getElementById("SSID").value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
		"STAPSK": document.getElementById("SSPSK").value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
		"WEBPASSWORD": document.getElementById("WEBPASS").value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
	};
	
	let _js = JSON.stringify(data);
    websocket.send(_js);
	_js	= null;
	data = null;
	document.getElementById('idBtnSavePsk').disabled = true;
}
/*------------------------------------------------------------------------------------------------*/
function restoreESP(){
	let data = {
		"RESET": 1
	};
	
	let _js = JSON.stringify(data);	
    websocket.send(_js);
	_js	= null;
	data = null;
	alert("Sistemul se reseteaza si restarteaza, aproximativ 1 minut.\n"+
		  "Dupa restaurare, este posibil sa fie nevoie sa intrati in SAFEMODE\n"+
		  "pentru a introduce datele de configurare pentru Internet WIFI.\n"+
		  "Adresa mea in mod AP este: http://192.168.1.1");
	setTimeout(function(){
		window.location.replace("http://192.168.1.1");
		}, 3000);			  
}
/*------------------------------------------------------------------------------------------------*/
function rebootESP(){
	let data = {
		"RESTART": 1
	};
	
	let _js = JSON.stringify(data);	
    websocket.send(_js);
	_js	= null;
	data = null;
	alert("Sistemul se restarteaza, 20 secunde.\n"+
		  "Actualizati (refresh) pagina dupa timp-ul expirat.");
}
/*------------------------------------------------------------------------------------------------*/
function rebootInSafeMode(){
	let data = {
		"SAFEMODE": 1
	};
	
	let _js = JSON.stringify(data);	
    websocket.send(_js);
	_js	= null;
	data = null;
	alert("Sistemul se restarteaza, si va rula in mod AP.\n"+
		  "Cautati in lista WIFI SSID 'UPX-GATEWAY' si conectati-va.\n"+
		  "Adresa mea pentru AP este: http://192.168.1.1\n\n"+
		  "Confirmati acest dialog dupa ce sunteti deja conectat la 'UPX-GATEWAY' !");
	setTimeout(function(){
		window.location.replace("http://192.168.1.1");
		}, 3000);		  
}
/*------------------------------------------------------------------------------------------------*/
function openGatewayLink() {
	let elRouterIP = document.getElementById("idRouterIP");
	let RouterIP = elRouterIP.innerHTML;
	setTimeout(function(){
		alert("Pagina se va deschide in fereastra noua.");
		window.open("http://"+RouterIP);
		}, 20);
}
/*REGULAR*/
/*------------------------------------------------------------------------------------------------*/