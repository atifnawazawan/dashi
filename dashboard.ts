import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController,MenuController  } from 'ionic-angular';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { ViewChild } from '@angular/core';
import { Slides,Content } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser ,InAppBrowserOptions} from '@ionic-native/in-app-browser';
import { ToastController } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';

import { Storage } from '@ionic/storage';
import * as App from '../../config/app';
import { RegisterPage } from '../register/register';
import { MultieventsPage } from '../multievents/multievents';
import {ProfilePage} from '../profile/profile';
import { Events } from 'ionic-angular';
import { concat } from 'rxjs/operator/concat';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { Crop } from '@ionic-native/crop';
  
import {DomSanitizer} from '@angular/platform-browser';

/**	
 * Generated class for the DashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

const GAME_TYPE_INPUT: string = "game_type_text_input";
const GAME_TYPE_RULE: string = "game_type_image_rule";


//@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
})

export class DashboardPage {
    
 @ViewChild('canvas') canvasRef;
 @ViewChild('downcanvas') downcanvasRef;
 @ViewChild('img1') imge1;
 @ViewChild('img2') mobileimg;
   @ViewChild(Content) content: Content;

	@ViewChild(Slides) slides: Slides;
	
    activityTitle: string;
    activities: Array<any>;
	sliderData;
	scrollheight='92vh';
	scrollmargin='0px';
    participantScore: number;
    userId: string;
	userName:string;
	docStatus:string;
	doc_require;
	is_zone;	
    userDrawId: String;
    hideScanScore: boolean;
    showCompleted: boolean;
    current_type: string;
    hasUserRedeem: boolean;
    activityListIndex: any;
	notificationListIndex:any
    activityViewScore: any;
    pollViewScreen: any;
	gameScreenIndex;
    hideViewScore: boolean;
	is_game_desc:boolean;
	
liveuser:any;
    dynamicText: string;
    checkinMsg: string;
    current_number_of_scan: any;
    current_scannedCount: any;	
	topBar='';
	is_Staff=0;
	draw_id;
	mobile_no;
	checkInScreen=false;
	checkInText='Check In';
	notif_seg='notifi';
	showquerymsg=false;
	checkInStatus;
	enableCheckIn;
	docReq;
	myDocument: any;
	
    constructor(private sanit:DomSanitizer,public menuController: MenuController, private base64ToGallery: Base64ToGallery,private transfer: FileTransfer, private file: File,private iab: InAppBrowser,public navCtrl: NavController, public profileService: ProfileServiceProvider, public navParams: NavParams ,private base64: Base64, public eventService: EventServiceProvider, public zbar: ZBar,
        public loadingCtrl: LoadingController,
		private crop: Crop,private socialSharing: SocialSharing,
		public toastCtrl: ToastController,public actionSheetCtrl: ActionSheetController,
		public alertCtrl: AlertController, private camera: Camera, public storage: Storage, 
		public events: Events, private apiProvider: ApiServiceProvider) {

		this.pagerOption=true;
			storage.get(App.STORAGE_APP_USER).then((val) => {
			console.log(val);
			this.draw_id=val.draw_id;
			this.userName=val.name;
			this.mobile_no=val.mobile_number;
			if(val.is_staff==1){
				this.is_Staff=1;
			}

        	});
			this.docform={};
			
			
        console.log(sanit);
		this.photoalbumconfig=[];
this.events.subscribe('notifications:received',(count)=>{

                    this.badgecount=count;
                });
				this.events.subscribe('queue_no:received',(num)=>{

                    this.cur_que_no=num;
                });

this.events.subscribe('notifications:data',(data)=>{
					this.notif_seg='notifi';
					this.showquerymsg=false;
                  //  this.badgecount=count;
				  	                                  
let currentdate = new Date(); 
let date2 = currentdate.getFullYear() + "-"
                + ("0" + (currentdate.getMonth() + 1)).slice(-2)  + "-" 
                + ("0" + currentdate.getDate()).slice(-2) + "  "  
                + ("0" + currentdate.getHours()).slice(-2) + ":"  
                + ("0" + currentdate.getMinutes()).slice(-2) + ":" 
                + ("0" + currentdate.getSeconds()).slice(-2);
this.sliderData.notifications.messages.unshift({created_at:date2,message:data});
				  			  
                });				
this.events.subscribe('query:data',(data)=>{

                  //  this.badgecount=count;
				  this.notif_seg='helpdesk';
			  this.showquerymsg=true;
	

let currentdate = new Date(); 
let date2 = currentdate.getFullYear() + "-"
                + ("0" + (currentdate.getMonth() + 1)).slice(-2)  + "-" 
                + ("0" + currentdate.getDate()).slice(-2) + "  "  
                + ("0" + currentdate.getHours()).slice(-2) + ":"  
                + ("0" + currentdate.getMinutes()).slice(-2) + ":" 
                + ("0" + currentdate.getSeconds()).slice(-2);
this.sliderData.notifications.queries.push({updated_at:date2,reply:data});
				  this.callFunction2();			  			  
                });				

	this.events.subscribe('tabs:clicked',(name)=>{
		
		this.tabscreen(name);
		
	});
	
	this.events.subscribe('redeem_Page',(data)=>{
		
		if(data==12){
			this.showRedeemscreen();
		}
		
	});
	
this.events.subscribe('topbar:clicked',(name)=>{
		
		this.topbargo(name);
		
	});
			
		this.hideScanScore = true;
        this.participantScore = 0;
        this.showCompleted = false;
        this.current_type = '';
		this.is_game_desc=false;

        this.hasUserRedeem = false;
        this.hideViewScore = true;
      //  this.loadLiveEventDetail();
        this.loadParticipantScore();
		this.getAlbum();
        this.current_number_of_scan = 0;
        this.current_scannedCount = 0;
		storage.get(App.STORAGE_APP_EVENT_ID).then((val) => {
		this.id_event=val;
        storage.get('STORAGE_APP_HAS_REDEEM'+this.id_event)
            .then((val) => {
				if(val){
                this.hasUserRedeem = val;
				}
            });
		storage.get('survey_'+val).then((valu)=>{
			if(valu){
				this.survey_submitted=true;
			}
		});
			
			});
		storage.get(App.STORAGE_APP_CURRENT_EVENT).then((val) => {
            if (val.font_color  != undefined && val.font_color  != '' && val.font_color  != 'null') {
                this.appFontColor = val.font_color ;
					
            }
            else {
                this.appFontColor = 'white';
				
			
            }
			console.log(this.appFontColor);
        });
		
		storage.get(App.STORAGE_APP_CURRENT_EVENT).then((val) => {
            if (val.menu_color != undefined && val.menu_color != '' && val.menu_color != 'null') {
                this.appmenuFontColor = val.menu_color;
				
            }
            else {
                this.appmenuFontColor = 'white';
				
			
            }
			console.log(this.appmenuFontColor);
        });
			if(navParams.data.tabicons!=undefined){

		//	this.appIcons=navParams.data.tabicons;
			}
			else{
				
				storage.get(App.STORAGE_APP_MENU).then((val) => {
			//this.appIcons=val;

        	});
			}
            console.log(navParams.data);
       // this.setupAppDynamicText();
		//this.videourl()
    }
	
	todoicon:any;
	appIcons:any;
	activityBanners:any;
    appFontColor:string;
	appmenuFontColor:string;
badgecount=0;
sliderHeight='calc(90%-52px)';
id_event;
videurl;
videourl(url){
	   return this.sanit.bypassSecurityTrustResourceUrl(url);

}
notificationslide:string;
    ngOnInit() {
        this.storage.get("nav")
            .then((val) => {
                if(val=="slide2") {
                    this.storage.remove('nav');
                    this.showActivitesList();
                }
				if(val=="notifications_view") {
                    this.storage.remove('nav');
                    this.showNotificationsList();
                }

				if(val=="redeem_view") {
                    this.storage.remove('nav');
					
        setTimeout(() => {
                               this.showRedeemscreen();
        }, 2750);


                }
                if (val == "score_view"){
                    this.storage.remove('nav');
                    this.showActivityViewScore();
                    this.hideViewScore = false;
                }
						

            });
					
    }

	    toastShow(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
        });

        toast.present();
    } 
addDocument(){
		let actionSheet = this.actionSheetCtrl.create({
            title: 'Choose source',
            buttons: [
            {
                text: 'Use camera',
                handler: () => {
                    this.takeDocument();
					
                }
            },
            {
                text: 'Use album',
                handler: () => {
                    this.selectDocument();
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
            ]
        });

        actionSheet.present();
    }
	takeDocument() {
            const options: CameraOptions = {
                quality: 100,
                destinationType: this.camera.DestinationType.FILE_URI,
                sourceType: this.camera.PictureSourceType.CAMERA,
            }
            this.camera.getPicture(options).then(imageData => {
               this.myDocument = /* 'data:image/jpeg;base64,' +  */imageData;
				this.uploadDoc();
                //this.uploadPhoto(this.myPhoto);
