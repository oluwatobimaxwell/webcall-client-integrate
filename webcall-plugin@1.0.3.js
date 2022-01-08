const fontLink =
	"https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap";
const iconLink =
	"cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css";

const scripts = [
	"https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js",
	"https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
]

const appendStyle = (styleToAppend) => {
	const style = document.createElement("link");
	style.rel = "stylesheet";
	style.href = `${styleToAppend}`;
	document.head.appendChild(style);
};


const getTabId = () => {
	var iPageTabID = sessionStorage.getItem("tabID");
      // if it is the first time that this page is loaded
    if (!iPageTabID) {
        var iLocalTabID = localStorage.getItem("tabID");
          // if tabID is not yet defined in localStorage it is initialized to 1
          // else tabId counter is increment by 1
        iPageTabID = (iLocalTabID == null) ? 1 : Number(iLocalTabID) + 1;
          // new computed value are saved in localStorage and in sessionStorage
        localStorage.setItem("tabID",iPageTabID);
        sessionStorage.setItem("tabID",iPageTabID);
		return iPageTabID;
    }
	return iPageTabID;
}

const server = "https://webcaller.netlify.app?";
// const server = "http://172.20.10.4:3000?";

const getImageUrl = () => {
	const images = document.getElementsByTagName("img");
	if(images.length > 0) {
		const i = Math.floor(Math.random() * images.length); 
		return images.item(i).src;
	}
	return null;
}

const appendScript = (scriptToAppend) => {
	const script = document.createElement("script");
	script.src = `${scriptToAppend}`;
	script.async = true;
	document.body.appendChild(script);
};

const screenWidth = 375;
const screenHeight = screenWidth * 1.85;

class WebCallClient {
	
	getLocation(callback) {
		this.latLng = {
			latitude: null,
			longitude: null,
		};
		try {
			const h = navigator.geolocation.getCurrentPosition(
				(pos) => {
					this.latLng = {
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
					};
					callback && callback(this.latLng);
				},
				(error) => {
					console.log(error);
					callback && callback({ latitude: null, longitude: null });
				}
			);
		} catch (error) {
			console.log(error);
			callback && callback({ latitude: null, longitude: null });
		}
	}

