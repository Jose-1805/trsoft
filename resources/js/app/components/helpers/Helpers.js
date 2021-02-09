import Valid from './components/Valid';
import Btn from './components/Btn';
import GeneralMessage from './components/GeneralMessage';
import Notifications from './components/Notifications';
import TableJL1805 from './components/TableJL1805/TableJL1805';
import SearchServer from './components/SearchServer';
import Gallery from './components/Gallery';
import ImageCheck from './components/ImageCheck';
import RecordAudio from './components/RecordAudio';
import Comments from './components/Comments';
import StaticSidebar from './components/StaticSidebar';
//import Recaptcha_ from './components/Recaptcha_';
import FullLoader from './components/FullLoader';
import FullForm from './components/FullForm';
import SetLang from './components/SetLang';
import DateFunc from './DateFunc';
import SyncUser from './components/SyncUser';
import CookiesPolicy from './components/CookiesPolicy';
import FixedBottomContent from './components/FixedBottomContent';
import PendingPayment from './components/PendingPayment';

const getPropertyObject = (object_, property, alternative) => {
	if(property in object_){
		return object_[property];
	}else{
		if(alternative in object_){
			return object_[alternative];
		}
		return "";
	}
};

const getCookie = (name) => {
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length+1, c.length);
        }
    }
    return false;
}

const deleteCookie = (name) => {
	let date = new Date();

	date.setHours(date.getHours() - 10);

	document.cookie = name+"=; expires="+date.toString()+"; path=/;";
}

export {
	Valid,
	Btn,
	GeneralMessage,
	Notifications,
	TableJL1805,
	SearchServer,
	Gallery,
	ImageCheck,
	RecordAudio,
	Comments,
	//Recaptcha_,
	StaticSidebar,
	FullLoader,
	FullForm,
	getPropertyObject,
	SetLang,
	DateFunc,
	getCookie,
	deleteCookie,
	SyncUser,
	CookiesPolicy,
	FixedBottomContent,
	PendingPayment,
}