//                this.storage.set(App.STORAGE_APP_USER_PHOTO, this.myPhoto);
  //              this.storage.set('STORAGE_APP_USER_PHOTO'+this.id_event, this.myPhoto);
            }, error => {
                // this.error = JSON.stringify(error);
                this.toastShow(JSON.stringify(error));
            });
    }
	selectDocument(): void {
             this.camera.getPicture({
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: this.camera.DestinationType.FILE_URI,
                quality: 100,
                encodingType: this.camera.EncodingType.PNG,
            }).then(imageData => {
              this.myDocument = /* 'data:image/jpeg;base64,' +  */imageData;
				this.uploadDoc();
               // this.uploadPhoto(this.myPhoto);
                 }, error => {
                // this.error = JSON.stringify(error);
                this.toastShow(JSON.stringify(error));
            }); 
                //this.uploadPhoto(this.testPhoto);
    }
	uploadDoc() {
        
		let filePath = this.myDocument;
		//let filePath = this.testPhoto;

		this.base64.encodeFile(filePath).then((base64File: string) => {
			
  let str=base64File;
  this.docform.doc=str.substr(str.indexOf(",") + 1);
  this.DocUpload();
  });
	
        
	}
	is_checkedIn=0;
	docform:any;
	DocUpload(){
		let loading = this.loadingCtrl.create({
            content: 'Uploading. Please wait...'
        });
        loading.present();
        this.profileService.uploadDoc(this.docform).then((data:any) => {
            loading.dismiss();
			if(data.success){
			this.toastShow("Document uploaded");
			this.thx_msg=data.thx_msg;
			}
			else
			{
				this.toastShow("Please try again");
			}
            
        });
	}
    addPhoto() {
		//this.mobimg='https://ppc.land/wp-content/uploads/2016/12/google.jpg';
		//this.mobimg='assets/images/main-bg.png';
	/*	let toappend={
			'image_url':this.myPhoto,
			'isLiked':true,
			'isShareable':false,
			'isShared':false
		}
		this.photoalbum.unshift(toappend);*/
		console.log(this.photoalbum);
        let actionSheet = this.actionSheetCtrl.create({
            title: "Choose source",
            buttons: [
            {
                text: 'Use camera',
                handler: () => {
                    this.takePhoto();
                }
            },
            {
                text: 'Use album',
                handler: () => {
                    this.selectPhoto();
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
            ]
        });

        actionSheet.present();
    
	}
sharetoalbum(){
	 let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading.present();

	let filePath = this.myPhoto;
//	let filePath = this.image;
//	this.base64.encodeFile(filePath).then((base64File: string) => {
  //let str=base64File;
  let imgtoupload=filePath.substr(filePath.indexOf(",") + 1);
   
        
	let data1={image:imgtoupload};
        this.profileService.sharetoalbum(data1).then(dta => {
			this.toastShow(dta['message']);
			this.selectedPhoto=false;
			this.photoalbumRefresh();
		loading.dismiss();
		},
		err=>{
			loading.dismiss();
		}
		);
        
		
}
photoalbumRefresh(){
	this.appendimages=1;
	 this.eventService.getPhotoAlbum().then((data: any) => {
                                if (data.success) {
                                   console.log(data.content);
								   this.photoalbum=data.content;
								
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
}
enlarge(id){
	
	let imgid='album-'+id;
	let barid='albumbar-'+id;
	if(document.getElementById(imgid).getAttribute("col-4")===null){
		
document.getElementById(imgid).removeAttribute("col-12");
document.getElementById(imgid).setAttribute("col-4","");
document.getElementById(imgid).children[0]['style']['height']="";
document.getElementById(barid).style.display="none";
	}
	else{
document.getElementById(imgid).removeAttribute("col-4");
document.getElementById(imgid).setAttribute("col-12","");
document.getElementById(imgid).children[0]['style']['height']="";
document.getElementById(barid).style.display="";

	}
	console.log(document.getElementById(imgid));
	
}
photolike(id,index){
	 let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading.present();
 
	let data1={photo_id:id};
        this.profileService.photolike(data1).then(dta => {
			console.log(this.photoalbum);
			this.photoalbum[index]['total_likes']++;
			this.photoalbum[index]['isLiked']=true;
			this.toastShow(dta['message']);
		loading.dismiss();
		},
		err=>{
			this.toastShow('please try again');
			loading.dismiss();
		}
		);
        
}

photoprint(id,index,isshareable){
	
	if(this.photoalbumconfig.unlimited_print==0 && this.photos_selected_for_print>=this.photoalbumconfig.no_of_print){
		this.toastShow('Sorry, you have reached the maximum allowed quota for print.');
	}
	else if(!isshareable){
		this.toastShow('Sorry, you are not allowed to print this photo.');
	}
	else{
		console.log(index);
 let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading.present();
 
	let data1={photo_id:id};
        this.profileService.photoprint(data1).then(dta => {
			console.log(this.photoalbum);
			this.photoalbum[index]['print_photo']=true;
			this.photos_selected_for_print++;
		this.showAlertMessage(dta['message']);
		loading.dismiss();
		},
		err=>{
			this.toastShow('please try again');
			loading.dismiss();
		}
		);
		//this.toastShow('Ok printing');
	}
}

photoSocialshare(){
	
	  let actionSheet = this.actionSheetCtrl.create({
            title: 'Choose source',
            buttons: [
            {
                text: 'Facebook',
                handler: () => {
	
this.socialSharing.shareViaFacebook('',this.myPhoto,null).then((_) => {
//this.toastShow(_);

}).catch((_) => {
    this.toastShow('Can\'t share using Facebook');// Error!
});
                }
            },
            {
                text: 'twitter',
                handler: () => {


this.socialSharing.shareViaTwitter(this.socialmsg, this.myPhoto).then((_) => {

}).catch(() => {
    this.toastShow('Can\'t share using Twitter');// Error!
});
	                }
            },
            {
                text: 'Instagram',
                handler: () => {
this.socialSharing.shareViaInstagram(this.socialmsg,this.myPhoto).then((_) => {

}).catch((_) => {
    this.toastShow('Can\'t share using Instagram');// Error!
});
	                }
            },
            {
                text: 'Whatsapp',
                handler: () => {
this.socialSharing.shareViaWhatsApp(this.socialmsg,this.myPhoto).then((_) => {

}).catch((_) => {
    this.toastShow('Can\'t share using Whatsapp');// Error!
});
	                }
            },
            {
                text: 'Email',
                handler: () => {
	// Share via email
this.socialSharing.shareViaEmail(this.socialmsg,'',[''],[''],[''],this.myPhoto).then(() => {

 // Success!
}).catch(() => {
	    this.toastShow('Can\'t share using Mail');// Error!

  // Error!
});
	                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
            ]
        });

        actionSheet.present();
		
	
}

photoshare(id,url,isshareable){
	
	if(!isshareable){
		this.toastShow('Sorry, you are not allowed to share this photo.');
	}
	else{

	  let actionSheet = this.actionSheetCtrl.create({
            title: 'Choose source',
            buttons: [
            {
                text: 'Facebook',
                handler: () => {
	
this.socialSharing.shareViaFacebook('',url,null).then((_) => {
//this.toastShow(_);
this.uploadsocialsharestatus(id);
}).catch((_) => {
    this.toastShow('Can\'t share using Facebook');// Error!
});
                }
            },
            {
                text: 'twitter',
                handler: () => {


this.socialSharing.shareViaTwitter(this.socialmsg, url).then((_) => {
this.uploadsocialsharestatus(id);
}).catch(() => {
    this.toastShow('Can\'t share using Twitter');// Error!
});
	                }
            },
            {
                text: 'Instagram',
                handler: () => {
this.socialSharing.shareViaInstagram(this.socialmsg,url).then((_) => {
this.uploadsocialsharestatus(id);
}).catch((_) => {
    this.toastShow('Can\'t share using Instagram');// Error!
});
	                }
            },
            {
                text: 'Whatsapp',
                handler: () => {
this.socialSharing.shareViaWhatsApp(this.socialmsg,url).then((_) => {
this.uploadsocialsharestatus(id);
}).catch((_) => {
    this.toastShow('Can\'t share using Whatsapp');// Error!
});
	                }
            },
            {
                text: 'Email',
                handler: () => {
	// Share via email
this.socialSharing.shareViaEmail(this.socialmsg,'',[''],[''],[''],url).then(() => {
this.uploadsocialsharestatus(id);
 // Success!
}).catch(() => {
	    this.toastShow('Can\'t share using Mail');// Error!

  // Error!
});
	                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
            ]
        });

        actionSheet.present();
		
	}
}
    takePhoto() {
		let optionscrop = {
          quality: 100,
          widthRatio:4,
          heightRatio:6,          
          targetWidth:1600,
          targetHeight:2400
};
		this.myPhoto_isset=true;
            const options: CameraOptions = {
                quality: 100,
//                destinationType: this.camera.DestinationType.DATA_URL ,
                destinationType: this.camera.DestinationType.FILE_URI,
                sourceType: this.camera.PictureSourceType.CAMERA,
				correctOrientation:true,
			//	allowEdit:true
			//	targetWidth:1000,
				//targetHeight:1000
				
            }
            this.camera.getPicture(options).then(imageData => {
               // this.mobimg =  'data:image/jpeg;base64,' +  imageData;
				//this.mobimg=imageData;
				this.crop.crop(imageData, optionscrop)
  .then(
    newImage => {
		this.mobimg=newImage;
						this.selectedPhoto=true;

	//alert('new image path is: ' + JSON.stringify(newImage))
	},
    error => {
                // this.error = JSON.stringify(error);
                this.toastShow(JSON.stringify(error));
            }
  );
              //  this.image = /* 'data:image/jpeg;base64,' +  */imageData;
		//	this.setphoto();
                //this.uploadPhoto(this.myPhoto);
              //  this.storage.set(App.STORAGE_APP_USER_PHOTO, this.myPhoto);
                //this.storage.set('STORAGE_APP_USER_PHOTO'+this.id_event, this.myPhoto);
				
            }, error => {
                // this.error = JSON.stringify(error);
                this.toastShow(JSON.stringify(error));
            });
    }

	
	selectPhoto(): void {
//    this.images= 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAUNSURBVHjarJZdSBxXGIbfmdmZXbM/cZOssmHjH3HLuoRY1nVtMSokF4n5IbkoaS1IetFKITepYqFQcpO7tjRtIaWlvagpvRFMf8BALowhQpoEtGDiBiWWsFlc0erozu64szPn60U7YaM72zXNB+di5nznfc55zzfnDNff3w8AsNvtWFpaQiKRAGMM8/Pz2L17NyRJwvLyMhwOxwlZljvS6XTQ6XS+trCwUGEYBgKBgKFp2u8cx8243e4Jj8dzTVEU6LoOu92OhoYGZLNZNDY2IhAIQFVVAIANRYKIUFFRAUEQ+FQq9VEymXwrm802mf3Ly8vPcp88eQIAR/9tHzidzj89Hs+Q0+n8ZMeOHRlYxHNgxhhsNhvcbjfi8fiJRCLxpSzL9WY/x3EoFUSETCZTn8lkLkqS9D5jrD8YDP6Yz+fBGLMG2+12AMDjx48/ffr0aX+5wGJ5mqZVzc/PX3U6nYf37dv3jsPhABGBiAAAPBGBMQZBEOD1ejE1NfXN5ORkvylULtRqEtPT0+fu3bv3W2VlJXieh67rMAwDQjQaBQA4HA6Mjo5emp2dvbCdVZYDz2azQVmWa3t6en4JBALw+XwQOjo6UFNTgwcPHhy+cePGdy8DatpZ6Nji4uKrHMclGGNTDx8+hBAKhZBKpTAyMjKpaZrjZUDr6uogy/IW+PT09FHG2Bf5fF7jRVFEPB4fVBSl8mVAo9Eo5ubmMDw8vGX1AOyGYVyKRCLAkSNHIEnSAgDiOO6FGgACQC0tLaTrOplx5coVstlsm/PywWAQOHXq1FHzpZVgOeDW1tbnoGYMDAw80zD1mpqaehAOhz+3EjcTS8EB0MGDB4kxtgV6+/Ztqq+vf248AKqurh5GbW3tqNVq29raaGhoqCi80F5FUbZAb926ZTnO4/H8gcbGxtVinfv376e1tTUiIhofH98iUsremzdvWjoFgHw+XxqSJG1sFuzs7CwpBoBisVhRe0tBTX2bzZaBJEnaZvCxY8eoWIyNjREAqqurI8Mwyra3KNjv9y8Ws7qlpcUSnkwmixZSOV8BAPJ6vWmIojhiVc2dnZ1F93Bz3L17l3iep3LPAlEUp9DU1PRVqf2IRqMl4ePj4yQIQtlQAOT3+3/FyZMnT5eqQAAUiUQon89b7vl2oACou7v7XYRCIQBY+K+C2HwcbhdaCD5w4ICA8+fPo729/WI5RRGNRomIKB6PbxtqasRise8HBwfBy7IMr9d7CcC6eZNYxf3799Ha2or29nZs9942td1u94epVArC3r17sWvXLnK5XI8SicSbVoLmvZpMJqGq6gtBjx8/fiESiYyl02nYurq6IAgCDh069DPP899OTEy8R0SWwtu9s01oOBy+3tfXd5kxho2NDdj8fj8YY/D5fOjt7e2bmZmpWllZOV0Kvl3onj177pw9e7Z7bm4Oq6ur4HkevKZp0HUd6+vrWFlZQSwWOxMOh68WDvw/ULfb/VMoFHpd0zTkcjkIggCO48AXWqiqKkRRRHNzc29VVdU5SZJWzH/hcidRkJtra2sbaG5ufluWZeRyOfA8/6xW+MJBPM9D0zSsra1h586dP7zyT1wWRfEvjuOweRKFz2aTJEn2+XxfOxyOxurq6s8AQNf1Ldtms5q5qqpwuVzLNTU1FxRF+Zjn+TMNDQ1vGIbRNTs7i6WlJYiiCLvdniOipMvlesQYu05E1/x+/7qiKFBVFYZhFK2VvwcADLdjH0wVaB4AAAAASUVORK5CYII=';
	
		let optionscrop = {
          quality: 100,
          widthRatio:4,
          heightRatio:6,          
          targetWidth:1600,
          targetHeight:2400
};

this.myPhoto_isset=true;
             this.camera.getPicture({
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
               // destinationType: this.camera.DestinationType.DATA_URL ,
                destinationType: this.camera.DestinationType.FILE_URI,
                quality: 100,
				//allowEdit:true

			//	encodingType:1
				}).then(imageData => {
					//this.mobimg='data:image/jpeg;base64,'+imageData;
	
				this.crop.crop(imageData,optionscrop)
  .then(
    newImage => {
						this.selectedPhoto=true;

		this.mobimg=newImage;
	//alert('new image path is: ' + JSON.stringify(newImage))
	},
    error => {
                // this.error = JSON.stringify(error);
                this.toastShow(JSON.stringify(error));
            }
  );
			//this.setphoto();
			
            }, error => {
                // this.error = JSON.stringify(error);
                this.toastShow(JSON.stringify(error));
            }); 
               
			   //this.uploadPhoto(this.testPhoto);
    }

myPhoto;
//frameimage;
frameimage='assets/images/frame-footer.png';
//frameimage='assets/images/my-event-frame.png';
//mobfoto='assets/images/noimg.png';
mobfoto='assets/images/main-bg.png';


image;
images;
photoalbum;
photoalbumconfig;
photos_selected_for_print;
contxt;
myimg;
showalbum=false;
 ngAfterViewInit() {
	 this.image='assets/images/noimg.png';
	 this.images='assets/images/noimg.png';
 //this.setphoto();
 }
 
 getAlbum(){
	 if(!this.photoalbum){
	 this.eventService.getPhotoAlbum().then((data: any) => {
                                if (data.success) {
                                   console.log(data.content);
								   this.photoalbum=data.content;
								   this.photoalbumconfig=data.config;
								   this.photos_selected_for_print=data.tot_select;
								   console.log(this.photoalbumconfig);
								   this.showalbum=true;
								  this.loadLiveEventDetail();
                                }
                                else {
								 this.loadLiveEventDetail();

									console.log(data);
								  }
                            })
                            .catch(error => {
                                console.log(error);
                            });
 }
 else{this.showalbum=true;
 
	 this.eventService.getPhotoAlbum().then((data: any) => {
                                if (data.success) {
                                   console.log(data.content);
								   if(data.content.length!=this.photoalbum.length){
								   this.photoalbum=data.content;
								   console.log(this.photoalbum.length);
								   }
                                }
                                else {
								
									console.log(data);
                                    //this.showAlertMessage(data.message);
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });}
 }
 setphoto(){
	 alert(this.frameimage);
	this.images=this.frameimage; 
	this.makecanvas();
    let source = new Image(); 
	//let source = this.mobileimg.nativeElement;
	source.src=this.frameimage;
	 let canvas = this.canvasRef.nativeElement;
    let context = canvas.getContext('2d');

  //      canvas.width = 880;
	//  canvas.height = 1295;
    source.crossOrigin = 'Anonymous';
    source.onload = () => {
	//alert('image loaded');
     		 

		canvas.height = source.height;
        canvas.width = source.width;
 context.drawImage(this.mobileimg.nativeElement,67,92,750,1000);
//	       context.drawImage(source.nativeElement,0,0,880,1295);

	//context.drawImage(this.imge1.nativeElement,0,0,wid,600);
//  alert(this.imge1.nativeElement);      //context.font = "50px impact";
		
      //  context.textAlign = 'center';
    //    context.fillStyle = 'red';
       // context.fillText('HELLO WORLD', canvas.width / 2, canvas.height * 0.9);
	//context.fillRect(0,0,10,20);
		
        this.images = canvas.toDataURL();	
		
this.toastShow('successful loading');// Error! 
this.myPhoto=this.images; 
		
      //this.makecanvas();	
		//this.dummyimage=this.image;
    };
   // source.src = this.images;
//this.images = source.src;	
	//alert(source.src);
  } 
  allnotification=false;
  setallnotification(){
let loader = this.loadingCtrl.create({spinner:"dots"});
    	loader.present().then(done=>{

    		//usually a call the the api, setTimeout to replicate.
    		setTimeout(()=>{
    			loader.dismiss();
				this.allnotification=true;

    		},720)
    	})	
	  
  }
  pagerOption:boolean;
  appendimages=0;
  loadmoreimages(){
	  if(this.photoalbum){
	  if(this.photoalbum.length<this.appendimages){
		  this.toastShow('All images are loaded!');
	  }
	  else{
		  	  this.appendimages+=18;
	  }
	  }
	  else{
		  		  this.toastShow('No Images are there!');

	  }
  }
  framesurl;
  defaultframe;
  changeframe(frameurl){
	 	  this.frameimage=frameurl;
  }
   showRadio() {
   	
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Frame!');
		
 alert.addInput({
      type: 'radio',
      label: 'Frame 1',
      value: this.defaultframe,
    });
	let i=2;
this.framesurl.forEach((framed:any)=>{
	
 alert.addInput({
      type: 'radio',
      label: 'Frame '+i,
      value: framed.frame_url,
    });
		i++;
		});


    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
		  console.log(data);
		  if(data!=undefined){
		  this.frameimage=data;
		  
		  }
		  console.log(this.frameimage);
      }
    });
    alert.present();
  }
  homeicon='assets/images/homeicon.png';
  notificationicon='assets/images/notificationicon.png';
  
  printed=false;
  makecanvas(){
	//  alert(this.mobileimg.nativeElement);
	console.log(this.imge1);
	  let canvas = this.canvasRef.nativeElement;
    let context = canvas.getContext('2d');
        canvas.width = 800;
	  canvas.height = 1200;
 context.drawImage(this.mobileimg.nativeElement,0,0,800,1200);
	       context.drawImage(this.imge1.nativeElement,0,0,800,1200);
		 
this.images = canvas.toDataURL();	
	/*	let toast = this.toastCtrl.create({
            message: 'successful loading',
            duration: 100,
            position: 'top'
        });

     //   toast.present();
	 */
	 
let loader = this.loadingCtrl.create({spinner:"dots"});
    	loader.present().then(done=>{

    		//usually a call the the api, setTimeout to replicate.
    		setTimeout(()=>{
    			loader.dismiss();
    		},100)
    	})
		
		this.myPhoto=this.images; 

}
SurveyInputChange(value, id){
	
				let data={question_id:id,answer:value,type:3};

//this.buildSurveyForm(id,data)		
		
if(value!=''){
		this.buildSurveyForm(id,data);
	//this.surveyform[key] = choiceid;
	}
	else{
		let ty=this.surveyform.some(function(el) {
    return el.question_id === id;
	
  }); 
  console.log(ty);
  if(ty){
		let indx=this.surveyform.findIndex(function(el) {
    return el.question_id === id;
  }); 
		this.surveyform.splice(indx,1);
	}
	}
	
}
buildSurveyForm(id,data){
//type1-->comments
//type2-->multiplechoices
//type3-->subjective
//type4-->others
		let ty=this.surveyform.some(function(el) {
    return el.question_id === id;
	
  }); 
  console.log(ty);
  if(ty){
	  let indx=this.surveyform.findIndex(function(el) {
    return el.question_id === id;
  }); 
  console.log(indx);
  this.surveyform[indx]=data;
  }
  else{
  	this.surveyform.push(data);
  }

		console.log(this.surveyform);
}
pollcomment=[];
PollInputChangeComment(value, id){
	if(value==''){
			this.pollcomment=[];

	}
	else{
	let data={banner_id:id,comment:value};
	this.pollcomment=[];
	this.pollcomment.push(data);
	console.log(this.pollcomment);
	}
}
commentrating(index,id,data){
	
let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();	
			
let ans_val={};
				ans_val['data']=data;
				ans_val['comment_id']=id;
				this.eventService.submit_poll_comment_rating(ans_val).then((data: any) => {
				console.log(data);
				if(data.success==true){
							 this.showAlertMessage(data.message);
						  let currentIndex = this.slides.getActiveIndex();
						  							 if(data.likes!=undefined){

				this.activities[currentIndex].pollcomments[index].likes=data.likes;
													 }
else{
					this.activities[currentIndex].pollcomments[index].dislikes=data.dislikes;

}													 
			
				}
				else{
			 this.showAlertMessage(data.message);
				}
			  
	loading.dismiss();
	
	 
})
.catch(error=>{
                    loading.dismiss();
                    console.log(error);
		 this.showAlertMessage("Error Pls try again ");
        });
}
submitPollComment(id){
let	idval='comment-'+id;
	console.log(idval)
	//console.log(document.getElementById(idval));
	let comId=(<HTMLInputElement>document.getElementById(idval));
		console.log(this.pollcomment);

let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();	
			
let ans_val={};
				ans_val['data']=this.pollcomment;
				this.eventService.submit_poll_comment(ans_val).then((data: any) => {
				console.log(data);
				if(data.success==true){
							 this.showAlertMessage(data.message);
					comId.value='';		  
				
				}
				else{
			 this.showAlertMessage(data.message);
				}
			  
	loading.dismiss();
	
	 
})
.catch(error=>{
                    loading.dismiss();
                    console.log(error);
		 this.showAlertMessage("Error Pls try again ");
        });
		
}
SurveyInputChangeComment(value, id){
	let commentid='comment_'+id;
	let data={question_id:commentid,answer:value,type:1};
	//this.buildSurveyForm(commentid,data);
		//	let data={question_id:id,answer:value,type:3};

//this.buildSurveyForm(id,data)		
		
if(value!=''){
		this.buildSurveyForm(commentid,data);
	//this.surveyform[key] = choiceid;
	}
	else{
		let ty=this.surveyform.some(function(el) {
    return el.question_id === commentid;
	
  }); 
  console.log(ty);
  if(ty){
		let indx=this.surveyform.findIndex(function(el) {
    return el.question_id === commentid;
  }); 
		this.surveyform.splice(indx,1);;
	}
	}
	
	
	
	
	
	
}

surveyform=[];
pakis=[];
	//console.log(requiredQuestions);
	polloptions=[];
	polldata(id){
		
let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();	
			
let ans_val={};
				ans_val['banner_id']=id;
				ans_val['options']=this.polloptions;
				this.eventService.submit_poll(ans_val).then((data: any) => {
				console.log(data);
				if(data.success==true){
					  let currentIndex = this.slides.getActiveIndex();
				this.activities[currentIndex].polloptions=data.options;
				this.activities[currentIndex].is_voted=true;
				
				}
				else{
			 this.showAlertMessage(data.message);
				}
			  
	loading.dismiss();
	
	 
})
.catch(error=>{
                    loading.dismiss();
                    console.log(error);
		 this.showAlertMessage("Error Pls try again ");
        });
           

	
	
	}
	onSubmitSurvey(SurveyId){
		console.log(this.surveyQuestions);
//	console.log(this.surveyQuestions);
	console.log(this.surveyform);
	let indx=this.surveyQuestions.findIndex(function(el) {
    return el.survey.surveyId === SurveyId;
  });
	let questions=this.surveyQuestions[indx].survey.questions;
	let requiredQuestions=[];
		let chkin;
let loopchk=0;
	questions.forEach((question: any) => {
                chkin=0;
				if(loopchk==1){
					return;
				}
				if (question.required == 1) {
					console.log(question);
					this.surveyform.forEach((answer:any)=>{
						console.log(answer);
						if(answer.type==2){
							console.log('ans2',answer.question_id);
							let answer_id=answer.question_id.split("-")[0];
						if(question.id==answer_id){
							chkin=1;
						}						}
						if(question.id==answer.question_id){
							chkin=1;
						}
						
					});
					
					if(chkin==0){
						let msg=question.question+' field is required';
					this.showAlertMessage(msg);
					loopchk=1;
					}
                }
	});
	if(loopchk==0){
this.submitLive(SurveyId,indx);
	}
	}
submitLive(surveyId,indx){
	//console.log(surveyId);
	
let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();	
let ans_val={};
				ans_val['data']=this.surveyform;
				ans_val['SurveyId']=surveyId;
				this.eventService.submit_survey(ans_val).then((data: any) => {
				console.log(data);
			  
	loading.dismiss();
	if(data.success==true){
		this.surveyQuestions[indx].survey.submission=true;
		//this.loadLiveEventDetail();
		//this.showAlertMessage(data.message);	
		
		this.surveyform=[];
	}
	else{
	this.showAlertMessage('Not sure!');	
	}
	 
})
.catch(error=>{
                    loading.dismiss();
                    console.log(error);
		 this.showAlertMessage("Error Pls try again ");
        });
           

	
	
}
survey_submitted=false;
surveysingleother(questionid,choiceid,val){
	let data={question_id:questionid,answer:choiceid,type:4,value:val};
	this.buildSurveyForm(questionid,data);

}
surveysingle(questionid,choiceid,val){
	if(val=='others'){
		console.log('its others');
		let ty=this.surveyform.some(function(el) {
    return el.question_id === questionid;
	
  }); 
  if(ty){
		let indx=this.surveyform.findIndex(function(el) {
    return el.question_id === questionid;
  }); 
		  console.log(this.surveyform[indx].type);
if(this.surveyform[indx].type!= undefined){
	console.log('i am others previous');
}
else{
		this.surveyform.splice(indx,1);
}
	}
	  console.log(this.surveyform);

	}
	else{
	let data={question_id:questionid,answer:choiceid};
	this.buildSurveyForm(questionid,data);
	}
}
pollradiodata(){
			
let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();	
			
			let ans_val={};
				ans_val['banner_id']=null;
				ans_val['options']=this.pollsingle;
				this.eventService.submit_poll(ans_val).then((data: any) => {
				console.log(data);
			  if(data.success==true){
				  console.log(data);
				  let currentIndex = this.slides.getActiveIndex();
				this.activities[currentIndex].polloptions=data.options;
				this.activities[currentIndex].is_voted=true;
				}
				else{
			 this.showAlertMessage(data.message);
				}
	loading.dismiss();
	
	 
})
.catch(error=>{
                    loading.dismiss();
                    console.log(error);
		 this.showAlertMessage("Error Pls try again ");
        });
           


}
pollsingle=[];
pollradio(val){
	this.pollsingle=[];
		let data={banner_id:val.banner_id,poll_id:val.id};
	this.pollsingle.push(data);
}
pollcheckbox(val,state){  
		let data={banner_id:val.banner_id,poll_id:val.id};
		if(state){
				let ty=this.polloptions.some(function(el) {
    return el.poll_id === val.id;
	
  }); 
  console.log(ty);
  if(ty){
	  let indx=this.polloptions.findIndex(function(el) {
    return el.poll_id === val.id;
  }); 
  console.log(indx);
  this.polloptions[indx]=data;
  }
  else{
  	this.polloptions.push(data);
  }

		}
		else{
		let indx=this.polloptions.findIndex(function(el) {
			return el.poll_id === val.id;
		}); 
		this.polloptions.splice(indx,1);
	}

		//this.polloptions[id]=val;
		console.log(this.polloptions);

}
segmentchange(dat){
let segId='customSegment_'+dat;
console.log(segId);
//	document.getElementById(segId).style.backgroundColor ="red";

	
}
surveycheckbox(questionid,choiceid,state){
	
	console.log(questionid,choiceid,state);
			let id=questionid+'-'+choiceid;
let data={question_id:id,answer:choiceid,type:2}
	if(state){
		this.buildSurveyForm(id,data);
	//this.surveyform[key] = choiceid;
	}
	else{
		let indx=this.surveyform.findIndex(function(el) {
    return el.question_id === id;
  }); 
		this.surveyform.splice(indx,1);
	}

}
stars(id,bannerId) {
	console.log(id,'bannerid',bannerId);
	this.ratings=0;
   let alert = this.alertCtrl.create();
    alert.setTitle('Select Rating!');

    alert.addInput({
      type: 'radio',
      label: '1 star',
      value: '1',
    });
	alert.addInput({
      type: 'radio',
      label: '2 stars',
      value: '2',
    });
	alert.addInput({
      type: 'radio',
      label: '3 stars',
      value: '3',
    });
	alert.addInput({
      type: 'radio',
      label: '4 stars',
      value: '4',
    });
	alert.addInput({
      type: 'radio',
      label: '5 stars',
      value: '5',
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
       // this.testRadioOpen = false;
       // this.testRadioResult = data;
	  
	   this.ratings=data;
	    if(this.ratings>0){
	 
	   this.createStarRange(id,bannerId);
	   let val={question_id:id,answer:data};
		this.buildSurveyForm(id,val)		
      }
	  }
    });
    alert.present();
  }
  ratings; 
  nonfill=true;
  fills:object={};
  nonfills=[1,2,3,4,5];
  unfills:object={};
  createStarRange(id,SurveyId){
	  
	  console.log(id,this.surveyQuestions);
	  let indx=this.surveyQuestions.findIndex(function(el) {
    return el.survey.surveyId === SurveyId;
  });
  let questions=[];
  let lambai=this.surveyQuestions.length;
  for(let k=0;k<lambai;k++){
	 questions=this.surveyQuestions[k].survey.questions;
	if(questions.length>0){
	  questions.forEach((question:any)=>{
		 
	 console.log(question);
                if (question.question_type == 2 && this.fills[question.id]== undefined) {
                    this.unfills[question.id]=[1,2,3,4,5];
                }
	});
	}
  }
	  console.log(this.nonfills.length);
	  this.nonfill=false;
	  console.log(this.nonfills.length);
	  this.fills[id]=[];
  this.unfills[id]=[];
  
	  let fillval=parseInt(this.ratings);
	//  this.surveyform[id]=fillval;
	 let nonfillval=5-fillval;
  for(var i = 1; i <= fillval; i++){
     this.fills[id].push(i);
  }
  for(var j = 1; j <= nonfillval; j++){
     this.unfills[id].push(j);
  }
  
  }
  downloadtogallery(){
	  this.base64ToGallery.base64ToGallery(this.myPhoto, { prefix: 'IMG-' }).then(
  res => this.toastShow('Image has been saved in mobile photo gallery '),
  err => this.toastShow('Error saving image to gallery ')
);
  }
photodownload(url,id,isshareable) {
	if(!isshareable){
		this.toastShow('Sorry, you are not allowed to download this photo.');
	}
	else{
  //const url = 'http://www.example.com/file.pdf';
    let canvass = this.downcanvasRef.nativeElement;
    let contexts = canvass.getContext('2d');
let loading = this.loadingCtrl.create({
                content: 'Downloading. Please wait...'
            });
			loading.present();
  let source = new Image(); 
	//let source = this.mobileimg.nativeElement;
	source.src=url;
	
    source.crossOrigin = 'Anonymous';
    source.onload = () => {
	//alert('image loaded');
     	
		canvass.height = source.height;
        canvass.width = source.width;
		contexts.drawImage(source,0,0);
		let sour=canvass.toDataURL();
		//alert(sour);
	//	this.base64.encodeFile(sour).then((base64File: string) => {
 
		//alert(str);
		loading.dismiss();
		this.base64ToGallery.base64ToGallery(sour, { prefix: 'IMG-' }).then(
  res => this.toastShow('Image has been saved in mobile photo gallery '),
  err => this.toastShow('Error saving image to gallery ')
);

/*}, (err) => {
  this.toastShow(err);
});*/
    };
	
	//let filePath = url;
	
 // const fileTransfer: FileTransferObject = this.transfer.create();
 
			
 /*           loading.present();
this.file.createDir(this.file.externalRootDirectory, 'Pictures',false)
.then(_ => {
 fileTransfer.download(url, this.file.externalRootDirectory +'/Pictures/img-'+id+'.png').then((entry) => {
    this.toastShow('download complete ');
	loading.dismiss();
  }, (error) => {
    // handle error
	 this.toastShow('download error');
	loading.dismiss();
  });})
.catch(err => { fileTransfer.download(url, this.file.externalRootDirectory +'/Pictures/img-'+id+'.png').then((entry) => {
 this.toastShow('download complete ');
 loading.dismiss();
  }, (error) => {
    // handle error
 this.toastShow('download error');
	loading.dismiss();
  });});

 */
}
}


frameadded=false;
mobimg='assets/images/noimg.png';
remotesocial(){
	const options: InAppBrowserOptions = {
      location: 'no'
    }

    // Opening a URL and returning an InAppBrowserObject
    

if(this.socialsharedetail['profileURL']){
	

	const browser = this.iab.create(this.socialsharedetail['profileURL'],'_self', options);
	browser.show();
	}
else{
//const browser = this.iab.create('https://www.facebook.com/pepsi','_self', options);
//	browser.show();
}

}
embedurl(url){
	console.log(url);
	const options: InAppBrowserOptions = {
      location: 'no'
    }

    // Opening a URL and returning an InAppBrowserObject
    


	const browser = this.iab.create(url,'_self', options);
	browser.show();
	

}

uploadsocialsharestatus(id){
	let data1={photo_id:id};
        this.profileService.updatesocialpicstatus(data1).then(dta => {
			console.log(dta);
			this.socialsharedetail['isShared']=true;

		},
		err=>{
			console.log(err);
		}
);
}
uploadsocialshare(){

	/*let filePath = this.myPhoto;

  let imgtoupload=filePath.substr(filePath.indexOf(",") + 1);
   
		let dat={event_id:this.id_event};
        this.profileService.updatesocial(dat).then(data => {
					this.toastShow("sharing successful!");
this.socialsharedetail['isShared']=true;
	let data1={image:imgtoupload,socialshare_id:this.socialid};
        this.profileService.updatesocialpic(data1).then(dta => {
		},
		err=>{
		}
		);
        
		},
		err=>{
		}
		);
  */
}
selectedPhoto=false;
socialshare(app){
	if(!this.selectedPhoto){
		
		this.toastShow('please select image');
	}
	else{
		
	if(app=='wts'){
// Share via email
this.socialSharing.shareViaWhatsApp(this.socialmsg, this.myPhoto).then((_) => {
	this.uploadsocialshare();
}).catch((_) => {
    this.toastShow('Can\'t share using Whatsapp');// Error!
});
	}
	else if(app=='mail'){
		// Share via email
this.socialSharing.shareViaEmail(this.socialmsg,'',[''],[''],[''],this.myPhoto).then(() => {
 this.uploadsocialshare();
 // Success!
}).catch(() => {
	    this.toastShow('Can\'t share using Mail');// Error!

  // Error!
});
	}
	else if(app=='fb'){
// Share via email
	
	

	this.socialSharing.shareViaFacebook(this.socialmsg,this.myPhoto,null).then((_) => {
//this.toastShow(_);
this.uploadsocialshare();
}).catch((_) => {
    this.toastShow('Can\'t share using Facebook');// Error!
});

	}
	else if(app=='twe'){
	

this.socialSharing.shareViaTwitter(this.socialmsg, this.myPhoto).then((_) => {
this.uploadsocialshare();
}).catch(() => {
    this.toastShow('Can\'t share using Twitter');// Error!
});
	
	}
	else if(app=='inst'){
// Share via email
this.socialSharing.shareViaInstagram(this.socialmsg, this.myPhoto).then((_) => {
this.uploadsocialshare();
}).catch((_) => {
    this.toastShow('Can\'t share using Instagram');// Error!
});
	}
	
	}
}
myPhoto_isset;
    
   scanQRCodes(){

	this.markGameComplete('$2y$10$Y4X.A.DGiISQCDNx3GsK7OTqLTFIq8rjBJbquuHVtdBm1A94uCTXC');
   }
   
   scanCheckInCode(){
	   let canScan=true;
	    if (canScan) {
            let options: ZBarOptions = {
                flash: 'off',
                drawSight: false,
                camera: 'back'
            }
            console.log("start scan")
			//$2y$10$ozm71FrA7y4F53fQrXd8gux/XWAcOiMmVVinSdzGvqel/UU2HKw8i
		//	this.markCheckIn('$2y$10$I1PK8qKEAejcfjSrEr0Aa.xTbHsLE246drVuBomCi8gR/dsS2mymm');
						//this.markCheckIn('$2y$10$ozm71FrA7y4F53fQrXd8gux/XWAcOiMmVVinSdzGvqel/UU2HKw8i');

            this.zbar.scan(options)
                .then(result => {
                    this.markCheckIn(result);
                })
                .catch(error => {
                    console.log(error);
                });
				
				
            console.log("end scan");
        }
        else {
            this.showAlertMessage("Please fill up all the blank field.");
        }
   }
   que_status=['Active','Paused'];
   changeQueStatus(que_no){
	    let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];
        if (activity != undefined) {
            let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();
			let data1={
				que_no:que_no
			}
			this.profileService.pauseQueUsr(data1).then((data: any) => {
				console.log(data);
				if (data.success) {
				activity.pause=data.pause;
				this.toastShow(data.message);
			}
			else{
				this.toastShow(data.message);
				}
				loading.dismiss();
			})
			.catch(error => {
				this.toastShow('Please try again!');
				loading.dismiss();
			});	  
	}
   }
   //to set pause to unpause on multiple queues
   changeQueuStatus(que_no,i){
	    let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];
        if (activity != undefined) {
            let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();
			let data1={
				que_no:que_no
			}
			this.profileService.pauseQueUsr(data1).then((data: any) => {
				console.log(data);
				if (data.success) {
				activity.queues[i].pause=data.pause;
				this.toastShow(data.message);
			}
			else{
				this.toastShow(data.message);
				}
				loading.dismiss();
			})
			.catch(error => {
				this.toastShow('Please try again!');
				loading.dismiss();
			});	  
	}
   }
   scanurlCode(id){
	   console.log(id);
	   let options: ZBarOptions = {
                flash: 'off',
                drawSight: false,
                camera: 'back'
            }
            console.log("start scan")
            this.zbar.scan(options)
                .then(result => {
                    this.scanurlbanner(result,id);
                })
                .catch(error => {
                    console.log(error);
                });
				
		//		this.scanurlbanner('$2y$10$42yLgdy/rBf5ykTZqQZZRuFWXXpITlUsLzdGfcDQOojICG9VWtV82',id);
            console.log("end scan"); 
   }
   scanurlbanner(code,id){
	   
	   console.log(code,id);
	   
            let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();
let data={banner_id:id,sec_code:code};
            this.eventService.scanurl(data)
                .then((data: any) => {
                    loading.dismiss();
					console.log(data);
                    if (data.success) {
						console.log(data.url);
						this.openimageurl(data.url);
                    }
                    else {
                        this.showAlertMessage(data.message);
                    }

                })
                .catch(error => {
                    loading.dismiss();
                    console.log(error);
                });
	   
   }
   openimageurl(url){
	   const options: InAppBrowserOptions = {
      location: 'no'
    }
	const browser = this.iab.create(url,'_self', options);
	browser.show();
	
	
	 
   }
   
   refreshque(id){ 
   let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];
        if (activity != undefined) {
            let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();
			let data1={
				game_id:id
			}
			this.profileService.refreshqueues(data1).then((data: any) => {
				console.log(data);
				if (data.success) {
				activity.queues=data.queues;
				this.toastShow(data.message);
			}
			else{
				this.toastShow(data.message);
				}
				loading.dismiss();
			})
			.catch(error => {
				this.toastShow('Please try again!');
				loading.dismiss();
			});	  
	}
	else{
		this.toastShow('Please try again later!');
	}
   }
   refreshslot(){
	 let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];
        if (activity != undefined) {
            let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();
			
			this.profileService.refreshslots().then((data: any) => {
				console.log(data);
				if (data.success) {
				this.slotid=data.slotrecord;		
				this.toastShow(data.message);
			}
			else{
				this.toastShow(data.message);
				}
				loading.dismiss();
			})
			.catch(error => {
				this.toastShow('Please try again!');
				loading.dismiss();
			});	  
	}
	else{
		this.toastShow('Please try again later!');
	}
	   
   }
   
    scanQRCode() {
		//$2y$10$4ZMSfzb9fsM98LjqdAwWt.EKDOH9aQtmQ6yORa9LsjqiY6wwjhC.u
		//$2y$10$KoWlrWqkeSFpg2GOeKFjDu6/lq5Tn8qibyjwA0gUIJ3SS4SrxExrq
		//$2y$10$JeurXhsrqxg3rOw.YRYJhutfjqkLyvK9u8e0pSMszXYBF2axutCma
//		this.markGameComplete('$2y$10$KoWlrWqkeSFpg2GOeKFjDu6/lq5Tn8qibyjwA0gUIJ3SS4SrxExrq');
	//this.markGameComplete('$2y$10$JeurXhsrqxg3rOw.YRYJhutfjqkLyvK9u8e0pSMszXYBF2axutCma');
	//this.markGameComplete('abc');
		
        // Check is Game Type Input fill up all the input
    

    let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];
 
        var canScan = true;
        if (activity.type == GAME_TYPE_INPUT) {
            let fields = activity.game.fields;

            fields.forEach((field: any) => {
                if (field.value == undefined || field.value == null || field.value.length <= 0) {
                    canScan = false;
                }
            });
        }

        if (this.current_scannedCount >= this.current_number_of_scan){
            canScan = false;
        }
        
        
        if (canScan) {
            let options: ZBarOptions = {
                flash: 'off',
                drawSight: false,
                camera: 'back'
            }
            console.log("start scan")
            this.zbar.scan(options)
                .then(result => {
                    this.markGameComplete(result);
                })
                .catch(error => {
                    console.log(error);
                });
				
            console.log("end scan");
        }
        else {
            this.showAlertMessage("Please fill up all the blank field.");
        }
		

    }
	
scantextactivity(textId){
	let options: ZBarOptions = {
                flash: 'off',
                drawSight: false,
                camera: 'back'
            }
			let textdata={};
			textdata['id']=textId;
            console.log("start scan")
          this.zbar.scan(options)
                .then(result => {
					textdata['score_code']=result;
                    this.textscanedresponse(textdata);
                })
                .catch(error => {
                    console.log(error);
					this.loadLiveEventDetail();
                });
//textdata['score_code']='1566394286';
  //                  this.textscanedresponse(textdata);				
            console.log("end scan");
}

textscanedresponse(data){
	 let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();
this.eventService.textActivity(data).then((data:any)=>{
	loading.dismiss();
	if(data.success==true){
		this.setTextActivity(data);
		
	}
	else{
	this.showAlertMessage(data.message);	
	}
	 
})
.catch(error=>{
                    loading.dismiss();
                    console.log(error);
		 this.showAlertMessage("Error Scanning ");

});
}
	
	setTextActivity(data){
		if(typeof data.content.data !== 'undefined'){     
		           let scantextactivities = data.content.data;
		   scantextactivities.forEach((scantextactivity: any) => {
//this.textQuestions.push({question:scantextactivity.heading,id:scantextactivity.scan_text_activity_id,game_type:'text_activity'});
			   
			let ans_field=[];
			let space_field=[];
			
			
			   if(scantextactivity.is_scanned){
				
			   let answer_array=Array.from(scantextactivity.answer);
			   console.log(answer_array);
			   //let marginval=90/scantextactivity.length_of_answer;
			   let marginval;
			  let   k=scantextactivity.length_of_answer;
					   if (k==1)
					  {
						  marginval='46%';
					  }
					  else if (k==2)
					  {
						  marginval='42%';
					  }
					  else if (k==3)
					  {
						  marginval='39%';
					  }
					  else if (k==4)
					  {
						  marginval='35%';
					  }
					  else if (k==5)
					  {
						  marginval='30%';
					  }
					  else if (k==6)
					  {
						  marginval='26%';
					  }
					  else if (k==7)
					  {
						  marginval='22%';
					  }
					  
					  else if (k==8)
					  {
						  marginval='18%';
					  }
					  
					  else if (k==9)
					  {
						  marginval='15%';
					  }
					  
					  else if (k==10)
					  {
						  marginval='9%';
					  }
					  
					  else if (k==11)
					  {
						  marginval='6%';
					  }
					  
					  else if (k==12)
					  {
						  marginval='4px';
					  }
					  
					  else if (k>12)
					  {
						  marginval='4px';
					  }
				   
let marginvalue=marginval;
			   console.log(marginvalue);

			      for(let i=1;i<scantextactivity.length_of_answer;i++){
				   ans_field[i]={ans:'',space:0,marginleft:'4px'};
				   if(answer_array[i]==' '){
					   console.log('space at ',i);
					   				   ans_field[i]={ans:' ',space:1,marginleft:'4px'};
marginvalue='4px';
				   }
			   }
			   
			   			   					ans_field[0]={ans:'',space:0,marginleft:marginvalue};


			   }
			   
			   let currentIndex = this.slides.getActiveIndex();
      //  console.log(this.activities[currentIndex]);
	  this.activities[currentIndex]=[];
	  this.activities[currentIndex]=scantextactivity;
	  this.activities[currentIndex]['activity_ans']=ans_field;
	  this.activities[currentIndex]['title']='text_activity';
	  this.activities[currentIndex]['type']='text_activity';
	//  this.slides.slideTo(currentIndex, 200);
	/*
			   this.activities.push({
                ...scantextactivity,
                title: 'text_activity',
                type: 'text_activity',
                activity_ans:ans_field,
				
            });*/
console.log(this.activities);
   
		});
		}
	}
	
scanclueactivity(clueId){
	let options: ZBarOptions = {
                flash: 'off',
                drawSight: false,
                camera: 'back'
            }
			let cluedata={};
			cluedata['id']=clueId;
            console.log("start scan")
           this.zbar.scan(options)
                .then(result => {
					cluedata['score_code']=result;
                    this.cluescanedresponse(cluedata);
                })
                .catch(error => {
                    console.log(error);
                });
				//cluedata['score_code']='1566524161';
				//this.cluescanedresponse(cluedata);
            console.log("end scan");
}
ans=[];
onKeyChange(keyevent,i) {
	if( keyevent.keyCode == 8 || keyevent.keyCode == 46 )
	{}
else{
	//this.submittextans=event;
//	alert(key);
	//activity.activity_ans[i]['ans']=key;
	let key=keyevent.target.value;
	 key = key.substr(key.length - 1);
	 let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];
		console.log(activity);
       // let fields = activity.activity_ans;
	   key=key.toLowerCase();
	   		activity.activity_ans[i]['ans']=key;

	let idval=i+1;
if(idval==activity.activity_ans.length){
	 idval=i;
	  // console.log(idval,key,document.getElementById(idval),activity.activity_ans.length);
		//document.getElementById('ans_id_3').focus();
	   

}
else if(activity.activity_ans[i+1]['ans']==' '){
	 idval++;
	  // console.log(idval,key,document.getElementById(idval),activity.activity_ans.length);
		//document.getElementById('ans_id_3').focus();
	   

}


		   idval='ans_id_'+idval;

let elem=document.getElementById(idval);
	elem.focus();
//	elem.children[0].focus();

				
		
       /* fields.forEach((field: any) => {
            if (field.id == fieldId) {
                field.value = value
            }
        });*/
    }
	
}

