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
		for (let i=1; i<=15;i++){
			document.getElementById(["idRoomTemp-Zone"+i]).innerHTML = (parseFloat(jsonObject[['LIVE'+i+'TEMP']])/1000).toFixed(1);
		}
		for (let i=1; i<=15;i++){
			let elHeating = document.getElementById(["idHeatOn-Zone"+i]);
			let isEnable = parseInt(jsonObject[['ZONE'+i+'HEAT']]);
			if (isEnable) {
				elHeating.classList.remove("d-none");
			} else {
				elHeating.classList.add("d-none");
			}
		}
		jsonObject = null;
  }
/*------------------------------------------------------------------------------------------------*/
  function initButton() {
    document.getElementById('idBtnSaveName').addEventListener('click', updAllZoneName);
	document.getElementById('idBtnSavePsk').addEventListener('click', updConnectData);
	document.getElementById('idRestoreESP').addEventListener('click', restoreESP);
	document.getElementById('idRebootESP').addEventListener('click', rebootESP);
  }
/*------------------------------------------------------------------------------------------------*/
function updAllZoneName() {
	console.log('i`m here ??');
	let data = {
		"SET1NAME": document.getElementById("Z1NME").value,
		"SET2NAME": document.getElementById("Z2NME").value,
		"SET3NAME": document.getElementById("Z3NME").value,
		"SET4NAME": document.getElementById("Z4NME").value,
		"SET5NAME": document.getElementById("Z5NME").value,
		"SET6NAME": document.getElementById("Z6NME").value,
		"SET7NAME": document.getElementById("Z7NME").value,
		"SET8NAME": document.getElementById("Z8NME").value,
		"SET9NAME": document.getElementById("Z9NME").value,
		"SET10NAME": document.getElementById("Z10NME").value,
		"SET11NAME": document.getElementById("Z11NME").value,
		"SET12NAME": document.getElementById("Z12NME").value,
		"SET13NAME": document.getElementById("Z13NME").value,
		"SET14NAME": document.getElementById("Z14NME").value,
		"SET15NAME": document.getElementById("Z15NME").value
	};
	
	let _js = JSON.stringify(data);	
    websocket.send(_js);
	_js	= null;
	data = null;
	document.getElementById('idBtnSaveName').disabled = true;
}
/*------------------------------------------------------------------------------------------------*/
function updConnectData() {
	let data = {
		"STASSID": document.getElementById("SSID").value,
		"STAPSK": document.getElementById("SSPSK").value,
		"WEBPASSWORD": document.getElementById("WEBPASS").value
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
		  "Actualizati (refresh) pagina dupa timp-ul expirat.");	
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
/*REGULAR*/
/*------------------------------------------------------------------------------------------------*/