	init({ clientId }) {

		scripts.forEach(e => {appendScript(e)});

		this.serverUrl = server;
		this.transitionTime = 0.5;
		this.openState =  false;
		
		appendStyle(fontLink);
		// appendStyle(iconLink);
		this.getLocation((latLng = {}) => {

			this.dimensions = {
				defaultWidth: window.innerWidth > 800 ? "100px" : "100px",
				width: window.innerWidth > 800 ? `${screenWidth}px` : "100%",
				height: window.innerWidth > 800 ? `${screenHeight}px` : "100vh",
				// height: window.innerWidth > 800 ? "600px" : "100vh",
				top: (e = "95px") => {
					return `calc(-${e} + 100vh)`;
				},
				bg: "transparent"// window.innerWidth > 800 ? "transparent": "rgba(0,0,0,0.25)"
			};

			// alert(latLng?.latitude)
			const params = {
				...latLng,
				clientId,
				website: window.location.hostname,
				currentPage: `${window.location.origin}${window.location.pathname}`,
				defaultImage: getImageUrl(),
				pageTitle: document.title,
				tabId: getTabId()
			};
			this.params = new URLSearchParams(params).toString();



			this.wrapMain = document.createElement("div");
			this.wrapMain.id = "01-call-i-phone"
			this.wrapMain.style = `transition: all ${this.transitionTime}s ease-in-out 0s; cursor: pointer; position: fixed;  width: ${window.innerWidth > 800 ? this.dimensions.defaultWidth : "100%"}; overflow: hidden; top: ${this.dimensions.top()}; right:  0px; bottom: 1rem; height: ${this.dimensions.height}; z-index: 1000000000000000000000000000000 `;
			
			this.wrap = document.createElement("div");
			this.wrap.style = "overflow: hidden; background: #000; border-radius: 50px; padding: 1rem;position: absolute;top: 5px;bottom: 5px;left: 5px;right: 5px; box-shadow: 0 14px 26px -12px rgb(0, 0, 0),0 4px 23px 0px rgba(0,0,0,.12),0 8px 10px -5px rgb(40, 40, 43); margin: 1rem;";
			
			this.wrapMain.appendChild(this.wrap);

			this.volume = document.createElement("div");
			this.volume.style = "display: none; position: absolute;right: -2px;width: 5px;height: 80px;background: #000;top: 20%;border-radius: 2px;"
			this.wrap.appendChild(this.volume);
			
			this.volume1 = document.createElement("div");
			this.volume1.style = "display: none; position: absolute;left: -2px;width: 5px;height: 30px;background: #000;top: 15%;border-radius: 2px;"
			this.wrap.appendChild(this.volume1);
			
			this.volume2 = document.createElement("div");
			this.volume2.style = "display: none; position: absolute;left: -2px;width: 5px;height: 50px;background: #000;top: calc(15% + 30px + 20px);border-radius: 2px;"
			this.wrap.appendChild(this.volume2);
			
			this.volume3 = document.createElement("div");
			this.volume3.style = "display: none; position: absolute;left: -2px;width: 5px;height: 50px;background: #000;top: calc(15% + 30px + 20px + 50px + 10px);border-radius: 2px;"
			this.wrap.appendChild(this.volume3);

			// this.volume = document.createElement("div")
			// this.wrap.appendChild(this.volume);

			this.statusbar = document.createElement("div");
			this.statusbar.style =
				"font-size: 13px; width: 100%; height: 25px; position: absolute; left: 0px; right: 0px; z-index: 2;top: 20px;";
			this.timebox = document.createElement("div");
			this.timebox.style = "position: absolute;width: 30%;";
			this.timertext = document.createElement("h2");
			this.timertext.style =
				"margin: 0;color: #fff;font-size: 14px;font-weight: normal;text-align: center; font-family: 'Source Sans Pro', sans-serif;";
			this.timertext.innerText = "10:29";
			this.timebox.appendChild(this.timertext);

			this.signalbox = document.createElement("div");
			this.signalbox.style =
				"position: absolute; width: 26%; right: 0px;  color: rgb(255, 255, 255);display: flex;align-items: center;";
			this.signal = document.createElement("ion-icon");
			this.signal.setAttribute("name", "cellular");

			this.networkname = document.createElement("h2");
			this.networkname.style =
				"margin: 0px 5px 0px 3px; color: #fff;font-size: 11px;font-weight: normal;text-align: center; font-family: 'Source Sans Pro', sans-serif;";
			this.networkname.innerText = "01C";

			this.battery = document.createElement("ion-icon");
			this.battery.setAttribute("name", "battery-full");

			this.signalbox.appendChild(this.signal);
			this.signalbox.appendChild(this.networkname);
			this.signalbox.appendChild(this.battery);

			this.statusbar.appendChild(this.timebox);
			this.statusbar.appendChild(this.signalbox);
			this.wrap.appendChild(this.statusbar);

			this.topbarhandle = document.createElement("div");
			this.topbarhandle.style =
				"width: 45%; height: 30px; margin: -25px auto auto; background: rgb(0, 0, 0) none repeat scroll 0% 0%; border-radius: 0px 0px 20px 20px; position: absolute; left: 0px; right: 0px;z-index: 9000003;margin-top: -11px;";
			this.wrap.appendChild(this.topbarhandle);

			this.box = document.createElement("div");
			this.box.style =
				"position: absolute; width: 40%; left: 0px; right: 0px; margin: auto; height: 7px; top: 10px;";
			this.speaker = document.createElement("div");
			this.speaker.style =
				"height: 100%;width: calc(100% - 15px);border-radius: 7px;border: 1px solid #3b3b412b;background: #28282b78; float: left;";
			this.camera = document.createElement("div");
			this.camera.style =
				"width: 9px;height: 9px;border-radius: 9px;background: #28282b;float: right;";
			this.box.appendChild(this.speaker);
			this.box.appendChild(this.camera);
			this.topbarhandle.appendChild(this.box);

			this.borderframe = document.createElement("div");
			this.borderframe.style =
				"border: 2px solid #3b3b41; border-radius: 49px; padding-top: 0; background: rgb(19, 18, 18) none repeat scroll 0% 0%;position: absolute;left: 2.5px;top: 2.5px;right: 2.5px;bottom: 2.5px;padding: 0.5rem;";
			this.wrap.appendChild(this.borderframe);

			this.frame = document.createElement("iframe");
			this.frame.src = this.serverUrl + this.params;

			this.frame.allowfullscreen = true;
			this.frame.style =
				"width: 100%; height: calc(100%); border: medium none; border-radius: 35px; padding-top: 0; background: #000;";
			this.borderframe.appendChild(this.frame);

			this.bottombar = document.createElement("div");
			this.bottombar.style =
				"height: 4px; border-radius: 3px; width: 35%; margin: -20px auto auto; background: rgb(255, 255, 255) none repeat scroll 0% 0%; z-index: 900000; position: relative;position: absolute;bottom: 1.25rem;left: 0;right: 0;";
			this.wrap.appendChild(this.bottombar);

			this.loader = document.createElement("div");
			this.loader.style = "overflow: hidden; position: absolute; inset: 10px; background: rgb(25, 24, 24) none repeat scroll 0% 0%; border-radius: 40px; z-index: 900001";

			this.loader.innerHTML = `
				<div style="height: 50px;width: 60%;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;border-radius: 15px;font-family: 'Source Sans Pro', sans-serif;">
					<h3 style="color: #fff;text-align: center;font-size: 25px;margin: 0;line-height: 20px;">01 Call</h3>
					<p style="color: #6f6f70;font-size: 9.5px;text-align: center;margin: 0;">Your virtual phone</p>
					<div style="height: 3px;width: 100%;border-radius: 4px;background: black;margin-top: 10px;overflow: hidden;border: 1px solid #fff;">
						<div id="progress-loader" class="progress-loader" style="height: 100%; background: #fff; width: 0%;"></div>
					</div>
				</div>
			`


			this.wrap.appendChild(this.loader);

			this.overlapper = document.createElement("div");
			this.overlapper.style = "position: absolute;  background: black; border-radius: 40px; z-index: 10000000; inset: 0;";
			this.overlapper.innerHTML = `<div style="width: 100%;height: 100%;display: grid;align-items: center;justify-items: center;">
			<ion-icon role="img" class="md hydrated" aria-label="cellular" style="color: #fff;font-size: 25px;" name="keypad"></ion-icon>
			</div>`;
			this.wrap.appendChild(this.overlapper);

			this.notification = document.createElement("div");
			this.notification.innerHTML = `<div style="color: #fff;font-family: 'Source Sans Pro', sans-serif;font-size: 14px;position: absolute;top: 15px;right: 15px;background: red;z-index: 100000000;height: 20px;width: 20px;text-align: center;border-radius: 8px;">0</div>`;
			this.wrapMain.appendChild(this.notification);

			// EVENT HANDLERS
			this.wrapMain.addEventListener("click", () => {
				this.toggleHeight();
			});

			document["body"].appendChild(this.wrapMain);
			this.progress = this.loader.getElementsByClassName("progress-loader").item(0);
			this.progressPercent = 0;
			this.loading = setInterval(() => {
				this.progressPercent = this.progressPercent + 2;
				this.progress.style.width = this.progressPercent+"%";
			}, 1000);
			this.toggleHeight();

			window.addEventListener(
				"message",
				(evt) => {
					this.messageHandler(evt?.data);
				},
				false,
			);
		});
	}

	