cluescanedresponse(data){
	 let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();
this.eventService.clueActivity(data).then((data:any)=>{
	loading.dismiss();
	if(data.success==true){
				   let currentIndex = this.slides.getActiveIndex();
      //  console.log(this.activities[currentIndex]);
	  this.activities[currentIndex]['is_scanned']=1;
	  this.activities[currentIndex]['banner_url']=data.content['banner_url'];
	  this.activities[currentIndex]['question']=data.content['question'];
	  this.activities[currentIndex]['is_scanned']=1;
	
		//this.loadLiveEventDetail();
	}
	else{
	this.showAlertMessage(data.message);	
	}
	 
})
.catch(error=>{
                    loading.dismiss();
                    console.log(error);
		 this.showAlertMessage("Error Scanning ");
});
}
markCheckIn(checkinCode){
	this.eventService.markCheckIn(checkinCode,this.checkInStatus)
	.then((data:any)=>{
		console.log(data);
		if(data.success){
			
			this.checkInStatus=data.check_in_status;
			if(this.checkInStatus==1){
			this.checkInText='Check Out';
			this.restrict_activities=0;
					this.menuController.swipeEnable(true);
			}
			else{
			this.checkInText='Check In';	
			this.restrict_activities=1;
					this.menuController.swipeEnable(false);
			}
			this.toastShow(data.message);
			this.loadLiveEventDetail();
		}
		else{
			this.toastShow(data.message);
		}
	});
}
markGameComplete(scoreCode) {
        let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];

        if (activity != undefined) {
            let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();

            this.current_scannedCount++;
			console.log(activity);
            this.eventService.markGameComplete(scoreCode, activity.stage.id, activity.game.id, activity.game_type, activity.game.fields, this.current_scannedCount)
                .then((data: any) => {
                    loading.dismiss();
                    if (data.success) {
                        this.showAlertMessage("Successfully collected " + data.content.added_score + " points");
						this.participantScore = data.content.new_score;
						activity.game.already_scanned = activity.game.already_scanned+1;
                    }
                    else {
                        this.showAlertMessage(data.message);
                    }

                    if (data.completed){
						activity.completed = true;
						activity.testdriveid=data.testdriveid;
						activity.current_queue_no=data.current_queue_no;
						this.cur_que_no=data.current_queue_no;
						
						activity.pause=data.pause;
						activity.que_slot=data.que_slot;
						activity.my_queue_no=data.my_queue_no;
						console.log('set');
						this.hasScan(data.game_id);
					}
                    this.invalidateShowScanScore();
                    this.invalidateShowCompleted();
                })
                .catch(error => {
                    loading.dismiss();
                    console.log(error);
                });
        }
    }
	cur_que_no;
	my_que_no;
	my_slot;
	slots=[];
	slotid=[];
	selected_slot=false;
	selectedslot(id){
		this.selected_slot=true;
		console.log(this.slotid.length);
		var myElement = document.getElementById("slotdiv");
        myElement.click();
		
	}
	bookslot(){
		console.log(this.slotid.length);
		console.log(this.slotid);
		if(this.slotid.length!=undefined){
			this.toastShow('please select slot first');
		}
		else{
		console.log(this.slotid);
		let slot={};
		slot['slot_id']=JSON.stringify(this.slotid);
		let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();				

		this.eventService.bookslot(slot)
            .then((data: any) => {
				console.log(data);
                if (data.success) {
					this.toastShow(data.message);
                    
                }
				loading.dismiss();
            });
	}
	}
SetSlot(){
	console.log(this.slotid);
	console.log('my slot');
	this.eventService.getSlots()
            .then((data: any) => {
				console.log(data);
				this.slots=data.data;
                if (data.success) {
                    
                }
            });
	this.my_slot='12:26';
}
loadParticipantScore() {
        this.eventService.getParticipantScore()
            .then((data: any) => {
				console.log(data);
                if (data.success) {
                    this.userId = data.content.userId;
					this.docStatus=data.content.docstatus;
                    this.userDrawId = data.content.drawId;
                    this.participantScore = data.content.score;

                    this.events.publish('profile:updated', {
                        id: this.userId,
                        drawId: this.userDrawId
                    });
                }
            });
    }
socialmsg;
socialid;

surveyQuestions: Array<any>;
pollQuestions: Array<any>;
clueQuestions: Array<any>;
textQuestions: Array<any>;
socialsharedetail={status:true};
socialbutton=false;
qrstatus={status:true};
notificationcount=0;
    processDataIntoActivities(data) {

		
		this.qrstatus=data.qrcode;
		this.socialsharedetail=data.socialshare;
		this.socialbutton=this.socialsharedetail['profileURL'];
		//console.log('remoteurl',);
        // clear
        this.activities = [];
		this.surveyQuestions=[];
		this.pollQuestions=[];
		
		this.clueQuestions=[];
		this.textQuestions=[];
        this.activityListIndex = 0;
		this.notificationListIndex=1;
        this.activityViewScore = 0;
		this.pollViewScreen=0;
		this.gameScreenIndex=0;
		
        // banners
        let banners = data.banners;
        banners.forEach((banner: any) => {
			if(banner.atend==0 && banner.is_multiurl!=3 && banner.is_multiurl!=2){
				
            this.activities.push({
				
                ...banner,
                type: 'banner'
            });
            this.activityListIndex++;
            this.activityViewScore++;
			this.pollViewScreen++;
			this.notificationListIndex++;
			}
			
				
				
			
				
			
        });

this.activities.push({
                
                type: 'banner'
            });
        // activities
     	
	 let activityList = data.activities;

        this.activities.push({
            title: data.title,
            type: 'activity_list',
            activities: activityList
        });
        this.activityViewScore++;
		this.pollViewScreen++;
				//notifications
		let notifications=data.notifications;
		console.log(notifications.messages.length);
this.notificationcount=notifications.messages.length;
this.badgecount=notifications.newnotifications;
  this.storage.set('badgecount',this.badgecount);
this.events.publish('notifications:received',this.badgecount);

		this.activities.push({
                ...notifications,
                type: 'notification',
				title:'notifications'
            });
//this.pollViewScreen++;			
console.log(this.activities);

banners.forEach((banner: any) => {
			if(banner.atend==0 && (banner.is_multiurl==3 || banner.is_multiurl==2)){
            this.activities.push({
                ...banner,
                type: 'banner'
            });
            this.activityViewScore++;
			this.pollViewScreen++;
			if( banner.is_multiurl==2){
			this.surveyQuestions.push({survey:banner.survey,title:banner.title});
			}
			else{
			let ind=this.pollViewScreen;
				this.pollQuestions.push({index:ind,title:banner.title,voted:banner.is_voted});
			}
				
			
			}
        });


		//Survey
		/*
		let survey=data.survey;
		this.activities.push({
			...survey,
			type:'survey',
			title:'Survey Form'
		});
		*/
        // games
        
       if(this.qrstatus.status){
		           let games = data.games;
				   if(data.games.length>0){
					   this.gameScreenIndex=this.activities.length;
				   }
		   games.forEach((game: any) => {
            this.activities.push({
                ...game,
                title: game.stage.title,
                type: game.game_type
                
            });

            console.log("game:" + game.stage);
            this.activityViewScore++;
			this.pollViewScreen++;
        });
		
        this.activities.push({
            title: '',//Score
            type: 'redeem'
        });
		this.pollViewScreen++;
	   }
   if(typeof data.scan_text_activities.data !== 'undefined'){     
		           let scantextactivities = data.scan_text_activities.data;
		   scantextactivities.forEach((scantextactivity: any) => {
this.textQuestions.push({question:scantextactivity.heading,id:scantextactivity.scan_text_activity_id,game_type:'text_activity'});
			   
			let ans_field=[];
			let space_field=[];
			
			
			   if(scantextactivity.is_scanned){
				
			   let answer_array=Array.from(scantextactivity.answer);
			   console.log(answer_array);
			   //let marginval=90/scantextactivity.length_of_answer;
			   let marginval;
			  let   k=scantextactivity.length_of_answer;
					   if (k==1)
					  {
						  marginval='46%';
					  }
					  else if (k==2)
					  {
						  marginval='42%';
					  }
					  else if (k==3)
					  {
						  marginval='39%';
					  }
					  else if (k==4)
					  {
						  marginval='35%';
					  }
					  else if (k==5)
					  {
						  marginval='30%';
					  }
					  else if (k==6)
					  {
						  marginval='26%';
					  }
					  else if (k==7)
					  {
						  marginval='22%';
					  }
					  
					  else if (k==8)
					  {
						  marginval='18%';
					  }
					  
					  else if (k==9)
					  {
						  marginval='15%';
					  }
					  
					  else if (k==10)
					  {
						  marginval='9%';
					  }
					  
					  else if (k==11)
					  {
						  marginval='6%';
					  }
					  
					  else if (k==12)
					  {
						  marginval='4px';
					  }
					  
					  else if (k>12)
					  {
						  marginval='4px';
					  }
				   
let marginvalue=marginval;
			   console.log(marginvalue);

			      for(let i=1;i<scantextactivity.length_of_answer;i++){
				   ans_field[i]={ans:'',space:0,marginleft:'4px'};
				   if(answer_array[i]==' '){
					   console.log('space at ',i);
					   				   ans_field[i]={ans:' ',space:1,marginleft:'4px'};
marginvalue='4px';
				   }
			   }
			   
			   			   					ans_field[0]={ans:'',space:0,marginleft:marginvalue};


			   }
			   this.activities.push({
                ...scantextactivity,
                title: 'text_activity',
                type: 'text_activity',
                activity_ans:ans_field,
				
            });

            console.log("scantextactivity:" + scantextactivity);
           this.activityViewScore++;
		   this.pollViewScreen++;
        });
   }
      if(typeof data.scan_clue_activities.data !== 'undefined'){     

		
		           let scanclueactivities = data.scan_clue_activities.data;
		   scanclueactivities.forEach((scanclueactivity: any) => {
            this.activities.push({
                ...scanclueactivity,
                title: 'clue_activity',
                type: 'clue_activity'
                
            });
           this.activityViewScore++;
		   this.pollViewScreen++;
this.clueQuestions.push({question:scanclueactivity.heading,id:scanclueactivity.scan_clue_activity_id,game_type:'clue_activity'});

            console.log("scantextactivity:" + scanclueactivity);
  //          this.activityViewScore++;
			 
        });
	  }
		
        // // Score
        // this.activities.push({
        //     title: 'Score',//Score
        //     type: 'score'
        // });

        // Redeem
        console.log("start push activity");
	//social activivt	
if(data.socialshare.status){
			this.socialmsg=data.socialshare.message;
			this.socialid=data.socialshare.id;
			let socials=data.socialshare;
			this.frameimage=data.socialshare.frameURL;
			this.defaultframe=this.frameimage;
/*			
this.activities.push({
	...socials,
	title:'Social Share',
	type:'socialshare'
	
});		
*/
			
this.activities.push({
	...socials,
	title:'photo_share',
	type:'photoshare'
	
});	
this.pollViewScreen++;
this.activities.push({
	title:'photo_album',
	type:'photoalbum'
	
});	
this.pollViewScreen++;


}
		
/*	if(this.qrstatus.status){
        this.activities.push({
            title: '',//Score
            type: 'redeem'
        });
		this.pollViewScreen++;
	}
	*/
	
	banners.forEach((banner: any) => {
			if(banner.atend==1){
            this.activities.push({
                ...banner,
                type: 'banner'
            });
            this.activityViewScore++;
			this.pollViewScreen++;
			if( banner.is_multiurl==2){
			this.surveyQuestions.push({survey:banner.survey,title:banner.title});
			}
			else if(banner.is_multiurl==3){
			let ind=this.pollViewScreen;
				this.pollQuestions.push({index:ind,title:banner.title,voted:banner.is_voted});
			}
			
			
			
			}
        });
        console.log(this.activities);
		
if(this.activities[0].fullbanner==0){
	let currentIndexis = this.slides.getActiveIndex();
        let activityis = this.activities[currentIndexis];
		if(activityis.type=='text_activity' || activityis.type=='clue_activity'){
			this.activityTitle=activityis.titleheading;
		}
		else{
	this.activityTitle=this.eventname;
		}
}
else{
	
		 let currentIndexis = this.slides.getActiveIndex();
        let activityis = this.activities[currentIndexis];
		if(activityis.type=='text_activity' || activityis.type=='clue_activity'){
			this.activityTitle=activityis.titleheading;
		}
		else{
		//console.log();
        this.activityTitle = this.activities[0].title;
		}
}

if(this.textQuestions.length==0){
	
	let indx=this.activityBanners.findIndex(function(el) {
    return el.icon_name === 'TextQuestion';
  });
  		this.activityBanners.splice(indx,1);

}
if(this.clueQuestions.length==0){
	
	let indx=this.activityBanners.findIndex(function(el) {
    return el.icon_name === 'ImageQuestion';
  });
  		this.activityBanners.splice(indx,1);

}
if(this.pollQuestions.length==0){
	
	let indx=this.activityBanners.findIndex(function(el) {
    return el.icon_name === 'Poll';
  });
  		this.activityBanners.splice(indx,1);
}
else{
	this.chooseActivity='Poll';
}
if(this.surveyQuestions.length==0){
	console.log('no survey');
	let indx=this.activityBanners.findIndex(function(el) {
    return el.icon_name === 'Survey';
  });
  	this.activityBanners.splice(indx,1);;

}
else{
	this.chooseActivity='Survey';
}
//this.acitivityChanged();
this.showHomescreen();

    }
	submittextans='';