	toggleHeight = () => {
		
		// Volume Bar
		if(this.openState){
				// OPEN

				this.wrapMain.style.top = this.dimensions.top(this.dimensions.height);
				// Wrapper Width
				this.wrapMain.style.width = this.dimensions.width;
				// Wrapper Height
				this.wrapMain.style.height = this.dimensions.height
				// Wrapper background
				this.wrapMain.style.background = this.dimensions.bg;
				this.wrap.style.borderRadius = "50px";
				this.notification.style.display = "none";

				
				setTimeout(() => {
					this.volume.style.display = "";
					this.volume1.style.display = "";
					this.volume2.style.display = "";
					this.volume3.style.display = "";
					this.statusbar.style.display = "";

					this.overlapper.style.opacity = 0;
					this.overlapper.style.zIndex = -1;
					this.wrap.style.overflow = "";
				}, 750);
			}else{
				// CLOSE

				this.wrapMain.style.top = this.dimensions.top();
				// Wrapper Width
				this.wrapMain.style.width = this.dimensions.defaultWidth;
				// Wrapper Height
				this.wrapMain.style.height = this.dimensions.defaultWidth;
				// Wrapper background
				this.wrapMain.style.background = "transparent";
				this.wrap.style.borderRadius = "15px";

				this.wrap.style.overflow = "hidden";
				this.overlapper.style.zIndex = 100000000;
				this.overlapper.style.opacity = 1;

				setTimeout(() => {
					this.volume.style.display = "none";
					this.volume1.style.display = "none";
					this.volume2.style.display = "none";
					this.volume3.style.display = "none";
					this.statusbar.style.display = "none";
					this.notification.style.display = "";
				}, 250);
			}


			this.openState = !this.openState;
	}

	messageHandler = (msg) => {
		switch (msg?.action) {
			case "load-completed":
				clearInterval(this.loading);
				this.progress.style.width = "100%";
				setTimeout(() => {
					this.loader.style.display = "none";
				}, 1000);
				break;
			case "notification-count":
				this.notification.getElementsByTagName("div").item(0).innerHTML = msg?.unread;
				break;
			case "change-height":
				this.toggleHeight();
				break;

			default:
				break;
		}
	};
}

function setUpView() {
	let scripts = document.getElementsByTagName("script");
	for (let i = 0; i < scripts.length; i++) {
		let item = scripts.item(i);
		let src = item.getAttribute("src");
		if (src.includes("initWebCall=true") && src.includes("clientId=")) {
			const clientId = new URLSearchParams(src).get("clientId");
			const kp = new WebCallClient();
			kp.init({ clientId });
			break;
		}
	}
}

setUpView();