chooseActivity;

textactivityanswer(textid,answers){
//console.log(textid);
//console.log(answers);
let fullanswer='';
answers.forEach((ans:any)=>{
	fullanswer+=ans.ans;
});
this.atextactivityanswer(textid,fullanswer);
}	
text_ans=[{ans:''}];
createRange(number){
  console.log(number);
  //this.text_ans.push({ans:''});
  let i=0;
  while(i<number){
	  console.log('m here');
	i++;
  }
return true;
}
atextactivityanswer(textid,answer){
console.log(answer);
		let ans_val={};
				ans_val['answer']=answer;
				ans_val['id']=textid;
                console.log(ans_val);
let loading = this.loadingCtrl.create({
                content: 'Processing. Please wait...'
            });
            loading.present();				
				this.eventService.answerTextActivity(ans_val).then((data: any) => {
				console.log(data);
			  
	loading.dismiss();
	if(data.success==true){
		   let currentIndex = this.slides.getActiveIndex();
      //  console.log(this.activities[currentIndex]);
	  this.activities[currentIndex]['is_answered']=1;
	  
	//	this.loadLiveEventDetail();
		this.showAlertMessage(data.message);	

	}
	else{
	this.showAlertMessage(data.message);	
	}
	 
})
.catch(error=>{
                    loading.dismiss();
                    console.log(error);
		 this.showAlertMessage("Error Scanning ");
        });
            



}	
qrslide(){
	   var activityIndex = -1;
        var count = 0;
        this.activities.forEach((activity: any) => {

            if (activity.type == 'photoshare') {
                    activityIndex = count;
                
            }

            count++;
        });

        if (activityIndex >= 0) {
            this.slides.slideTo(activityIndex, 200);
        }
}
qrslideInst(){
	this.activities.length=0;
	let data=this.sliderData;
	if(data.socialshare.status){
			this.socialmsg=data.socialshare.message;
			this.socialid=data.socialshare.id;
			let socials=data.socialshare;
			this.frameimage=data.socialshare.frameURL;
			this.defaultframe=this.frameimage;
/*			
this.activities.push({
	...socials,
	title:'Social Share',
	type:'socialshare'
	
});		
*/
			
this.activities.push({
	...socials,
	title:'photo_share',
	type:'photoshare'
	
});	

this.activities.push({
	title:'photo_album',
	type:'photoalbum'
	
});	


        setTimeout(() => {
           this.slides.slideTo(0, 20);
            this.changebullet();	
        }, 100);


}
this.acitivityChanged();
	
}
qrslideInst1(){
	   var activityIndex = -1;
        var count = 0;
        this.activities.forEach((activity: any) => {

            if (activity.type == 'photoshare') {
                    activityIndex = count;
                
            }

            count++;
        });

        if (activityIndex >= 0) {
            this.slides.slideTo(activityIndex, 20);
        }
}
    showGameActivity(gameType, gameId) {
        var activityIndex = -1;
        var count = 0;
		let flg=0;
		console.log(gameType);
        this.activities.forEach((activity: any) => {

            if (activity.type == GAME_TYPE_INPUT || activity.type == GAME_TYPE_RULE) {
                if (gameId == activity.game.id) {
					this.topBar='miniGame';
                    activityIndex = count;
                }
            }
			console.log(activity.type);
			 if (activity.type ==gameType && gameType=='text_activity') {
				if (gameId == activity.scan_text_activity_id) {
                    activityIndex = count;
                }
			this.choosetext=gameId;

            }
			if (activity.type ==gameType && gameType=='clue_activity') {
				if (gameId == activity.scan_clue_activity_id) {
                    activityIndex = count;
                }
				this.chooseclue=gameId;
            }
			if (activity.type ==gameType && gameType=='notification') {
                    activityIndex = count;
					if(this.badgecount>0){
				this.badgecount=0;
				this.storage.set('badgecount',this.badgecount);
				this.resetnotifications();
				this.events.publish('notifications:received',0);

				}

            }
            count++;
			console.log(activityIndex,count);
        });

        if (activityIndex >= 0) {
            this.slides.slideTo(activityIndex, 200);
        }
    }

    showScoreActivity() {
        var scoreActivityIndex = -1;
        var count = 0;
        this.activities.forEach((activity: any) => {
            if (activity.type == 'score') {
                scoreActivityIndex = count;
            }

            count++;
        });

        if (scoreActivityIndex >= 0) {
            this.slides.slideTo(scoreActivityIndex, 200);
        }
    }

    showPreviousActivity() {
        this.slides.slidePrev(200);
    }

    showNextActivity() {
        this.slides.slideNext(200);
		console.log(this.slides.getActiveIndex());
    }

    public showActivitesList(){        
        setTimeout(() => {
            if (this.activityListIndex < 0)
                this.activityListIndex = 0;
            this.slides.slideTo(this.activityListIndex, 200);
            
        }, 2000);
        // this.slides.slideTo(2, 200);
    }
	 public showActivitesListinst(){
		 this.showActivityBanner=true;
		 this.chkbox=false;
		 this.toptitle=[];
	 this.activities.length=0;
	let activityList=this.sliderData.activities;
        this.activities.push({
            title: 'Experence',
            type: 'activity_list',
            activities: activityList
        });
		
        setTimeout(() => {
           this.slides.slideTo(0, 20);
            this.changebullet();	
        }, 100);
	 this.acitivityChanged();
	 
	 }
	 public showActivitesListinst1(){   
this.topBar='';     
        setTimeout(() => {
            if (this.activityListIndex < 0)
                this.activityListIndex = 0;
            this.slides.slideTo(this.activityListIndex, 20);
            
        }, 200);
        // this.slides.slideTo(2, 200);
    }
	public showNotificationInst(){ 
	
	this.activities.length=0;
	let notifications=this.sliderData.notifications;
		console.log(notifications.messages.length);
this.notificationcount=notifications.messages.length;
this.badgecount=notifications.newnotifications;
  this.storage.set('badgecount',this.badgecount);
this.events.publish('notifications:received',this.badgecount);

		this.activities.push({
                ...notifications,
                type: 'notification',
				title:'notifications'
            });

        setTimeout(() => {
           this.slides.slideTo(0, 20);
           // this.changebullet();	
        }, 100);				
				this.acitivityChanged();
				

	this.scrollheight='77vh';
	this.scrollmargin='-33px'
		this.notificationslide='notification';

	this.notificationListIndex=0;
	if(this.notif_seg=='helpdesk'){
		this.callFunction();
		this.showquerymsg=true;
	}

	}
	segmentButtonClicked(i){
		console.log(i);
		if(i=='helpdesk'){
			this.showquerymsg=true;
			this.callFunction();

		}
		else{
			this.showquerymsg=false;

		}
		
		 
	}
	callFunction2(){
	let elm=(<HTMLInputElement>document.getElementById('h'));
if(elm!=null){
elm.scrollIntoView(true);
}
	}		
	callFunction(){
    setTimeout(()=>{
	let elm=(<HTMLInputElement>document.getElementById('h'));
console.log(elm);
elm.scrollIntoView(true);
},200); 

} 
	queryMessage='';
	public queryMsg(){
				  let currentIndex = this.slides.getActiveIndex();

    	
        let activity = this.activities[currentIndex];
		console.log(activity);
	
		if(this.queryMessage!=''){
			
let currentdate = new Date(); 
let date2 = currentdate.getFullYear() + "-"
                + ("0" + (currentdate.getMonth() + 1)).slice(-2)  + "-" 
                + ("0" + currentdate.getDate()).slice(-2) + "  "  
                + ("0" + currentdate.getHours()).slice(-2) + ":"  
                + ("0" + currentdate.getMinutes()).slice(-2) + ":" 
                + ("0" + currentdate.getSeconds()).slice(-2);
	let msg={message:this.queryMessage,created_at:date2};
	if(activity!=undefined){
activity.queries.push(msg);
	}
	else{
		this.activities[this.notificationListIndex].queries.push(msg);
	}
		this.notif_seg='helpdesk';
		this.callFunction();
		this.eventService.queryMessage({message:this.queryMessage}).then((data: any) => {
				console.log(data);
				if(data.success==true){

this.showAlertMessage(data.message);
						 
				}
	 				}).catch(error => {
                              this.showAlertMessage('please try again later');
							  		activity.messages.shift();

                    });
					


		
		 
		
							this.queryMessage='';
		}
		else{
			this.toastShow('Please type in message first');
		}
	}
	 public showNotificationInst1(){ 
		this.topBar='';
        setTimeout(() => {
            if (this.activityListIndex < 0)
                this.activityListIndex = 0;
            this.slides.slideTo(this.activityListIndex+1, 20);
            
        }, 200);
        // this.slides.slideTo(2, 200);
    }
	public showProfilePage(){
		this.topBar='';
		this.navCtrl.push(ProfilePage);
	}
	selectedtab='Home';
	public tabscreen(name){
		this.topBar='';
		this.activitiesBack=null;
		this.chkbox=false;
		this.toptitle=[];
		this.autoplay=false;
		this.showquerymsg=false;
		this.notificationslide='';
		this.selectedtab=name;
		switch(name){
			
			case 'Home':
			this.showHomescreen();
			break;
			case 'Profile':
			this.showProfilePage();
			break;
			case 'Notifications':
			this.showNotificationInst();
			break;
			case 'Activity':
			this.showActivitesListinst();
			break;
			case 'Survey':
			this.gotoBannerInst(this.surveyQuestions[0].survey.surveyId);
			break;
			case 'Poll':
			this.gotoPollInst(this.pollQuestions[0].index);
			
			break;
			case 'Photo':
			this.qrslideInst();
			break;
			
			case 'To Do':
			this.todotab();
			break;
		}
	}
	showActivityBanner=true;
	
	public showRedeemscreen(){
		this.selectedtab='';
		this.activitiesBack=null;
	this.activities.length=0;	
        this.activities.push({
            title: '',//Score
            type: 'redeem'
        });
		console.log('madina');

        setTimeout(() => {
           this.slides.slideTo(0, 20);
this.changebullet();	            
        }, 100);

    			      

		this.acitivityChanged();
	}
	 public showHomescreen(){ 
	 this.activities.length=0;
	 this.activities.push({
		        
                type: 'profile'
            });
	
	if(this.docReq){
	this.activities.push({
		        
                type: 'documentReq'
            });
	}
	/* let loader = this.loadingCtrl.create({spinner:"dots"});
    	loader.present().then(done=>{

    		//usually a call the the api, setTimeout to replicate.
    		setTimeout(()=>{
    			loader.dismiss();

    		},320)
    	});*/

	 let banners = this.sliderData.banners;
	 
	 
	if(this.enableCheckIn==1 && !this.docReq){
		
		if(this.is_checkedIn==0){
		//intro banner 
	 banners.forEach((banner:any) => {
			if(banner.is_multiurl!=0 && banner.is_multiurl!=5  && banner.is_multiurl!=1 && banner.is_multiurl!=3 && banner.is_multiurl!=2){
		       this.activities.push({
		        ...banner,
                type: 'banner'
            });
			
			
         }
		 
	});
	}
	else{
		//simple banner
		banners.forEach((banner:any) => {
			if(banner.is_multiurl!=4 && banner.is_multiurl!=3 && banner.is_multiurl!=2){
		       this.activities.push({
		        ...banner,
                type: 'banner'
            });
			
			
         }
		 
	});
	}
		if(this.checkInText=='Check In'){
	this.activities.push({
		        
                type: 'checkin_activity'
            });
		}
			
			
	let notifications=this.sliderData.notifications;
		console.log(notifications.messages.length);
this.notificationcount=notifications.messages.length;
this.badgecount=notifications.newnotifications;
  this.storage.set('badgecount',this.badgecount);
this.events.publish('notifications:received',this.badgecount);

		this.activities.push({
                ...notifications,
                type: 'notification',
				title:'notifications'
            });

        setTimeout(() => {
           this.slides.slideTo(0, 20);
            this.changebullet();	
        }, 100);				
				//this.acitivityChanged();
				
				

			
		//put here msesges	
			
	}
	else if(this.enableCheckIn==1 && this.docReq){
		if(this.is_checkedIn==0){
		//intro banner 
	 banners.forEach((banner:any) => {
			if(banner.is_multiurl!=0 && banner.is_multiurl!=5 && banner.is_multiurl!=1 && banner.is_multiurl!=3 && banner.is_multiurl!=2){
		       this.activities.push({
		        ...banner,
                type: 'banner'
            });
			
			
         }
		 
	});
	}
	else{
		//simple banner
		banners.forEach((banner:any) => {
			if(banner.is_multiurl!=4 && banner.is_multiurl!=3 && banner.is_multiurl!=2){
		       this.activities.push({
		        ...banner,
                type: 'banner'
            });
			
			
         }
		 
	});
	}
	//4---intor
	//0 simple
	//1 multiurl
	//2survey
	//poll
	//5qrscan
	let notifications=this.sliderData.notifications;
		console.log(notifications.messages.length);
this.notificationcount=notifications.messages.length;
this.badgecount=notifications.newnotifications;
  this.storage.set('badgecount',this.badgecount);
this.events.publish('notifications:received',this.badgecount);

		this.activities.push({
                ...notifications,
                type: 'notification',
				title:'notifications'
            });

        setTimeout(() => {
           this.slides.slideTo(0, 20);
            this.changebullet();	
        }, 100);				
				//this.acitivityChanged();
				
				

	}
	else{
		banners.forEach((banner:any) => {
			if(banner.is_multiurl!=3 && banner.is_multiurl!=2){
		       this.activities.push({
		        ...banner,
                type: 'banner'
            });
			
			
         }
		 
	});
	
	

	
	
	
	}
	
	 
	if(this.enableCheckIn==1 && !this.docReq){
		
	if(this.checkInText=='Check Out'){
	this.activities.push({
		        
                type: 'checkin_activity'
            });
		}
	
	}
			
        setTimeout(() => {
           this.slides.slideTo(0, 20);
this.changebullet();	            
        }, 100);

    			      

		this.acitivityChanged();
	 }
	 public showHomescreen1(){  
this.topBar='';	 
        setTimeout(() => {
           this.slides.slideTo(0, 20);
            
        }, 100);
        // this.slides.slideTo(2, 200);
    }
	thx_msg='';
	read_thx_msg(){
		this.navCtrl.setRoot(MultieventsPage);
	}
	choosepoll;
	chooseclue;
	choosetext;
	gotoPoll(id){
		this.topBar='poll';
		this.choosepoll=id;
		console.log(id);
setTimeout(() => {
	
            this.slides.slideTo(id, 200);
            
        }, 100);	
	}
	
	gotoPollInst(id){
		this.topBar='poll';
				this.choosepoll=id;

		console.log(id);
setTimeout(() => {
	
            this.slides.slideTo(id, 20);
            
        }, 100);	
	}
	changebullet(){
				let bulletelements;
bulletelements=document.getElementsByClassName("swiper-pagination-bullet");
    for (var i = 0; i < bulletelements.length; i++) {
        bulletelements[i].style.backgroundColor=this.appFontColor;
    }
	
	}
	
	topbargo(data){
		if(data=='survey'){
			if(this.surveyQuestions.length==0){
				this.toastShow('No Survey Question');
				this.showActivitesListinst();
			}
			else{
				this.topBar='survey';
			this.gotoBannerInst(this.surveyQuestions[0].survey.surveyId);
			}
		}
		else if(data=='poll'){
			if(this.pollQuestions.length==0){
				this.toastShow('No Poll Question');
				this.showActivitesListinst();
			}
			else{
				this.topBar='poll';
			this.gotoPollInst(this.pollQuestions[0].index);
			}
		}
		
		else{
			if(this.gameScreenIndex==0){
				this.toastShow('No Game currently added');
				this.showActivitesListinst();
			}
			else{
				this.topBar='miniGame';
				setTimeout(() => {
						this.slides.slideTo(this.gameScreenIndex, 20);
								}, 100);	
				}
			}
		}
	
	choosesurvey;
	gotoBanner(id){
		this.topBar='survey';
		this.choosesurvey=id;
		let indx=this.activities.findIndex(function(el) {
    return el.bann_id === id;
  }); 
setTimeout(() => {
	
            this.slides.slideTo(indx, 200);
            
        }, 100);	
	}
	gotoBannerInst(id){
		this.topBar='survey';
		this.choosesurvey=id;
		
		let indx=this.activities.findIndex(function(el) {
    return el.bann_id === id;
  }); 
setTimeout(() => {
	
            this.slides.slideTo(indx, 20);
            
        }, 100);	
	}
	
	
 showNotificationsList(){        
        setTimeout(() => {
            if (this.notificationListIndex < 1){
			this.notificationListIndex = 1;}
			
            this.slides.slideTo(this.notificationListIndex, 200);
				if(this.badgecount>0){
				this.badgecount=0;
				this.storage.set('badgecount',this.badgecount);
				this.resetnotifications();
				this.events.publish('notifications:received',0);
				}
			
        }, 2750);
        // this.slides.slideTo(2, 200);
		console.log('madina madina');
    }

    showActivityViewScore(){
        setTimeout(() => {
            if (this.activityViewScore < 0)
                this.activityViewScore = 0;
            this.slides.slideTo(this.activityViewScore, 200);
            
        }, 2000);
    }
    invalidateShowScanScore() {
        let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];

        this.current_type = activity.type;
        this.hideScanScore = (activity.type != GAME_TYPE_INPUT && activity.type != GAME_TYPE_RULE) || activity.completed;
		this.current_scannedCount = 0;
		
		console.log("=================");
		console.log(JSON.stringify(activity));

        if (activity.type == GAME_TYPE_RULE){

			console.log("In game type rule......");
			console.log("Already scanned...." , activity.game.already_scanned);

            this.current_number_of_scan = activity.game.number_of_scan;
            if (activity.game.already_scanned == undefined){
                activity.game.already_scanned = 0;
			}
            this.current_scannedCount = activity.game.already_scanned;
		}

		console.log("=================");
		console.log(JSON.stringify(activity));
        
    }
	
    invalidateShowCompleted() {
        let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];
        console.log(this.activities[currentIndex]);
        console.log(this.activityTitle);
		if(this.activityTitle=='Photo Album'){
			console.log('now load album');
			this.getAlbum();
		}
        this.showCompleted = activity.completed;
    }
eventname;
homescreenbanner;

footerclass='';
drive=[];
is_chk_out=0;
restrict_activities=1;
    loadLiveEventDetail() {
        console.log("mytest");
		let lang;
		this.storage.get(App.STORAGE_APP_LANGUAGE).then((lan)=>{
			if (lan != undefined && lan != '' && lan != 'null') {
				console.log(lan);
				lang=lan;
			}
		});
		let eventreq={};
         this.storage.get(App.STORAGE_APP_CURRENT_EVENT).then((val) => {
            if (val != undefined && val != '' && val != 'null') {
				eventreq['event_id']=val.id;
				eventreq['locale']=lang;
				this.doc_require=val.doc_req;
				this.is_zone=val.is_zone
				this.checkinMsg=val.checkin_msg;
                console.log(eventreq);
				this.eventname=val.name;
				 this.eventService.getLiveEventDetail(eventreq).then((data: any) => {
				console.log(data);
				console.log(data.code);
		
				if(data.code==401){
					this.storage.set('event_token_'+val.id,'');
				} 
				this.homescreenbanner=data.homescreenbanner_url;
				this.drive=data.drive;
				this.is_chk_out=data.drive.is_chk_out;
				console.log(this.drive);
				if(data.drive.slot){
					this.slots=data.drive.slot;
					if(data.drive.my_slot){
						this.slotid=data.drive.my_slot;
						console.log(this.slotid);
					}
				}
				this.cur_que_no=data.cur_que_no;				
				//this.my_que_no=data.my_que_no;				
				this.dynamicText=data.dynamicText;
				this.liveuser=data.user;
				this.appIcons=data.menuIcons.splice(0,6);
				if(data.todoicon){
				this.footerclass='footer2';
				}
				else{
				let todoindx=this.appIcons.findIndex(function(el) {
    return el.icon_name === 'To Do';
  }); 
  this.appIcons.splice(todoindx,1);
				this.footerclass='footer';
					
				}
				
				this.activityBanners=data.activityIcons;
				this.sliderData=data.content;
				
				//this.appIcons.splice(-2,2);
				if(data.restrict_activities==1 && data.checkInStatus==0){
					this.menuController.swipeEnable(false);
				this.restrict_activities=data.restrict_activities;
				}
				else{
					this.restrict_activities=0;
				}
				
				
				this.checkInStatus=data.checkInStatus;
				this.enableCheckIn=data.enable_check_in;
				this.docReq=data.docReq;
				this.is_checkedIn=data.is_checkedIn;
				if(data.checkInStatus==1){
					this.checkInText='Check Out';
				}
				else{
					this.checkInText='Check In';
				}
				console.log('#@$@#$@#$@#$@#'+this.restrict_activities);
		        this.storage.set(App.STORAGE_APP_MENU, this.appIcons);
				console.log(this.appIcons);
               this.processDataIntoActivities(data.content);
			  
			   this.framesurl=data.framesdata;
			  
			   
			   setTimeout(()=>{
    			console.log('process here');
 this.changebullet();
 
    		},1220);
			
			  
            
        }).catch((error) => {
            this.storage.set(App.STORAGE_APP_HAS_LOGIN, false);
            // go register page
			console.log('some error');
           //this.navCtrl.setRoot(RegisterPage);
            this.navCtrl.setRoot(MultieventsPage);

		   
        });
            }
            else {
               console.log('no event');
            }
        });
		
      /*  this.eventService.getLiveEventDetail().then((data: any) => {
            if (data.success) {
           //     this.processDataIntoActivities(data.content);
            }
        }).catch((error) => {
            this.storage.set(App.STORAGE_APP_HAS_LOGIN, false);
            // go register page
         //   this.navCtrl.setRoot(RegisterPage);
        });
		*/
    }

    onGameTextInput(value, gameId, fieldId) {
        // Record the value
        let currentIndex = this.slides.getActiveIndex();
        let activity = this.activities[currentIndex];
        let fields = activity.game.fields;

        fields.forEach((field: any) => {
            if (field.id == fieldId) {
                field.value = value
            }
        });
    }
	resetnotifications(){
		this.eventService.resetnotification()
                            .then((data: any) => {
                                console.log(data,'pak');
							//	this.notification
                            })
                            .catch(error => {
                                console.log(error);
                            });
	}
	getnotification(){
		this.eventService.getnotifications()
                            .then((data: any) => {
								console.log(this.activities[this.notificationListIndex]);
                                console.log(data.content);
								if(data.content.messages.length>this.activities[this.notificationListIndex].messages.length){
									
this.badgecount++; 
this.events.publish('notifications:received',this.badgecount);
				this.storage.set('badgecount',this.badgecount);
setTimeout(()=>{
    				if(this.badgecount>0){
				this.badgecount=0;
				this.storage.set('badgecount',this.badgecount);
				this.resetnotifications();
				this.events.publish('notifications:received',0);
				}

    		},5220);
			
								}
						this.activities[this.notificationListIndex].messages=data.content.messages;
							//	this.notification
                            })
                            .catch(error => {
                                console.log(error);
                            });
	}
	autoplay=true;
	autoplayIndex;
    acitivityChanged() {
		console.log('madina');
		
		
        let currentIndex = this.slides.getActiveIndex();
		
		 
		
		this.autoplayIndex=currentIndex;
        let activity = this.activities[currentIndex];
		console.log(currentIndex,activity);
		this.is_game_desc=false;		
		this.checkInScreen=false;
if(currentIndex>2){
	this.autoplay=false;
}
/*else{
	this.autoplay=true;
}*/
        if (activity != undefined) {
			this.notificationslide='';
		this.showquerymsg=false;
			this.scrollheight='92vh';
			this.scrollmargin='0px';
			if(activity.type=='notification'){
				//console.log('i am noi');
				this.getnotification();
				if(this.badgecount>0){
				this.badgecount=0;
				this.storage.set('badgecount',this.badgecount);
				this.resetnotifications();
				this.events.publish('notifications:received',0);

				}
				if(this.notif_seg=='helpdesk'){
					this.showquerymsg=true;
				}
	this.scrollheight='77vh';
	this.scrollmargin='-33px';
		this.notificationslide='notification';
	/*	let bulletelements;
bulletelements=document.getElementsByClassName("swiper-pagination-bullet");
    for (var i = 0; i < bulletelements.length; i++) {
        bulletelements[i].style.backgroundColor='#ffffff00';
    }*/


			}
			
			if(activity.type=='profile'){
	this.checkInScreen=true;
			
			}
					
		/*	if(activity.is_multiurl!=2){
				this.choosesurvey='';
			}if(activity.is_multiurl!=3){
				this.choosepoll='';
			}*/
			if(activity.is_multiurl==3){
				if(activity.is_voted){
					console.log(activity);
					console.log(activity.bann_id);
				let ans_val={};
				ans_val['bann_id']=activity.bann_id;
				this.eventService.get_poll_comments(ans_val).then((data: any) => {
				console.log(data);
				if(data.success==true){
						this.activities[currentIndex].pollcomments=data.content;

						// this.showAlertMessage(data.message);
				}
	 				});
			}
				console.log('ima poll');
			}
			if(activity.game_description==1){
            this.activityTitle = this.eventname;    
			this.is_game_desc=true;	
			}
			else if(activity.fullbanner==0){
            this.activityTitle = this.eventname;    
			} 
			else if(activity.type=='text_activity')
			{
				this.activityTitle=activity.titleheading;
			}else if(activity.type=='clue_activity')
			{
				this.activityTitle=activity.titleheading;
			}
			else{
            this.activityTitle = activity.title;    
			}
            this.invalidateShowScanScore();
            this.invalidateShowCompleted();
			/*
			
		if(currentIndex==0){
			setTimeout(()=>{
				if(this.autoplay){
				this.slides.slideTo(1, 800);
				}
				
    		},3000)
		}
		if(currentIndex==1){
			setTimeout(()=>{
								if(this.autoplay){

				this.slides.slideTo(2, 800);
								}
    		},3000)
		}
		if(currentIndex==2){
			setTimeout(()=>{
								if(this.autoplay){

				this.slides.slideTo(0, 800);
								}
				
    		},3000)
		}
        */
		}
		
    }
	fullbanner=0;

    showAlertMessage(message) {
        let alert = this.alertCtrl.create({
            title: 'Notice',
            message: message,
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel'
                }
            ]
        });

        alert.present();
    }

    backToHome() {
        this.slides.slideTo(0, 200);
    }

    redeem() {
        let alert = this.alertCtrl.create({
            title: "You'll not able to participated in any game.",
            message: '',
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Redeem!',
                    handler: () => {

                        console.log("App Path", App.API_ENDPOINT);
                        console.log("redeem user id", this.userId);
                        this.eventService.setRedeem(this.userId)
                            .then((data: any) => {
                                if (data.success) {
                                    this.storage.set('STORAGE_APP_HAS_REDEEM'+this.id_event, true);
                                    this.navCtrl.setRoot(DashboardPage);
                                }
                                else {
                                    this.showAlertMessage(data.message);
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                }
            ]
        });

        alert.present();
    }

    setupAppDynamicText() {
        // set default image
        this.storage.get(App.STORAGE_APP_DYNAMIC_TEXT).then((val) => {
            if (val != undefined && val != '' && val != 'null') {
                this.dynamicText = val;
            }
            else {
                this.dynamicText = '';
            }
        });

    }

    hasScan(gameIndex){
		/*
		
		//console.log(gameIndex);
		
      //  let indexOfActivity = this.activityListIndex + gameIndex + 1;
        //let activity = this.activities[indexOfActivity];
        //console.log("index", indexOfActivity);
        let activity = this.activities[this.activityListIndex];
		activity.activities.forEach((activit:any)=>{
			activit.games.forEach((game:any)=>{
			console.log(game.id);
			if(game.id==gameIndex){
			game.completed=true;	
			}
			});
		});
		console.log(activity);
       // return activity.completed;*/
		console.log(this.activities);
		//console.log(gameIndex);
		
      //  let indexOfActivity = this.activityListIndex + gameIndex + 1;
        //let activity = this.activities[indexOfActivity];
        //console.log("index", indexOfActivity);
//        let activity = this.activities;//[this.activityListIndex];
        let activity = this.sliderData.activities;//[this.activityListIndex];
		console.log(activity);
		activity.forEach((activit:any)=>{
			activit.games.forEach((game:any)=>{
			//	console.log(game.game);
			//	game.completed=true;
				if(game.game!=undefined){
			if(game.game.id==gameIndex){
				game.completed=true;	
			}
				}
			});
		});
		console.log(activity);
       // return activity.completed;
    }

    getNumberOfScan(){
        return this.current_number_of_scan;
    }

    getScanNumber(){
        return this.current_scannedCount;
    }
	activityBannerData: Array<any>;
	activityPageBack(data){
		
		
		
	this.showActivitesListinst();
		this.activitiesBack=null;
	this.activityBannerData=data;
		this.showActivityBanner=false;	
		this.chkbox=false;
		this.toptitle=[];
				
	}
	toptitle=[];
	activityPageTop(data){
		this.showActivitesListinst();
		this.activityPage(data);
		this.toptitle=[];
	}
	todotab(){
		console.log('todo clicked');
		let activity = this.sliderData.activities;//[this.activityListIndex];
		activity.forEach((activit:any)=>{
		console.log(activit.title);
		});
		let indx=activity.findIndex(function(el) {
    return el.title === 'Todo';
  }); 
		this.showActivitesListinst();
		this.activityPage(activity[indx]);
	}
	activityPage(data){
				console.log(data);

		this.showActivityBanner=false;
		this.chkbox=false;
		this.toptitle=[];
		this.activityBannerData=[];
		if(data.icon_name!=undefined){
		//let Bdata=[];
		
		if(data.icon_name=='Survey'){
				 let banners = this.sliderData.banners;
	  banners.forEach((banner: any) => {
			if(banner.is_multiurl==2){
		       this.activityBannerData.push({
		        ...banner,
                type: 'banner',
				title:banner.title
            });
         }
	});
	
		}
		if(data.icon_name=='Poll'){

		let banners = this.sliderData.banners;
	  banners.forEach((banner: any) => {
			if(banner.is_multiurl==3){
		       this.activityBannerData.push({
		        ...banner,
                type: 'banner',
				title:banner.title
            });
         }
	});	
		}
		if(data.icon_name=='TextQuestion'){
			
   if(typeof this.sliderData.scan_text_activities.data !== 'undefined'){
this.activities.length=0;	   
		           let scantextactivities = this.sliderData.scan_text_activities.data;
		   scantextactivities.forEach((scantextactivity: any) => {
			let ans_field=[];
			let space_field=[];
			
			
			   if(scantextactivity.is_scanned){
				
			   let answer_array=Array.from(scantextactivity.answer);
			   console.log(answer_array);
			   //let marginval=90/scantextactivity.length_of_answer;
			   let marginval;
			  let   k=scantextactivity.length_of_answer;
					   if (k==1)
					  {
						  marginval='46%';
					  }
					  else if (k==2)
					  {
						  marginval='42%';
					  }
					  else if (k==3)
					  {
						  marginval='39%';
					  }
					  else if (k==4)
					  {
						  marginval='35%';
					  }
					  else if (k==5)
					  {
						  marginval='30%';
					  }
					  else if (k==6)
					  {
						  marginval='26%';
					  }
					  else if (k==7)
					  {
						  marginval='22%';
					  }
					  
					  else if (k==8)
					  {
						  marginval='18%';
					  }
					  
					  else if (k==9)
					  {
						  marginval='15%';
					  }
					  
					  else if (k==10)
					  {
						  marginval='9%';
					  }
					  
					  else if (k==11)
					  {
						  marginval='6%';
					  }
					  
					  else if (k==12)
					  {
						  marginval='4px';
					  }
					  
					  else if (k>12)
					  {
						  marginval='4px';
					  }
				   
let marginvalue=marginval;
			   console.log(marginvalue);

			      for(let i=1;i<scantextactivity.length_of_answer;i++){
				   ans_field[i]={ans:'',space:0,marginleft:'4px'};
				   if(answer_array[i]==' '){
					   console.log('space at ',i);
					   				   ans_field[i]={ans:' ',space:1,marginleft:'4px'};
marginvalue='4px';
				   }
			   }
			   
			   			   					ans_field[0]={ans:'',space:0,marginleft:marginvalue};


			   }
			   this.activities.push({
                ...scantextactivity,
                title: 'text_activity',
                type: 'text_activity',
                activity_ans:ans_field,
				
            });

            console.log("scantextactivity:" + scantextactivity);
          
        });
   }
		}
		if(data.icon_name=='ImageQuestion'){
	
      if(typeof this.sliderData.scan_clue_activities.data !== 'undefined'){     

		this.activities.length=0;
		           let scanclueactivities = this.sliderData.scan_clue_activities.data;
		   scanclueactivities.forEach((scanclueactivity: any) => {
			   	 

            this.activities.push({
                ...scanclueactivity,
                title: 'clue_activity',
                type: 'clue_activity'
                
            });

            console.log("scantextactivity:" + scanclueactivity);
  //          this.activityViewScore++;
			 
        });
	  }
			
		}
		
		}
		else{
		this.activityBannerData=data.games;
		
		}
		
		console.log(this.activityBannerData);
		/*this.activities=[];
		  let games = data.games;
				
		   games.forEach((game: any) => {
            this.activities.push({
                ...game,
                title: game.stage.title,
                type: game.game_type
                
            });
		   });
		*/
	}
activitiesBack;
chkbox=false;
	activityPageData(data,i){
		console.log(data);
		this.showActivityBanner=true;
		this.chkbox=false;
		this.toptitle=[];
		this.activities.length=0;
				
	if(data.type==undefined){
				
		  //let games = [data];
		  this.activitiesBack=this.activityBannerData;
		  let games=this.activityBannerData;
				
		   games.forEach((game: any) => {
            this.activities.push({
                ...game,
                title: game.stage.title,
                type: game.game_type
                
            });
		   });
		    

	}
	else{
			if(data.is_multiurl==2){this.toptitle['icon_name']='Survey';}
			else if(data.is_multiurl==3){this.toptitle['icon_name']='Poll';}
			else if(data.type=='text_activity'){this.toptitle['icon_name']='TextQuestion';}
			else if(data.type=='clue_activity'){this.toptitle['icon_name']='ImageQuestion';}
			
		this.activities=this.activityBannerData;
		
	} 
	
	
        setTimeout(() => {
           this.slides.slideTo(i, 20);
this.changebullet();	            
        }, 100);

			
this.acitivityChanged();
    
	 
		  // this.acitivityChanged();
		  
	}
}
