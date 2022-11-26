import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    LayoutAnimation,
    Modal,
    TouchableWithoutFeedback,
    Platform,
    UIManager,
    Alert,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Keyboard, Animated, Easing, Linking, SafeAreaView
} from 'react-native';
import React, {useEffect, useRef, useState} from "react";
import storage from "./storage";
import DatePicker from 'react-native-modern-datepicker';
import { getToday, getFormatedDate } from 'react-native-modern-datepicker';
import Lottie from 'lottie-react-native';
import {Hyperlink} from "react-native-hyperlink";
import { BarCodeScanner } from 'expo-barcode-scanner';
import QRCode from 'react-native-qrcode-svg';
import Fares from './Fare.json'

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
//---------------------------------------------Declare---------------------------------------------//
    //App
    // const apiurl='https://wei4test.onrender.com';
    const apiurl='https://wei4test-api.herokuapp.com';
    const Version='1.0.0';
    const ContractUrl='https://www.thsrc.com.tw/ArticleContent/7de57796-db08-4d94-b183-bd62618859db/assets/2209677d-297c-4a21-b941-bfbb7a1b60a7.pdf';
    const TexpressUrl='https://www.thsrc.com.tw/ArticleContent/4d262503-84bc-4963-a58e-4ca1a6453ad3';
    const HsrUrl='https://www.thsrc.com.tw';
    const AppUrl=Platform.OS === "android"?'https://play.google.com/store/apps/details?id=tw.com.thsrc.enterprise':'https://apps.apple.com/us/app/apple-store/id1266626655';
    const TLifeUrl='https://tlife.thsrc.com.tw/tw'
    const RefundUrl='https://www.thsrc.com.tw/ArticleContent/291d80fe-080f-4442-90d0-9a9b82f119e5?_ga=2.240226112.2145961792.1646737491-771260607.1646737491';
    let chiness_weeksate=['日','一','二','三','四','五','六'];
    const [Start, setStarted] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [ChooseStationVisible, setChooseStationVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [TypeVisible, setTypeVisible] = useState(false);
    const [TicketsVisible, setTicketsVisible] = useState(false);
    const [IsStart, setIsStart] = useState(true);
    const [StartStation, setStartStation] = useState(11);
    const [EndStation, setEndStation] = useState(2);
    const [Stations, setStations] = useState(11);
    const Stations_Name=['南港','台北','板橋','桃園','新竹','苗栗','台中','彰化','雲林','嘉義','台南','左營'];
    const TicketTypeName=['全票','孩童','敬老','愛心','大學生']
    const [Tickets, setTickets] = useState([1,0,0,0,0]);
    const [copyTickets, setcopyTickets] = useState([1,0,0,0,0]);
    const [sumTickets, setsumTickets] = useState(1);
    const [TimeText, setTimeText] = useState('');
    const [BackTimeText, setBackTimeText] = useState('請選擇回程時間');
    const [PreText, setPreText] = useState('無偏好');
    const [TypeText, setTypeText] = useState('標準車廂');
    const [StartstationText, setStartstationText] = useState(Stations_Name[11]);
    const [EndstationText, setEndstationText] = useState(Stations_Name[2]);
    const [AllticketText, setAllticketText] = useState('全票*1');
    const [SelectDateMode,setSelectDateMode]=useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [day,setday]=useState('')
    const [hm,sethm]=useState('')
    const [maxDate, setmaxDate] = useState('');
    const [minDate, setminDate] = useState('');
    const [backminDate,setbackminDate]=useState('');
    const [Gostate,setGostate]=useState(true);
    const [InitTime,setInitTime]=useState('')
    const [CalerdarVisible,setCalendarVisible]=useState(true);
    const [LoadingVisible,setLoadingVisible]=useState(false);
    const [complete,setcomplete]=useState(false);
    const [Search,setSearch]=useState(false);
    const [Prices,setPrices]=useState([0,0,0,0,0]);
    const [Allprices,setAllprices]=useState(0);
    const [DateOfFind,setDateOfFind]=useState('');
    const [DateOfTable,setDateOfTable]=useState('');
    const [DateOfEdit,setDateOfEdit]=useState('');
    const [FindTimeText,setFindTimeText]=useState('');
    const [TableTimeText,setTableTimeText]=useState('');
    const [editstate,seteditstate]=useState(true);
    const [EditTrains,setEditTrains]=useState(false);
    const [locationtype,setlocationtype]=useState(0);
    const [HourAndMin,setHourAndMin]=useState('');
    //Booking
    const [BookVisible, setBookVisible] = useState(false);
    const [BackBookVisible, setBackBookVisible] = useState(false);
    const [IDcheckVisible, setIDcheckVisible] = useState(false);
    const [InfoVisible, setInfoVisible] = useState(false);
    const [DetailsVisible, setDetailsVisible] = useState(false);
    let gotime=TimeText.toString().substring(0,14);
    let backtime=BackTimeText.toString().substring(0,14);
    let start=StartstationText;
    let end=EndstationText;
    let oneway_return=expanded;
    const [datas, setdatas] = useState([]);
    const [backdatas, setbackdatas] = useState([]);
    const Titletext=expanded?'去程':'單程';
    const [IDnumber, setIDnumber] = useState('');
    const [Email, setEmail] = useState('');
    const [Name, setName] = useState('');
    const [Phonenumber, setPhonenumber] = useState('');
    const [Gender, setGender] = useState(true);
    const [Tickinfo, setTickinfo] = useState([]);
    const [BackTickinfo, setBackTickinfo] = useState([]);
    const [Check, setCheck] = useState(false);
    const [PayticketVisible,setPayticketVisible]=useState(false);
    const [TicketDatas,setTicketDatas]=useState({NumOfTickets:[],Prices:[],Start:{Tickets:[{Type:'',Position:'',Price:''}]},Arrive:{Tickets:[{Type:'',Position:'',Price:''}]}});
    const [CopyTicketInfo,setCopyTicketInfo]=useState({NumOfTickets:[],Prices:[],Start:{Tickets:[{Type:'',Position:'',Price:''}]},Arrive:{Tickets:[{Type:'',Position:'',Price:''}]}});
    const [Book,setBook]=useState(false);
    const [PayOrUseIndex,setPayOrUseIndex]=useState(0);
    const [cautionsVisible,setcautionsVisible]=useState(false);
    const [BookNumber,setBookNumber]=useState('');
    const [GetTicketCode,setGetTicketCode]=useState('');
    const [findcodeVisible,setfindcodeVisible]=useState(false);
    const [IdOrPassport,setIdOrPassport]=useState('身分證字號');
    const [IdPassportModal,setIdPassportModal]=useState(false);
    const [FindDateVisible,setFindDateVisible]=useState(false);
    const [findfare,setfindfare]=useState(false);
    const [Gainfare,setGainfare]=useState(false);
    const [fareinfo,setfareinfo]=useState(true);
    const [timetable,settimetable]=useState(false);
    const [TableDateVisible,setTableDateVisible]=useState(false);
    const [TableData,setTableData]=useState([]);
    const [TableVisible,setTableVisible]=useState(false);
    const [EditVisible,setEditVisible]=useState(false);
    const [EditDateVisible,setEditDateVisible]=useState(false);
    const [EditDetailsVisible,setEditDetailsVisible]=useState(false);
    const [EditCall,setEditCall]=useState(false);
    const [Fees,setFees]=useState([]);
    const [AllFees,setAllFees]=useState(0);
    const [RefundDetailsVisible,setRefundDetailsVisible]=useState(false);
    const [IdOfFind,setIdOfFind]=useState('');
    const [OrderOfFind,setOrderOfFind]=useState('');
    const [FindDetailsVisible,setFindDetailsVisible]=useState(false);
    const [FindOfDatas,setFindOfDatas]=useState([]);
    const [StationsByDatas,setStationsByDatas]=useState([]);
    const [StationsByOrder,setStationsByOrder]=useState('');
    const [BookStationsByVisible,setBookStationsByVisible]=useState(false);
    const [BackBookStationsByVisible,setBackBookStationsByVisible]=useState(false);
    const [PayTicketStationsByVisible,setPayTicketStationsByVisible]=useState(false);
    const [PaidTicketStationsByVisible,setPaidTicketStationsByVisible]=useState(false);
    const [TableStationsByVisible,setTableStationsByVisible]=useState(false);
    const [TrainsStationsByVisible,setTrainsStationsByVisible]=useState(false);
    //This is for otherpage
    const [Page,setPage]=useState(1);
    //This is for pay page
    const [BookedDatas,setBookedDatas]=useState([]);
    const [PaidDatas,setPaidDatas]=useState([]);
    //This is for have page
    const [YourTickets,setYourTickets]=useState([]);
    const [UsedTickets,setUsedTickets]=useState([]);
    const [TicketUse,setTicketUse]=useState(false);
    const [PayOrTake,setPayOrTake]=useState(false);
    const [ScanVisible,setScanVisible]=useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [PaidTicketVisible,setPaidTicketVisible]=useState(false);
    const [QRCodeVisible,setQRCodeVisible]=useState(false);
    const [QRCodeIndex,setQRCodeIndex]=useState([]);
    const [QRCodeData,setQRCodeData]=useState({});
    const [Clock,setClock]=useState();
    const [QRTicketStationsByVisible,setQRTicketStationsByVisible]=useState(false);

    async function ReNewDatas(){
        if(Start){
            console.log('Re Newing Datas!');
            setTicketUse(false);
            setPayOrTake(false);
            setBookNumber('');
            setGetTicketCode('');
            setIdOfFind('');
            setOrderOfFind('');
            setIdOrPassport('身分證字號');
            setBookNumber('');
            setGetTicketCode('');
            setTableData([]);
            setFindOfDatas([]);
            setdatas([]);
            setbackdatas([]);

            var date=new Date();
            var weekday=chiness_weeksate[date.getDay()];
            var hour=date.getHours().toString();
            if(hour.length==1){
                hour='0'+hour;
            }
            var minute=date.getMinutes().toString();
            if(minute.length==1){
                minute='0'+minute;
            }
            setTimeText(getToday()+' ('+weekday+') '+hour+':'+minute);
            setHourAndMin(hour+':'+minute);
            setFindTimeText(getToday);
            setTableTimeText(getToday);
            setStarted(false);
            setday(getToday);
            sethm(hour+':'+minute);
            setInitTime(getFormatedDate(date,'YYYY-MM-DD HH:mm'));
            setSelectedDate(getFormatedDate(date,'YYYY-MM-DD HH:mm'));
            setDateOfFind(getFormatedDate(date,'YYYY-MM-DD'));
            setDateOfTable(getFormatedDate(date,'YYYY-MM-DD'));
            setminDate(getFormatedDate(date,'YYYY-MM-DD HH:mm'));
            setbackminDate(getFormatedDate(date,'YYYY-MM-DD HH:mm'));
            date=date.setDate(date.getDate()+28);
            setmaxDate(getFormatedDate(date,'YYYY-MM-DD HH:mm'));


            //this is for booking
            try {
                await storage.load({key: 'userinfo', autoSync: true, syncInBackground: true,})
                    .then(ret => {
                        setName(ret.userName);
                        setGender(ret.userGender);
                        setIDnumber(ret.userID);
                        setPhonenumber(ret.userPhone);
                        setEmail(ret.userEmail);
                    });
            }
            catch (err){
                console.log(err);
            }

            //this is for pay
            setBookedDatas([]);
            await storage.getAllDataForKey('BookedTicket')
                .then(item => {
                    setBookedDatas(item);
                    console.log('Set Booked Tickets');
                });
            setPaidDatas([]);
            await storage.getAllDataForKey('PaidTicket')
                .then(item => {
                    setPaidDatas(item);
                    console.log('Set Paid Tickets');
                });

            //this is for have
            setYourTickets([]);
            await storage.getAllDataForKey('Ticket')
                .then(item => {
                    setYourTickets(item);
                    console.log('Set Your Tickets');
                });
            setUsedTickets([]);
            await storage.getAllDataForKey('UsedTicket')
                .then(item => {
                    setUsedTickets(item);
                    console.log('Set Used Tickets');
                });
            console.log('Complete!');
        }
    }
    useEffect(()=>{
        if(Start) {
            clearTimeout(Clock);
            setClock(setTimeout(async () => {
                await Alert.alert('大笨蛋', '操作逾時 請重新操作謝謝!',[{text:'確定',onPress:()=>{setStarted(true);}}]);
            }, 10*60 * 1000));
            ReNewDatas();
        }
        },[Start]);

//---------------------------------------------All fetch---------------------------------------------//
    useEffect(()=>{
        if(Search) {
            if (expanded && BackTimeText === '請選擇回程時間') {
                Alert.alert('大笨蛋', '去程時間或回程時間未選擇，請重新輸入。');
                setLoadingVisible(false);
                setSearch(false);
                return;
            }
            const data = {
                'StartStation': StartstationText.toString(),
                'ArriveStation': EndstationText.toString(),
                'OnewayReturn': expanded.toString(),
                'StartTime': TimeText.toString(),
                'BackStartTime': BackTimeText.toString(),
                'Type': TypeText.toString(),
                'Tickets': Tickets.toString(),
                'Prefer': PreText.toString()
            };
            setLoadingVisible(true);
            console.log('Data Sent!');
            console.log('Data:',data);
            fetch(apiurl + '/GetTrains/', {
                method: 'POST', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('Data Get!');
                    console.log('Data:',responseJson);
                    console.log('Data Set!');
                    try{
                        if(responseJson['Status']==='False'){
                            Alert.alert('大笨蛋','非常抱歉 該段時間已無車票 請重新選擇!')
                            setLoadingVisible(false);
                        }
                        else{
                            setPrices(responseJson.Price);
                            setdatas(responseJson.Datas);
                            setbackdatas(responseJson.BackDatas);
                            setcomplete(true);
                        }
                        console.log('Complete!');
                    }
                    catch (e) {
                        console.log(e)
                        Alert.alert('大笨蛋', '後端出現問題!');
                    }
                })
                .catch((error) => {
                    Alert.alert('大笨蛋', '某些問題出錯 請重試!');
                    console.log(error)
                    setLoadingVisible(false);
                })
                .then(()=>{
                    setLoadingVisible(false);
                }
            );
        }
        setSearch(false);
    },[Search]);

    useEffect(()=>{
        if(complete && LoadingVisible) {
            setBookVisible(true);
            setLoadingVisible(false);
            let s=0;
            Prices.map((item)=>{
                s+=item;
            });
            setAllprices(s);
        }
        setcomplete(false);
    },[complete]);

    const LoginComplete=()=>{
        if(Name===''){
            Alert.alert('大笨蛋','名字不能是空的!');
        }
        else if(!(IDnumber.match(/^[A-Z](1|2)\d{8}$/i))){
            Alert.alert('大笨蛋','身分證號碼格式不符\n提示 : 大寫英文字加數字共10位!');
        }
        else if(!(Phonenumber.match(/09\d{8}$/))){
            Alert.alert('大笨蛋','電話號碼格式不符\n提示 : 09加上8位數字!');
        }
        else if(!(Email.match(/^(([.](?=[^.]|^))|[\w_%{|}#$~`+!?-])+@(?:[\w-]+\.)+[a-zA-Z.]{2,63}$/))){
            Alert.alert('大笨蛋','電子信箱格式不符');
        }
        else{
            const data={
                'Name':Name,
                'Gender': Gender,
                'ID' : IDnumber,
                'Phone':Phonenumber,
                'Email':Email,
            };
            console.log('Data Sent!');
            console.log('Data:',data);
            fetch(apiurl+'/CheckID/',{method:'POST',headers:{
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },body:JSON.stringify(data)})
                .then((response) => response.json())
                .then(async (responseJson) => {
                    try {
                        if (responseJson.Status === 'True') {
                            console.log('Data Get!');
                            console.log('Data:', responseJson);
                            await storage.save({
                                key: 'userinfo',
                                data: {
                                    userName: Name,
                                    userGender: Gender,
                                    userID: IDnumber,
                                    userPhone: Phonenumber,
                                    userEmail: Email,
                                },
                                expires: null,
                            });
                            setDetailsVisible(true);
                            setIDcheckVisible(false);
                            console.log('Data Set!');
                            console.log('Complete!');
                        } else {
                            Alert.alert('大笨蛋', '身分資訊錯誤 請確認與先前輸入資訊是否一致!');
                        }
                    }
                    catch (e) {
                        console.log(e)
                        Alert.alert('大笨蛋', '後端出現問題!');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
                });
        }
    };

    const InfoComplete=()=>{
        if(Name===''){
            Alert.alert('大笨蛋','名字不能是空的!');
        }
        else if(!(IDnumber.match(/^[A-Z](1|2)\d{8}$/i))){
            Alert.alert('大笨蛋','身分證號碼格式不符\n提示 : 大寫英文字加數字共10位!');
        }
        else if(!(Phonenumber.match(/09\d{8}$/))){
            Alert.alert('大笨蛋','電話號碼格式不符\n提示 : 09加上8位數字!');
        }
        else if(!(Email.match(/^(([.](?=[^.]|^))|[\w_%{|}#$~`+!?-])+@(?:[\w-]+\.)+[a-zA-Z.]{2,63}$/))){
            Alert.alert('大笨蛋','電子信箱格式不符');
        }
        else{
            const data={
                'Name':Name.toString(),
                'Gender': Gender,
                'ID' : IDnumber.toString(),
                'Phone':Phonenumber.toString(),
                'Email':Email.toString(),
            };
            console.log('Data Sent!');
            console.log('Data:',data);
            fetch(apiurl+'/CheckID/',{method:'POST',headers:{
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },body:JSON.stringify(data)})
                .then((response) => response.json())
                .then(async (responseJson) => {
                    try {
                        if (responseJson.Status === 'True') {
                            console.log('Data Get!');
                            console.log('Data:', responseJson);
                            await storage.save({
                                key: 'userinfo',
                                data: {
                                    userName: Name,
                                    userGender: Gender,
                                    userID: IDnumber,
                                    userPhone: Phonenumber,
                                    userEmail: Email,
                                },
                                expires: null,
                            });
                            setInfoVisible(false);
                            console.log('Data Set!');
                            console.log('Complete!');
                        } else {
                            Alert.alert('大笨蛋', '身分資訊錯誤 請確認與先前輸入資訊是否一致!');
                        }
                    }
                    catch (e) {
                        console.log(e)
                        Alert.alert('大笨蛋', '後端出現問題!');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
                });
        }
    };

    useEffect(()=>{
        if(Book) {
            if (!Check) {
                Alert.alert('大笨蛋', '你必須先確認取消/退票注意事項!')
                setBook(false);
            } else {
                const data = {
                    'Name': Name.toString(),
                    'ID':IDnumber.toString(),
                    'Email': Email.toString(),
                    'StartDate': gotime.toString(),
                    'BackDate': backtime.toString(),
                    'StartStation': StartstationText.toString(),
                    'ArriveStation': EndstationText.toString(),
                    'StartTime': Tickinfo[1].toString(),
                    'ArriveTime': Tickinfo[2].toString(),
                    'BackStartTime': oneway_return ? BackTickinfo[1].toString() : 'None',
                    'BackArriveTime': oneway_return ? BackTickinfo[2].toString() : 'None',
                    'Tickets': Tickets.toString(),
                    'Order': Tickinfo[0].toString(),
                    'BackOrder': oneway_return ? BackTickinfo[0].toString() : 'None',
                    'Type': TypeText.toString(),
                    'Prefer':PreText.toString()
                };
                setLoadingVisible(true);
                console.log('Data Sent!');
                console.log('Data:',data);
                fetch(apiurl + '/Book/', {
                    method: 'POST', headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        console.log('Data Get!');
                        console.log('Data:',responseJson);
                        try {
                            console.log('Data Set!');
                            if (responseJson.Status === 'True') {
                                let d1 = new Array();
                                let d2 = new Array();
                                for (var i = 0; i < 5; i++) {
                                    for (var j = 0; j < Tickets[i]; j++) {
                                        if(oneway_return){
                                            d1 = d1.concat(
                                                {
                                                    'Type': TicketTypeName[i],
                                                    'Position': responseJson.Seat[i][j],
                                                    'Price': Prices[i] / (Tickets[i]*2)
                                                }
                                            );
                                        }
                                        else {
                                            d1 = d1.concat(
                                                {
                                                    'Type': TicketTypeName[i],
                                                    'Position': responseJson.Seat[i][j],
                                                    'Price': Prices[i] / Tickets[i]
                                                }
                                            );
                                        }
                                    }
                                }
                                if (oneway_return) {
                                    for (var i = 0; i < 5; i++) {
                                        for (var j = 0; j < Tickets[i]; j++) {
                                            d2 = d2.concat(
                                                {
                                                    'Type': TicketTypeName[i],
                                                    'Position': responseJson.BackSeat[i][j],
                                                    'Price': Prices[i] / (Tickets[i]*2)
                                                }
                                            );
                                        }
                                    }
                                }
                                setTicketDatas({
                                    'CodeNumber': responseJson.BookID,
                                    'BussinessState': false,
                                    'OnewayReturn': oneway_return,
                                    'Type': TypeText,
                                    'TotalText': TicketsToText(Tickets,oneway_return),
                                    'TotalPrice': Allprices,
                                    'StartStation': StartstationText,
                                    'ArriveStation': EndstationText,
                                    'NumOfTickets':Tickets,
                                    'Prices':Prices,
                                    'Start': {
                                        'Date': TimeText.substring(0,14),
                                        'StartTime': Tickinfo[1],
                                        'ArriveTime': Tickinfo[2],
                                        'Order': Tickinfo[0],
                                        'StationsBy': Tickinfo[3],
                                        'Tickets': d1
                                    },
                                    'Arrive': {
                                        'Date': BackTimeText.substring(0,14),
                                        'StartTime': BackTickinfo[1],
                                        'ArriveTime': BackTickinfo[2],
                                        'Order': BackTickinfo[0],
                                        'StationsBy': BackTickinfo[3],
                                        'Tickets': d2
                                    }
                                });
                                storage.save({
                                    key: 'BookedTicket', // 注意:请不要在key中使用_下划线符号!
                                    id: responseJson.BookID,
                                    data: {
                                        CodeNumber: responseJson.BookID,
                                        OnewayReturn: oneway_return,
                                        StartDate: gotime,
                                        BackDate: oneway_return ? backtime : 'None',
                                        StartStation: StartstationText,
                                        ArriveStation: EndstationText,
                                        StartTime: Tickinfo[1],
                                        ArriveTime: Tickinfo[2],
                                        Order: Tickinfo[0],
                                        BackStartTime: oneway_return ? BackTickinfo[1] : 'None',
                                        BackArriveTime: oneway_return ? BackTickinfo[2] : 'None',
                                        BackOrder: BackTickinfo[0],
                                        Type:TypeText,
                                        TotalText:TicketsToText(Tickets,oneway_return),
                                        TotalPrice:Allprices,
                                        StationsBy:Tickinfo[3],
                                        BackStationsBy:BackTickinfo[3],
                                        NumOfTickets:Tickets,
                                        Prices:Prices,
                                        Tickets:d1,
                                        BackTickets:d2,
                                    },
                                    expires: null,
                                });
                                setPayOrUseIndex(BookedDatas.length);
                                setStarted(true);
                                setLoadingVisible(false);
                                setPayticketVisible(true);
                                setCheck(false);
                                Alert.alert('大笨蛋', '恭喜你已訂位成功');
                            } else {
                                Alert.alert('大笨蛋', '該時段車位已被訂光!');
                                setLoadingVisible(false);
                                setCheck(false);
                            }
                            console.log('Complete!');
                        }
                        catch (e) {
                            console.log(e);
                            Alert.alert('大笨蛋','後端出現問題!');
                            setLoadingVisible(false);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        setCheck(false);
                        Alert.alert('大笨蛋', '某些問題出錯 請重新操作謝謝!');
                    });
                setCheck(false);
                setDetailsVisible(false);
                setBook(false);
            }
        }
    },[Book]);

    async function completeselecteditday(){
        let s=day.substring(0,10);
        setDateOfEdit(s);
        const data = {
            'StartStation': CopyTicketInfo.StartStation.toString(),
            'ArriveStation': CopyTicketInfo.ArriveStation.toString(),
            'StartTime': backType(DateOfEdit).toString(),
            'Type': CopyTicketInfo.Type.toString(),
            'Tickets': CopyTicketInfo.NumOfTickets.toString(),
        };
        console.log('Data Sent!');
        console.log('Data:',data);
        fetch(apiurl + '/GetEditDatas/', {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('Data Get!')
                console.log('Data:',responseJson);
                console.log('Data Set!');
                try {
                    setAllprices(CopyTicketInfo.TotalPrice);
                    let s = 0, fees = [0, 0, 0, 0, 0];
                    CopyTicketInfo.NumOfTickets.map((item, index) => {
                        s += item;
                        fees[index] += item * 20;
                        if (CopyTicketInfo.OnewayReturn) {
                            s += item;
                            fees[index] += item * 20;
                        }
                    })
                    setAllFees(20 * s);
                    setPrices(CopyTicketInfo.Prices);
                    setFees(fees);
                    setdatas(responseJson.Datas);
                    setEditTrains(true);
                    setEditDateVisible(false);
                    console.log('Complete!');
                }
                catch (e) {
                    console.log(e)
                    Alert.alert('大笨蛋', '後端出現問題!');
                }
            })
            .catch((error) => {
                Alert.alert('大笨蛋', '某些問題出錯 請重試!');
                console.error(error);
                setEditVisible(true);
                setEditDateVisible(false);
            });
    };

    async function paying(index){
        let copydata=BookedDatas[index];
        const data={
            'BookID':BookedDatas[index].CodeNumber,
        };
        console.log('Data Sent!');
        console.log('Data:',data);
        fetch(apiurl+'/Pay/',{method:'POST',headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },body:JSON.stringify(data)})
            .then((response) => response.json())
            .then(async (responseJson) => {
                console.log('Data Get!');
                console.log('Data:',responseJson);
                console.log('Data Set');
                try{
                    if (responseJson.Status === 'True') {
                        await storage.save({
                            key: 'PaidTicket', // 注意:请不要在key中使用_下划线符号!
                            id:BookedDatas[index].CodeNumber,
                            data: copydata,
                            expires: null,
                        });
                        setStarted(true);
                        setPayticketVisible(false);
                        Alert.alert('大笨蛋', '付款成功!');
                    } else {
                        setPayticketVisible(false);
                        setStarted(true);
                        Alert.alert('大笨蛋', '該訂單不存在 請重新訂購!');
                    }
                    await storage.remove({key: 'BookedTicket', id: BookedDatas[index].CodeNumber});
                    console.log('Complete!');
                }
                catch (e) {
                    console.log(e)
                    Alert.alert('大笨蛋', '後端出現問題!');
                }

            })
            .catch((error) => {
                setPayticketVisible(false);
                console.error(error);
                Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
            })

    };

    async function using(index){
        const data={
            'BookID':YourTickets[index].CodeNumber,
            'OnewayReturn':YourTickets[index].OnewayReturn,
            'Order':YourTickets[index].Order,
            'Seat':YourTickets[index].Tickets[0].Position,
            'ArriveOrder':YourTickets[index].OnewayReturn?YourTickets[index].BackOrder:'None',
            'ArriveSeat':YourTickets[index].OnewayReturn?YourTickets[index].BackTickets[0].Position:'None',
        };
        console.log('Data Sent!');
        console.log('Data:',data);
        fetch(apiurl+'/Use/',{method:'POST',headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },body:JSON.stringify(data)})
            .then((response) => response.json())
            .then(async (responseJson) => {
                console.log('Data Get!');
                console.log('Data:',responseJson);
                console.log('Data Set!');
                try{
                    setStarted(true);
                    if (responseJson.Status === 'True') {
                        setPayticketVisible(false);
                        Alert.alert('大笨蛋', '使用成功!');
                        if(responseJson.Out==='True'){
                            await storage.save({
                                key: 'UsedTicket', // 注意:请不要在key中使用_下划线符号!
                                id:YourTickets[index].CodeNumber+YourTickets[index].Tickets.Position,
                                data: YourTickets[index],
                                expires: null,
                            });
                            await storage.remove({key:'Ticket',id:YourTickets[index].CodeNumber+YourTickets[index].Tickets[0].Position});
                            setStarted(true);
                        }
                    } else {
                        setPayticketVisible(false);
                        Alert.alert('大笨蛋', '該車票不存在 請重新訂購!');
                        await storage.remove({key:'Ticket',id:YourTickets[index].CodeNumber+YourTickets[index].Tickets[0].Position});
                        setStarted(true);
                    }
                    console.log('Complete!');
                }
                catch (e) {
                    console.log(e)
                    Alert.alert('大笨蛋', '後端出現問題!');
                }
            })
            .catch((error) => {
                setPayticketVisible(false);
                console.error(error);
                Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
            });
    };

    const editnow=()=>{
        if(!Check){
            Alert.alert('大笨蛋','同意選項未勾選\n請勾選同意選項以進行後續動作。')
        }
        else{
            const data={
                'BookID':CopyTicketInfo.CodeNumber,
                'StartDate': CopyTicketInfo.Start.Date.toString(),
                'BackDate': CopyTicketInfo.Arrive.Date.toString(),
                'StartTime': CopyTicketInfo.Start.StartTime.toString(),
                'ArriveTime': CopyTicketInfo.Start.ArriveTime.toString(),
                'BackStartTime': CopyTicketInfo.OnewayReturn ? CopyTicketInfo.Arrive.StartTime.toString() : 'None',
                'BackArriveTime': CopyTicketInfo.OnewayReturn ? CopyTicketInfo.Arrive.ArriveTime.toString() : 'None',
                'Order': CopyTicketInfo.Start.Order.toString(),
                'BackOrder': CopyTicketInfo.OnewayReturn ? CopyTicketInfo.Arrive.Order.toString() : 'None',
                'Tickets':CopyTicketInfo.NumOfTickets.toString(),
            };
            console.log('Data Sent!');
            console.log('Data:',data);
            fetch(apiurl+'/Edit/',{method:'POST',headers:{
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },body:JSON.stringify(data)})
                .then((response) => response.json())
                .then(async (responseJson) => {
                    console.log('Data Get!');
                    console.log('Data:',responseJson);
                    console.log('Data Set!');
                    try{
                        if (responseJson.Status === 'True') {
                            let index=0;
                            let d1 = new Array();
                            let d2 = new Array();
                            for (var i = 0; i < 5; i++) {
                                for (var j = 0; j < CopyTicketInfo.NumOfTickets[i]; j++) {
                                    d1 = d1.concat(
                                        {
                                            'Type': CopyTicketInfo.Start.Tickets[index].Type,
                                            'Position': responseJson.Seat[i][j],
                                            'Price': Prices[i] / CopyTicketInfo.NumOfTickets[i]
                                        }
                                    );
                                    index++;
                                }
                            }
                            index=0;
                            if (CopyTicketInfo.OnewayReturn) {
                                for (var i = 0; i < 5; i++) {
                                    for (var j = 0; j < CopyTicketInfo.NumOfTickets[i]; j++) {
                                        d2 = d2.concat(
                                            {
                                                'Type': CopyTicketInfo.Arrive.Tickets[index].Type,
                                                'Position': responseJson.BackSeat[i][j],
                                                'Price': Prices[i] / CopyTicketInfo.NumOfTickets[i]
                                            }
                                        );
                                        index++;
                                    }
                                }
                            }
                            if(!CopyTicketInfo.BussinessState){
                                await storage.save({
                                    key: 'BookedTicket', // 注意:请不要在key中使用_下划线符号!
                                    id: CopyTicketInfo.CodeNumber,
                                    data: {
                                        CodeNumber: CopyTicketInfo.CodeNumber,
                                        OnewayReturn: CopyTicketInfo.OnewayReturn,
                                        StartDate: CopyTicketInfo.Start.Date,
                                        BackDate: CopyTicketInfo.OnewayReturn ? CopyTicketInfo.Arrive.Date : 'None',
                                        StartStation: CopyTicketInfo.StartStation,
                                        ArriveStation: CopyTicketInfo.ArriveStation,
                                        StartTime: CopyTicketInfo.Start.StartTime,
                                        ArriveTime: CopyTicketInfo.Start.ArriveTime,
                                        Order: CopyTicketInfo.Start.Order,
                                        BackStartTime: CopyTicketInfo.OnewayReturn ? CopyTicketInfo.Arrive.StartTime : 'None',
                                        BackArriveTime: CopyTicketInfo.OnewayReturn ? CopyTicketInfo.Arrive.ArriveTime : 'None',
                                        BackOrder: CopyTicketInfo.Arrive.Order,
                                        Type:CopyTicketInfo.Type,
                                        TotalText:CopyTicketInfo.TotalText,
                                        TotalPrice:Allprices,
                                        StationsBy:CopyTicketInfo.Start.StationsBy,
                                        BackStationsBy:CopyTicketInfo.Arrive.StationsBy,
                                        NumOfTickets:CopyTicketInfo.NumOfTickets,
                                        Prices:Prices,
                                        Tickets:d1,
                                        BackTickets:d2,
                                    },
                                    expires: null,
                                });
                            }
                            else{
                                await storage.save({
                                    key: 'Ticket', // 注意:请不要在key中使用_下划线符号!
                                    id: CopyTicketInfo.CodeNumber,
                                    data: {
                                        CodeNumber: CopyTicketInfo.CodeNumber,
                                        OnewayReturn: CopyTicketInfo.OnewayReturn,
                                        StartDate: CopyTicketInfo.Start.Date,
                                        BackDate: CopyTicketInfo.OnewayReturn ? CopyTicketInfo.Arrive.Date : 'None',
                                        StartStation: CopyTicketInfo.StartStation,
                                        ArriveStation: CopyTicketInfo.ArriveStation,
                                        StartTime: CopyTicketInfo.Start.StartTime,
                                        ArriveTime: CopyTicketInfo.Start.ArriveTime,
                                        Order: CopyTicketInfo.Start.Order,
                                        BackStartTime: CopyTicketInfo.OnewayReturn ? CopyTicketInfo.Arrive.StartTime : 'None',
                                        BackArriveTime: CopyTicketInfo.OnewayReturn ? CopyTicketInfo.Arrive.ArriveTime : 'None',
                                        BackOrder: CopyTicketInfo.Arrive.Order,
                                        Type:CopyTicketInfo.Type,
                                        TotalText:CopyTicketInfo.TotalText,
                                        TotalPrice:Allprices,
                                        StationsBy:CopyTicketInfo.Start.StationsBy,
                                        BackStationsBy:CopyTicketInfo.Arrive.StationsBy,
                                        NumOfTickets:CopyTicketInfo.NumOfTickets,
                                        Prices:Prices,
                                        Tickets:d1,
                                        BackTickets:d2,
                                    },
                                    expires: null,
                                });
                            }
                            setStarted(true);
                            setPayticketVisible(true);
                            setEditDetailsVisible(false);
                            CopyTicketInfo.Start.Tickets=d1;
                            CopyTicketInfo.Arrive.Tickets=d2;
                            CopyTicketInfo.TotalPrice=Allprices;
                            CopyTicketInfo.Prices=Prices;
                            setTicketDatas(CopyTicketInfo);
                            Alert.alert('大笨蛋', '修改成功!');
                            setCheck(false);
                        } else {
                            setEditDetailsVisible(false);
                            Alert.alert('大笨蛋', '出現錯誤 請重新修改!');
                            setCheck(false);
                        }
                        console.log('Complete!');
                    }
                    catch (e) {
                        console.log(e)
                        Alert.alert('大笨蛋', '後端出現問題!');
                    }
                })
                .catch((error) => {
                    setEditDetailsVisible(false);
                    console.error(error);
                    Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
                    setCheck(false);
                });
        }
    };

    const refundnow=async () => {
        if (!Check) {
            Alert.alert('大笨蛋', '同意選項未勾選\n請勾選同意選項以進行後續動作。')
        } else {
            let Datas = []
            for (var i = 0; i < TicketDatas.Start.Tickets.length; i++) {
                Datas=Datas.concat([[TicketDatas.Start.Order, TicketDatas.Start.Tickets[i].Position]]);
            }

            for (var i = 0; i < TicketDatas.Arrive.Tickets.length; i++) {
                Datas=Datas.concat([[TicketDatas.Arrive.Order, TicketDatas.Arrive.Tickets[i].Position]]);
            }
            const data = {
                'BookID': TicketDatas.CodeNumber,
                'Datas': Datas
            };
            console.log('Data Sent!');
            console.log('Data:', data);
            fetch(apiurl + '/Refund/', {
                method: 'POST', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    console.log('Data Get!');
                    console.log('Data:', responseJson);
                    console.log('Data Set!');
                    try {
                        if (responseJson.Status === 'True') {
                            if (!TicketDatas.BussinessState) {
                                await storage.remove({key: 'BookedTicket', id: TicketDatas.CodeNumber});
                            } else {
                                await storage.remove({key: 'Ticket', id: TicketDatas.CodeNumber});
                            }
                            setStarted(true);
                            setRefundDetailsVisible(false);
                            Alert.alert('大笨蛋', '退票成功!');
                            setCheck(false);
                        } else {
                            setRefundDetailsVisible(false);
                            Alert.alert('大笨蛋', '出現錯誤 請重新操作!');
                            setCheck(false);
                        }
                        console.log('Complete!');
                    } catch (e) {
                        console.log(e)
                        Alert.alert('大笨蛋', '後端出現問題!');
                    }
                })
                .catch((error) => {
                    setRefundDetailsVisible(false);
                    console.error(error);
                    Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
                    setCheck(false);
                });
        }
    };

    const loadticketnow=async (itemstate, item) => {
        if (itemstate) {
            Alert.alert('大笨蛋', '該票券已完成付費');
        } else {
            const data = {
                'ID': IdOfFind,
                'BookID':item.Code,
            };
            console.log('Data Sent!');
            console.log('Data:',data);
            fetch(apiurl + '/FindLose/', {
                method: 'POST', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('Data Get!');
                    console.log('Data:',responseJson);
                    console.log('Data Set!');
                    try{
                        if(responseJson.Status==='True') {
                            console.log(responseJson.Start.Seat);
                            let d1 = new Array();
                            let d2 = new Array();
                            for (var i = 0; i < 5; i++) {
                                for (var j = 0; j < responseJson.Tickets[i]; j++) {
                                    d1 = d1.concat(
                                        {
                                            'Type': TicketTypeName[i],
                                            'Position': responseJson.Start.Seat[i][j],
                                            'Price': responseJson.Prices[i] / responseJson.Tickets[i]
                                        }
                                    );
                                }
                            }
                            if (responseJson.OnewayReturn === 'True') {
                                for (var i = 0; i < 5; i++) {
                                    for (var j = 0; j < responseJson.Tickets[i]; j++) {
                                        d2 = d2.concat(
                                            {
                                                'Type': TicketTypeName[i],
                                                'Position': responseJson.Arrive.Seat[i][j],
                                                'Price': responseJson.Prices[i] / responseJson.Tickets[i]
                                            }
                                        );
                                    }
                                }
                            }
                            let s = 0;
                            for (var i = 0; i < 5; i++) {
                                s += responseJson.Prices[i];
                            }
                            storage.save({
                                key: 'BookedTicket', // 注意:请不要在key中使用_下划线符号!
                                id: item.Code,
                                data: {
                                    CodeNumber: item.Code,
                                    OnewayReturn: responseJson.OnewayReturn === 'True',
                                    StartDate: responseJson.Start.Date+' ('+chiness_weeksate[new Date(responseJson.Start.Date).getDay()]+')',
                                    BackDate: responseJson.OnewayReturn ? responseJson.Arrive.Date+' ('+chiness_weeksate[new Date(responseJson.Arrive.Date).getDay()]+')' : 'None',
                                    StartStation: responseJson.StartStation,
                                    ArriveStation: responseJson.ArriveStation,
                                    StartTime: responseJson.Start.StartTime,
                                    ArriveTime: responseJson.Start.ArriveTime,
                                    Order: responseJson.Start.Order,
                                    BackStartTime: responseJson.OnewayReturn ? responseJson.Arrive.StartTime : 'None',
                                    BackArriveTime: responseJson.OnewayReturn ? responseJson.Arrive.ArriveTime : 'None',
                                    BackOrder: responseJson.Arrive.Order,
                                    Type: responseJson.Type,
                                    TotalText: TicketsToText(responseJson.Tickets,responseJson.OnewayReturn),
                                    TotalPrice: s,
                                    StationsBy: responseJson.Start.StationsBy,
                                    BackStationsBy: responseJson.Arrive.StationsBy,
                                    NumOfTickets: responseJson.Tickets,
                                    Prices: responseJson.Prices,
                                    Tickets: d1,
                                    BackTickets: d2,
                                },
                                expires: null,
                            });
                            setStarted(true);
                            Alert.alert('大笨蛋','恭喜你 已匯入訂票資訊');
                            setFindDetailsVisible(false);
                        }
                        else{
                            Alert.alert('大笨蛋','查無資料 請檢查填入資訊');
                        }
                        console.log('Complete!');
                    }
                    catch (e) {
                        console.log(e)
                        Alert.alert('大笨蛋', '後端出現問題!');
                    }
                })
                .catch((error) => {
                    Alert.alert('大笨蛋', '某些問題出錯 請重試!');
                    console.error(error);
                });
        }
    };

    const getLoseTicket=()=>{
        if(GetTicketCode.length===0 || BookNumber.length===0){
            Alert.alert('大笨蛋','填入資訊不得為空!');
            return ;
        }
        const data = {
            'ID': GetTicketCode,
            'BookID':BookNumber,
        };
        console.log('Data Sent!');
        console.log('Data:',data);
        fetch(apiurl + '/FindLose/', {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('Data Get!');
                console.log('Data:',responseJson);
                console.log('Data Set!');
                try{
                    if(responseJson.Status==='True') {
                        let d1 = new Array();
                        let d2 = new Array();
                        for (var i = 0; i < 5; i++) {
                            for (var j = 0; j < responseJson.Tickets[i]; j++) {
                                d1 = d1.concat(
                                    {
                                        'Type': TicketTypeName[i],
                                        'Position': responseJson.Start.Seat[i][j],
                                        'Price': responseJson.Prices[i] / responseJson.Tickets[i]
                                    }
                                );
                            }
                        }
                        if (responseJson.OnewayReturn === 'True') {
                            for (var i = 0; i < 5; i++) {
                                for (var j = 0; j < responseJson.Tickets[i]; j++) {
                                    d2 = d2.concat(
                                        {
                                            'Type': TicketTypeName[i],
                                            'Position': responseJson.Arrive.Seat[i][j],
                                            'Price': responseJson.Prices[i] / responseJson.Tickets[i]
                                        }
                                    );
                                }
                            }
                        }
                        let s = 0;
                        for (var i = 0; i < 5; i++) {
                            s += responseJson.Prices[i];
                        }
                        storage.save({
                            key: 'BookedTicket', // 注意:请不要在key中使用_下划线符号!
                            id: BookNumber,
                            data: {
                                CodeNumber: BookNumber,
                                OnewayReturn: responseJson.OnewayReturn === 'True',
                                StartDate: responseJson.Start.Date+' ('+chiness_weeksate[new Date(responseJson.Start.Date).getDay()]+')',
                                BackDate: responseJson.OnewayReturn ? responseJson.Arrive.Date+' ('+chiness_weeksate[new Date(responseJson.Arrive.Date).getDay()]+')' : 'None',
                                StartStation: responseJson.StartStation,
                                ArriveStation: responseJson.ArriveStation,
                                StartTime: responseJson.Start.StartTime,
                                ArriveTime: responseJson.Start.ArriveTime,
                                Order: responseJson.Start.Order,
                                BackStartTime: responseJson.OnewayReturn ? responseJson.Arrive.StartTime : 'None',
                                BackArriveTime: responseJson.OnewayReturn ? responseJson.Arrive.ArriveTime : 'None',
                                BackOrder: responseJson.Arrive.Order,
                                Type: responseJson.Type,
                                TotalText: TicketsToText(responseJson.Tickets,responseJson.OnewayReturn),
                                TotalPrice: s,
                                StationsBy: responseJson.Start.StationsBy,
                                BackStationsBy: responseJson.Arrive.StationsBy,
                                NumOfTickets: responseJson.Tickets,
                                Prices: responseJson.Prices,
                                Tickets: d1,
                                BackTickets: d2,
                            },
                            expires: null,
                        });
                        setFindDetailsVisible(false);
                        setStarted(true);
                        Alert.alert('大笨蛋','恭喜你 已匯入訂票資訊');
                    }
                    else{
                        Alert.alert('大笨蛋','查無資料 請檢查填入資訊');
                        setFindDetailsVisible(false);
                    }
                    console.log('Complete!');
                }
                catch (e) {
                    console.log(e)
                    Alert.alert('大笨蛋', '後端出現問題!');
                }
            })
            .catch((error) => {
                setFindDetailsVisible(false);
                Alert.alert('大笨蛋', '某些問題出錯 請重試!');
                console.error(error);
            });
    };

    const getTimeTable=()=>{
        const data = {
            'StartStation': StartstationText.toString(),
            'ArriveStation': EndstationText.toString(),
            'StartTime': TableTimeText.toString()
        };
        console.log('Data Sent!');
        console.log('Data:',data);
        fetch(apiurl + '/TimeTable/', {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('Data Get!');
                console.log('Data:',responseJson);
                console.log('Data Set!');
                try{
                    setTableData(responseJson.Datas);
                    setTableVisible(true);
                    settimetable(false);
                    console.log('Complete!');
                }
                catch (e) {
                    console.log(e)
                    Alert.alert('大笨蛋', '後端出現問題!');
                }
            })
            .catch((error) => {
                Alert.alert('大笨蛋', '某些問題出錯 請重試!');
                console.error(error);
            });
    };

    const getLoseCode=()=>{
        if(OrderOfFind.length===0 || IdOfFind.length===0){
            Alert.alert('大笨蛋','請注意\n請確認您輸入的資料是否正確，並請重新輸入。');
        }
        else{
            const data={
                'StartStation':StartstationText,
                'ArriveStation':EndstationText,
                'StartTime':FindTimeText,
                'Order':OrderOfFind,
                'ID':IdOfFind,
            };
            console.log('Data Sent!');
            console.log('Data:',data);
            fetch(apiurl+'/FindCode/',{method:'POST',headers:{
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },body:JSON.stringify(data)})
                .then((response) => response.json())
                .then(async (responseJson) => {
                    console.log('Data Get!');
                    console.log('Data:',responseJson);
                    console.log('Data Set!');
                    try{
                        if(responseJson.Status==='True') {
                            await setFindOfDatas(responseJson.Datas);
                            setFindDetailsVisible(true);
                            setfindcodeVisible(false);
                            Alert.alert('大笨蛋', '查詢成功!');
                        } else {
                            Alert.alert('大笨蛋','請注意 無資料\n請確認您輸入的資料是否正確，並請重新輸入。');
                        }
                        console.log('Complete!');
                    }
                    catch (e) {
                        console.log(e)
                        Alert.alert('大笨蛋', '後端出現問題!');
                    }

                })
                .catch((error) => {
                    console.error(error);
                    Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
                });
        }
    }

//---------------------------------------------Normal function---------------------------------------------//
    const cancelOnload=()=>{
        setLoadingVisible(false);
        setcomplete(false);
    };

    function switchType(text){
        let s='';
        let t=text.substring(0,10);
        t.split('/').map((item,index)=>{
            if(index!==2){
                s+=item+'-';
            }
            else{
                s+=item;
            }
        });
        return s.substring(0,10);
    };

    function backType(text){
        let s='';
        let t=text.substring(0,10);
        t.split('-').map((item,index)=>{
            if(index!==2){
                s+=item+'/';
            }
            else{
                s+=item;
            }
        });
        return s.substring(0,10);
    };

    async function completeselectday(){
        if(Gostate){
            if(day===getToday()){
                if(Number(hm.substring(0,2))<Number(HourAndMin.substring(0,2))){
                    Alert.alert('大笨蛋','時間錯誤 不得早於當前時間!');
                    let s=TimeText;
                    setday(s.substring(0,10));
                    setSelectedDate(s.substring(0,10)+' '+s.substring(15,20));
                    setbackminDate(s.substring(0,10)+' '+s.substring(15,20));
                    setSelectDateMode(false);
                    return ;
                }
                else if(Number(hm.substring(0,2))===Number(HourAndMin.substring(0,2))){
                    if(Number(hm.substring(3,5))<Number(HourAndMin.substring(3,5))){
                        Alert.alert('大笨蛋','時間錯誤 不得早於當前時間!');
                        let s=TimeText;
                        setday(s.substring(0,10));
                        setSelectedDate(s.substring(0,10)+' '+s.substring(15,20));
                        setbackminDate(s.substring(0,10)+' '+s.substring(15,20));
                        setSelectDateMode(false);
                        return ;
                    }
                }
            }
            let date=new Date(switchType(day));
            setTimeText(day+' ('+chiness_weeksate[date.getDay()]+') '+hm);
            let s=day.substring(0,10);
            s=s+' '+hm;
            setSelectedDate(s);
            setbackminDate(s);
            setSelectDateMode(false);
            if(BackTimeText!=='請選擇回程時間') {
                let d = new Date(switchType(BackTimeText.substring(0,10)));
                if(date>d){
                    setBackTimeText('請選擇回程時間');
                }
                else if(date>=d && date<=d){
                    let a=hm.split(':');
                    let b=BackTimeText.substring(15,20).split(':');
                    if(d.setHours(a[0],a[1])>d.setHours(b[0],b[1])){
                        setBackTimeText('請選擇回程時間');
                    }
                }
            }
        }
        else{
            let date=new Date(switchType(day));
            setBackTimeText(day+' ('+chiness_weeksate[date.getDay()]+') '+hm);
            let s=day.substring(0,10);
            s=s+' '+hm;
            setSelectedDate(s);
            setSelectDateMode(false);
            if(TimeText.substring(0,10)===day) {
                let d=new Date();
                let a = hm.split(':');
                let b = TimeText.substring(15, 20).split(':');
                if(d.setHours(a[0],a[1])<d.setHours(b[0],b[1])){
                    Alert.alert('大笨蛋','回程時間不可小於去程時間\n請重新選擇!');
                    setBackTimeText('請選擇回程時間');
                }
            }
        }
    };

    async function completeselectfindday(){
        setFindTimeText(day);
        let s=day.substring(0,10);
        setDateOfFind(s);
        setfindcodeVisible(true);
        setFindDateVisible(false);
    };

    async function completeselecttableday(){
        setTableTimeText(day);
        let s=day.substring(0,10);
        setDateOfTable(s);
        settimetable(true);
        setTableDateVisible(false);
    };

    const switchStation=()=>{
        let tmp=EndstationText;
        setEndstationText(StartstationText);
        setStartstationText(tmp);
    };

    const StartStationPress=()=>{
        setIsStart(true);
        setStations(StartStation);
    };

    const EndStationPress=()=>{
        setIsStart(false);
        setStations(EndStation);
    };

    const SetTargetStation=(index)=>{
        if(IsStart){
            if(index===EndStation){
                Alert.alert('大笨蛋','您選擇之起/訖車站相同，請重新輸入');
                return;
            }
            setStartstationText(Stations_Name[index]);
            setStations(index);
            setStartStation(index);
        }
        else{
            if(index===StartStation){
                Alert.alert('大笨蛋','您選擇之起/訖車站相同，請重新輸入');
                return;
            }
            setEndstationText(Stations_Name[index]);
            setStations(index);
            setEndStation(index);
        }
    };

    const TypeChoose=(index)=>{
        if(index===0){
            setTypeText('標準車廂');
        }
        else if(index===1){
            setTypeText('商務車廂');
            if(Tickets[4]!==0){
                Tickets[4]=0;
                setTickets(Tickets);
                countTicket();
            }
        }
    };

    const setTicketNumber=(index,mode)=>{
        let TicketsCopy = [...Tickets];
        var sum=0;
        TicketsCopy.map((value)=>{
            sum+=value;
        });
        if(mode==='plus'){
            if(sum<10){
                TicketsCopy[index]+=1;
            }
        }
        else{
            if(TicketsCopy[index]>0) {
                TicketsCopy[index] -= 1;
            }
        }
        setTickets(TicketsCopy);
    };

    const countTicket=()=>{
        let s=new String();
        var sum=0;
        Tickets.map((item,index)=>{
            sum+=item;
            if(item!==0){
                if(s.length!==0){
                    s=s.concat(', ');
                }
                s=s.concat(TicketTypeName[index]+'*'+item.toString());
            }
        });
        if(s.length===0){
            Alert.alert('大笨蛋','每次訂位至少選擇一位乘客');
        }
        else{
            setsumTickets(sum);
            setAllticketText(s);
            setTicketsVisible(false);
        }
    };

    const setPre=(index)=>{
        if(index===0){
            setPreText('無偏好');
        }
        else if(index===1){
            setPreText('靠窗優先');
        }
        else if(index===2){
            setPreText('靠走道優先');
        }
    };

    const one_way_ticket = () => {
        if(!expanded){
            return ;
        }
        setExpanded(!expanded);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    };

    const return_ticket = () => {
        if(expanded){
            return ;
        }
        setExpanded(!expanded);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    };

    const changeGender=(index)=>{
        if(index===0){
            setGender(true);
        }
        else{
            setGender(false);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    }

    const goedit=(index)=>{
        setEditCall(true);
        if(editstate){
            let d=CopyTicketInfo;
            d.Start.Date=backType(DateOfEdit)+' ('+chiness_weeksate[new Date(DateOfEdit).getDay()]+')';
            d.Start.StartTime=datas[index].StartTime;
            d.Start.ArriveTime=datas[index].ArriveTime;
            d.Start.Order=datas[index].Order;
            d.Start.StationsBy=datas[index].StationsBy;
            setCopyTicketInfo(d);
        }
        else{
            let d=CopyTicketInfo;
            d.Arrive.Date=backType(DateOfEdit)+' ('+chiness_weeksate[new Date(DateOfEdit).getDay()]+')';
            d.Arrive.StartTime=datas[index].StartTime;
            d.Arrive.ArriveTime=datas[index].ArriveTime;
            d.Arrive.Order=datas[index].Order;
            d.Arrive.StationsBy=datas[index].StationsBy;
            setCopyTicketInfo(d);
        }
        setEditVisible(true);
        setEditTrains(false);
    };

    const gobook=(index)=>{
        setTickinfo([datas[index].Order,datas[index].StartTime,datas[index].ArriveTime,datas[index].StationsBy]);
        if(oneway_return){
            setBackBookVisible(true);
            setBookVisible(false);
        }
        else{
            setIDcheckVisible(true);
            setBookVisible(false);
        }
    };

    const backbook=(index)=>{
        if(gotime===backtime){
            if(Number(Tickinfo[2].substring(0,2))>Number(backdatas[index].StartTime.substring(0,2))){
                Alert.alert('大笨蛋','回程出發時間不得早於出發抵達時間!');
                return;
            }
            else if (Number(Tickinfo[2].substring(0,2))===Number(backdatas[index].StartTime.substring(0,2))){
                Alert.alert('大笨蛋','回程出發時間不得早於出發抵達時間!');
                return;
            }
        }
        setBackTickinfo([backdatas[index].Order,backdatas[index].StartTime,backdatas[index].ArriveTime,backdatas[index].StationsBy]);
        setIDcheckVisible(true);
        setBackBookVisible(false);
    };

    const LoadTicketIn=(index,status)=>{
        setPayOrUseIndex(index);
        let d=status?YourTickets:BookedDatas;
        setTicketDatas({
            'CodeNumber': d[index].CodeNumber,
            'BussinessState': status,
            'OnewayReturn': d[index].OnewayReturn,
            'Type': d[index].Type,
            'TotalText': d[index].TotalText,
            'TotalPrice': d[index].TotalPrice,
            'StartStation': d[index].StartStation,
            'ArriveStation': d[index].ArriveStation,
            'NumOfTickets':d[index].NumOfTickets,
            'Prices':d[index].Prices,
            'Start': {
                'Date': d[index].StartDate,
                'StartTime': d[index].StartTime,
                'ArriveTime': d[index].ArriveTime,
                'Order': d[index].Order,
                'StationsBy': d[index].StationsBy,
                'Tickets': d[index].Tickets
            },
            'Arrive': {
                'Date': d[index].BackDate,
                'StartTime': d[index].BackStartTime,
                'ArriveTime': d[index].BackArriveTime,
                'Order': d[index].BackOrder,
                'StationsBy': d[index].BackStationsBy,
                'Tickets': d[index].BackTickets
            }
        });
        setPayticketVisible(true);
    };

    const LoadPaidTicketIn=(index,status)=>{
        setPayOrUseIndex(index);
        let d=status?UsedTickets:PaidDatas;
        setTicketDatas({
            'CodeNumber': d[index].CodeNumber,
            'BussinessState': status,
            'OnewayReturn': d[index].OnewayReturn,
            'Type': d[index].Type,
            'TotalText': d[index].TotalText,
            'TotalPrice': d[index].TotalPrice,
            'StartStation': d[index].StartStation,
            'ArriveStation': d[index].ArriveStation,
            'NumOfTickets':d[index].NumOfTickets,
            'Prices':d[index].Prices,
            'Start': {
                'Date': d[index].StartDate,
                'StartTime': d[index].StartTime,
                'ArriveTime': d[index].ArriveTime,
                'Order': d[index].Order,
                'StationsBy': d[index].StationsBy,
                'Tickets': d[index].Tickets
            },
            'Arrive': {
                'Date': d[index].BackDate,
                'StartTime': d[index].BackStartTime,
                'ArriveTime': d[index].BackArriveTime,
                'Order': d[index].BackOrder,
                'StationsBy': d[index].BackStationsBy,
                'Tickets': d[index].BackTickets
            }
        });
        setPaidTicketVisible(true);
    };

    async function test(){
        await storage.clearMapForKey('BookedTicket');
        await storage.clearMapForKey('PaidTicket');
        await storage.clearMapForKey('Ticket');
        await storage.clearMapForKey('UsedTicket');
    };

    const cancelsettime=()=>{
        setSelectDateMode(!SelectDateMode);
        let s='';
        if(Gostate || BackTimeText==='請選擇回程時間'){
            s=TimeText;
        }
        else{
            s=BackTimeText;
        }
        setday(s.substring(0,10));
        sethm(s.substring(15,20));
    };

    const cancelsetfindtime=()=>{
        setfindcodeVisible(true);
        setFindDateVisible(false);
        let s=FindTimeText;
        setday(s.substring(0,10));
    };

    const cancelsetedittime=()=>{
        setEditVisible(true);
        setEditDateVisible(false);
    };

    const cancelsettabletime=()=>{
        settimetable(true);
        setTableDateVisible(false);
        let s=TableTimeText;
        setday(s.substring(0,10));
    };

    const getfromtext=(index)=>{
        if(index===0){
            setGostate(true);
        }
        else{
            setGostate(false);
        }
        let s=''
        if(index===0 || BackTimeText==='請選擇回程時間'){
            s=TimeText;
        }
        else{
            s=BackTimeText;
        }
        setday(s.substring(0,10));
        sethm(s.substring(15,20));
        setSelectedDate(s.substring(0,10)+' '+s.substring(15,20));
        setSelectDateMode(true);
    };

    async function setbeinit(){
        setSelectedDate(InitTime);
        let s=InitTime;
        setday(backType(s.substring(0,10)));
        sethm(s.substring(11,16));
        await setCalendarVisible(false);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setCalendarVisible(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    };

    async function setfindbeinit(){
        let s=InitTime.substring(0,10);
        setDateOfFind(s);
        setday(backType(s));
        await setCalendarVisible(false);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setCalendarVisible(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    };

    async function settablebeinit(){
        let s=InitTime.substring(0,10);
        setDateOfTable(s);
        setday(backType(s));
        await setCalendarVisible(false);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setCalendarVisible(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    };

    async function seteditbeinit(){
        let s=InitTime.substring(0,10);
        setDateOfEdit(s);
        setday(backType(s));
        await setCalendarVisible(false);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setCalendarVisible(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    };

    function TicketsToText(arr,state=false){
        let s=new String();
        arr.map((item,index)=>{
            if(item!==0){
                if(s.length!==0){
                    s=s.concat(', ');
                }
                if(state){
                    s=s.concat(TicketTypeName[index]+'*'+(Number(item)*2).toString());
                }
                else{
                    s=s.concat(TicketTypeName[index]+'*'+item.toString());
                }

            }
        });
        return s;
    };

    const getit=(status,index)=>{
        if(status){
            using(index);
        }
        else{
            paying(index);
        }
    }

    const distribute=async (status, index) => {
        if (status) {
            await storage.remove({key: 'UsedTicket', id: UsedTickets[index].CodeNumber+UsedTickets[index].Tickets.Position});
            setStarted(true);
            setPaidTicketVisible(false);
        }
        else {
            for(var i=0;i<TicketDatas.Start.Tickets.length;i++){
                let nt=[0,0,0,0,0];
                let ps=[0,0,0,0,0];
                if(TicketDatas.Start.Tickets[i].Type==='全票'){
                    nt[0]=1;
                    ps[0]=TicketDatas.OnewayReturn?Number(TicketDatas.Start.Tickets[i].Price)+Number(TicketDatas.Arrive.Tickets[i].Price):TicketDatas.Start.Tickets[i].Price;
                }
                else if(TicketDatas.Start.Tickets[i].Type==='孩童'){
                    nt[1]=1;
                    ps[1]=TicketDatas.OnewayReturn?Number(TicketDatas.Start.Tickets[i].Price)+Number(TicketDatas.Arrive.Tickets[i].Price):TicketDatas.Start.Tickets[i].Price;
                }
                else if(TicketDatas.Start.Tickets[i].Type==='敬老'){
                    nt[2]=1;
                    ps[2]=TicketDatas.OnewayReturn?Number(TicketDatas.Start.Tickets[i].Price)+Number(TicketDatas.Arrive.Tickets[i].Price):TicketDatas.Start.Tickets[i].Price;
                }
                else if(TicketDatas.Start.Tickets[i].Type==='愛心'){
                    nt[3]=1;
                    ps[3]=TicketDatas.OnewayReturn?Number(TicketDatas.Start.Tickets[i].Price)+Number(TicketDatas.Arrive.Tickets[i].Price):TicketDatas.Start.Tickets[i].Price;
                }
                else if(TicketDatas.Start.Tickets[i].Type==='大學生'){
                    nt[4]=1;
                    ps[4]=TicketDatas.OnewayReturn?Number(TicketDatas.Start.Tickets[i].Price)+Number(TicketDatas.Arrive.Tickets[i].Price):TicketDatas.Start.Tickets[i].Price;
                }
                const data={
                    "BookID": TicketDatas.CodeNumber,
                    "Datas": TicketDatas.OnewayReturn?[[TicketDatas.Start.Order,TicketDatas.Start.Tickets[i].Position],[TicketDatas.Arrive.Order,TicketDatas.Arrive.Tickets[i].Position]]:[[TicketDatas.Start.Order,TicketDatas.Start.Tickets[i].Position]]
                };
                console.log('Data Sent!');
                console.log('Data:',data);
                await fetch(apiurl+'/Take/',{method:'POST',headers:{
                        'Accept': 'application/json',
                        'Content-Type':'application/json'
                    },body:JSON.stringify(data)})
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        try {
                            console.log('Data Get!');
                            console.log('Data:', responseJson);
                            console.log('Data Set!')
                            if (responseJson.Status === 'True') {
                                await storage.save({
                                    key: 'Ticket', // 注意:请不要在key中使用_下划线符号!
                                    id:TicketDatas.CodeNumber+TicketDatas.Start.Tickets[i].Position,
                                    data: {
                                        CodeNumber: TicketDatas.CodeNumber,
                                        OnewayReturn: TicketDatas.OnewayReturn,
                                        StartDate: TicketDatas.Start.Date,
                                        BackDate: TicketDatas.Arrive.Date,
                                        StartStation: TicketDatas.StartStation,
                                        ArriveStation: TicketDatas.ArriveStation,
                                        StartTime: TicketDatas.Start.StartTime,
                                        ArriveTime: TicketDatas.Start.ArriveTime,
                                        Order: TicketDatas.Start.Order,
                                        BackStartTime: TicketDatas.Arrive.StartTime,
                                        BackArriveTime: TicketDatas.Arrive.ArriveTime,
                                        BackOrder: TicketDatas.Arrive.Order,
                                        Type:TicketDatas.Type,
                                        TotalText:TicketDatas.OnewayReturn?TicketDatas.Start.Tickets[i].Type+'*2':TicketDatas.Start.Tickets[i].Type+'*1',
                                        TotalPrice:TicketDatas.OnewayReturn?Number(TicketDatas.Start.Tickets[i].Price)+Number(TicketDatas.Arrive.Tickets[i].Price):TicketDatas.Start.Tickets[i].Price,
                                        StationsBy:TicketDatas.Start.StationsBy,
                                        BackStationsBy:TicketDatas.Arrive.StationsBy,
                                        NumOfTickets:nt,
                                        Prices:ps,
                                        Tickets:[TicketDatas.Start.Tickets[i]],
                                        BackTickets:[TicketDatas.Arrive.Tickets[i]],
                                    },
                                    expires: null,
                                });
                                console.log('Complete!');
                            } else {
                                Alert.alert('大笨蛋', '該車票已被取過了!');
                            }
                        }
                        catch (e) {
                            console.log(e)
                            Alert.alert('大笨蛋', '後端出現問題!');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
                    });
            }
            await storage.remove({key: 'PaidTicket', id: PaidDatas[index].CodeNumber});
            setStarted(true);
            setPaidTicketVisible(false);
            Alert.alert('大笨蛋','已完成分票程序!');
        }

    }

    const openurl=(index)=>{
        if(index===0){
            settimetable(true);
        }
        else if(index===1){
            setfindfare(true);
        }
        else if(index===2){
            setfindcodeVisible(true);
        }
        else if(index===3){
            setcautionsVisible(true);
        }
        else if(index===4){
            Linking.canOpenURL(ContractUrl);
            Linking.openURL(ContractUrl);
        }
        else if(index===5){
            test();
            setStarted(true);
            return ;
        }
        else if(index===6){
            Linking.canOpenURL(TexpressUrl);
            Linking.openURL(TexpressUrl);
        }
        else if(index===7){
            Linking.canOpenURL(HsrUrl);
            Linking.openURL(HsrUrl);
        }
        else if(index===8){
            Linking.canOpenURL(AppUrl);
            Linking.openURL(AppUrl);
        }
        else if(index===9){
            Linking.canOpenURL(TLifeUrl);
            Linking.openURL(TLifeUrl);
        }
    };

    const moneyManifest=(money)=>{
        let s=String(money);
        if(s.length>3){
            return s.substring(0,s.length-3)+','+s.substring(s.length-3,s.length);
        }
        return s;
    };

    const editit=(index)=>{
        if(index===0){
            seteditstate(true);
            setday(switchType(CopyTicketInfo.Start.Date));
            setDateOfEdit(switchType(CopyTicketInfo.Start.Date));
            setEditDateVisible(true);
            setEditVisible(false);
        }
        else{
            seteditstate(false);
            setday(switchType(CopyTicketInfo.Arrive.Date));
            setDateOfEdit(switchType(CopyTicketInfo.Arrive.Date));
            setEditDateVisible(true);
            setEditVisible(false);
        }
    };

    const editcheck=()=>{
        if (!EditCall){
            Alert.alert('大笨蛋','根本沒改嘛 哼');
        }
        else if(CopyTicketInfo.OnewayReturn){
            setEditCall(false);
            if((new Date(switchType(CopyTicketInfo.Start.Date))>new Date(switchType(CopyTicketInfo.Arrive.Date))) && (CopyTicketInfo.Start.Date!==CopyTicketInfo.Arrive.Date)){
                Alert.alert('大笨蛋','去程時間不能比回程時間晚!');
            }
            else if(CopyTicketInfo.Start.Date===CopyTicketInfo.Arrive.Date){
                if(Number(CopyTicketInfo.Start.ArriveTime.substring(0,2))<Number(CopyTicketInfo.Arrive.StartTime.substring(0,2))){
                    setEditDetailsVisible(true);
                    setEditVisible(false);
                }
                else if((Number(CopyTicketInfo.Start.ArriveTime.substring(0,2))===Number(CopyTicketInfo.Arrive.StartTime.substring(0,2)))){
                    if(Number(CopyTicketInfo.Start.ArriveTime.substring(3,5))<=Number(CopyTicketInfo.Arrive.StartTime.substring(3,5))){
                        Alert.alert('大笨蛋','去程時間不能比回程時間晚!');
                    }
                    else{
                        setEditDetailsVisible(true);
                        setEditVisible(false);
                    }
                }
                else{
                    Alert.alert('大笨蛋','去程時間不能比回程時間晚!');
                }
            }
            else{
                setEditDetailsVisible(true);
                setEditVisible(false);
            }

        }
        else{
            setEditCall(false);
            setEditDetailsVisible(true);
            setEditVisible(false);
        }
    };

    const getTotalTime=(start,arrive)=>{
        let hour=Number(arrive.substring(0,2))-Number(start.substring(0,2));
        let min=Number(arrive.substring(3,5))-Number(start.substring(3,5));
        if(min<0){
            hour-=1;
            min+=60;
        }
        return hour.toString()+'時'+(min<10?'0'+min.toString():min.toString())+'分';
    }

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const GetTicketFromQRCode=async (Data) => {
        console.log(Data);
        Alert.alert('大笨蛋','確認拿取\n訂位代號為:'+Data.CodeNumber+'\n種類為:'+Data.Tickets[0].Type+'的車票',
            [{text:'確認',onPress:async () => {
                    const data={
                        "BookID": Data.CodeNumber,
                        "Datas": Data.OnewayReturn?[[Data.Order,Data.Tickets[0].Position],[Data.BackOrder,Data.BackTickets[0].Position]]:[[Data.Order,Data.Tickets[0].Position]]
                    };
                    console.log('Data Sent!');
                    console.log('Data:',data);
                    fetch(apiurl+'/HasTake/',{method:'POST',headers:{
                            'Accept': 'application/json',
                            'Content-Type':'application/json'
                        },body:JSON.stringify(data)})
                        .then((response) => response.json())
                        .then(async (responseJson) => {
                            try {
                                if (responseJson.Status === 'False') {
                                    console.log('Data Get!');
                                    console.log('Data:', responseJson);
                                    console.log('Complete!');
                                    console.log('Data Sent!');
                                    console.log('Data:',data);
                                    fetch(apiurl+'/Take/',{method:'POST',headers:{
                                            'Accept': 'application/json',
                                            'Content-Type':'application/json'
                                        },body:JSON.stringify(data)})
                                        .then((response) => response.json())
                                        .then(async (responseJson) => {
                                            try {
                                                console.log('Data Get!');
                                                console.log('Data:', responseJson);
                                                if (responseJson.Status === 'True') {
                                                    console.log('Data Set!');
                                                    await storage.save({
                                                        key: 'Ticket', // 注意:请不要在key中使用_下划线符号!
                                                        id: Data.CodeNumber + Data.Tickets[0].Position,
                                                        data: Data,
                                                        expires: null,
                                                    });
                                                    setStarted(true);
                                                    Alert.alert('Ticket has benn saved!');
                                                    console.log('Complete!');
                                                } else {
                                                    Alert.alert('大笨蛋', '該車票已被取過了!');
                                                }
                                            }
                                            catch (e) {
                                                console.log(e)
                                                Alert.alert('大笨蛋', '後端出現問題!');
                                            }
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
                                        });
                                } else {
                                    Alert.alert('大笨蛋', '該車票已被取過了!');
                                }
                            }
                            catch (e) {
                                console.log(e)
                                Alert.alert('大笨蛋', '後端出現問題!');
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
                        });
                }},{text:'取消',onPress:()=>{return;}}])
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        try{
            console.log('Get QRcode!');
            let d=JSON.parse(data);
            console.log(d);
            GetTicketFromQRCode(d);
        }
        catch (e) {
            console.log(e);
        }
    };

    const GetQRCode=(index,num,Getindex)=>{
        if(num===0){
            return ;
        }
        else{
            let nt=[0,0,0,0,0];
            let ps=[0,0,0,0,0];
            nt[index]=1;
            ps[index]=TicketDatas.OnewayReturn?TicketDatas.Start.Tickets[Getindex-1].Price+TicketDatas.Arrive.Tickets[Getindex-1].Price:TicketDatas.Start.Tickets[Getindex-1].Price;
            let d={
                CodeNumber: TicketDatas.CodeNumber,
                OnewayReturn: TicketDatas.OnewayReturn,
                StartDate: TicketDatas.Start.Date,
                BackDate: TicketDatas.Arrive.Date,
                StartStation: TicketDatas.StartStation,
                ArriveStation: TicketDatas.ArriveStation,
                StartTime: TicketDatas.Start.StartTime,
                ArriveTime: TicketDatas.Start.ArriveTime,
                Order: TicketDatas.Start.Order,
                BackStartTime: TicketDatas.Arrive.StartTime,
                BackArriveTime: TicketDatas.Arrive.ArriveTime,
                BackOrder: TicketDatas.Arrive.Order,
                Type:TicketDatas.Type,
                TotalText:TicketDatas.OnewayReturn?TicketTypeName[index]+'*2':TicketTypeName[index]+'*1',
                TotalPrice:TicketDatas.OnewayReturn?TicketDatas.Start.Tickets[Getindex-1].Price+TicketDatas.Arrive.Tickets[Getindex-1].Price:TicketDatas.Start.Tickets[Getindex-1].Price,
                StationsBy:TicketDatas.Start.StationsBy,
                BackStationsBy:TicketDatas.Arrive.StationsBy,
                NumOfTickets:nt,
                Prices:ps,
                Tickets:[TicketDatas.Start.Tickets[Getindex-1]],
                BackTickets:[TicketDatas.Arrive.Tickets[Getindex-1]],
            }
            setQRCodeData(d);
            setQRCodeIndex([index,Getindex]);
            setQRCodeVisible(true);
            setPaidTicketVisible(false);
        }
    }

    const checkGot=()=>{
        const data={
            "BookID": QRCodeData.CodeNumber,
            "Datas": QRCodeData.OnewayReturn?[[QRCodeData.Order,QRCodeData.Tickets[0].Position],[QRCodeData.BackOrder,QRCodeData.BackTickets[0].Position]]:[[QRCodeData.Order,QRCodeData.Tickets[0].Position]]
        };
        console.log('Data Sent!');
        console.log('Data:',data);
        fetch(apiurl+'/HasTake/',{method:'POST',headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },body:JSON.stringify(data)})
            .then((response) => response.json())
            .then(async (responseJson) => {
                try {
                    console.log('Data Get!');
                    console.log('Data:',responseJson);
                    if (responseJson.Status === 'False') {
                        setPaidTicketVisible(true);
                        setQRCodeVisible(false);
                    } else {
                        let d=TicketDatas;
                        d.Start.Tickets.splice(QRCodeIndex[1]-1,1);
                        if(d.OnewayReturn){
                            d.Arrive.Tickets.splice(QRCodeIndex[1]-1,1);
                        }
                        if(d.Start.Tickets.length===0 && d.Arrive.Tickets.length===0){
                            await storage.remove({key:'PaidTicket',id:d.CodeNumber});
                            setStarted(true);
                            Alert.alert('大笨蛋','該車票已全部分出去!');
                            setQRCodeVisible(false);
                        }
                        else{
                            d.NumOfTickets[QRCodeIndex[0]]-=1;
                            d.Prices[QRCodeIndex[0]]-=QRCodeData.Prices[QRCodeIndex[0]]
                            d.TotalText=TicketsToText(d.NumOfTickets,d.OnewayReturn);
                            d.TotalPrice-=QRCodeData.TotalPrice;
                            let ds={
                                    CodeNumber: d.CodeNumber,
                                    OnewayReturn: d.OnewayReturn,
                                    StartDate: d.Start.Date,
                                    BackDate: d.Arrive.Date,
                                    StartStation: d.StartStation,
                                    ArriveStation: d.ArriveStation,
                                    StartTime: d.Start.StartTime,
                                    ArriveTime: d.Start.ArriveTime,
                                    Order: d.Start.Order,
                                    BackStartTime: d.Arrive.StartTime,
                                    BackArriveTime: d.Arrive.ArriveTime,
                                    BackOrder: d.Arrive.Order,
                                    Type:d.Type,
                                    TotalText:TicketsToText(d.NumOfTickets,d.OnewayReturn),
                                    TotalPrice:d.TotalPrice,
                                    StationsBy:d.Start.StationsBy,
                                    BackStationsBy:d.Arrive.StationsBy,
                                    NumOfTickets:d.NumOfTickets,
                                    Prices:d.Prices,
                                    Tickets:d.Start.Tickets,
                                    BackTickets:d.Arrive.Tickets,
                            }
                            await storage.save({
                                key: 'PaidTicket', // 注意:请不要在key中使用_下划线符号!
                                id:d.CodeNumber,
                                data: ds,
                                expires: null,
                            });
                            setTicketDatas(d);
                            setPaidTicketVisible(true);
                            setQRCodeVisible(false);
                            setStarted(true);
                        }
                    }
                }
                catch (e) {
                    console.log(e)
                    Alert.alert('大笨蛋', '後端出現問題!');
                }
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('大笨蛋', '出現些許錯誤 請重試!');
            });
    }

    return (
        <View style={[styles.container,{opacity:PaidTicketStationsByVisible || PaidTicketVisible||QRCodeVisible||QRTicketStationsByVisible||TableStationsByVisible || timetable || findfare || findcodeVisible ||TableDateVisible || TableVisible||ChooseStationVisible ||Gainfare|| FindDateVisible ||FindDetailsVisible||TrainsStationsByVisible ||EditDetailsVisible ||RefundDetailsVisible ||EditVisible ||EditTrains ||EditDateVisible ||PayticketVisible ||BookStationsByVisible ||BackBookStationsByVisible || PayTicketStationsByVisible ||EditVisible ||BookVisible||BackBookVisible||IDcheckVisible||DetailsVisible?0:1}]}>

            <View style={styles.hbox}>
                <Text style={styles.Htext}>高鐵訂票系統</Text>
                <View style={{position: 'absolute',top:'55%',left: '85%',width:'5%'}}>
                    <TouchableOpacity onPress={()=>{setInfoVisible(true);}}>
                        <Image source={require('./icons/user.png')} style={styles.user_image}></Image>
                    </TouchableOpacity>
                </View>
            </View>

            {/*loading view*/}
            {LoadingVisible &&(
                <View style={{position:'absolute',width:'100%',height:'100%',backgroundColor:'#FFFFFF',zIndex:999}}>
                    <Lottie source={require('./icons/chicken.json')} autoPlay loop speed={4}/>
                    <Text style={{alignSelf:'center',alignContent:'center',fontSize:25,justifyContent:'center',marginTop:'40%'}}>在努力加載中......</Text>
                    {(!Book) &&(
                        <TouchableOpacity style={{width:'80%',height:'5%',alignSelf:'center',alignContent:'center',justifyContent:'center',position:'absolute',marginTop:'5%',bottom:'10%',borderWidth:2,borderRadius:3,borderColor:'#D83714'}} onPress={cancelOnload}>
                            <Text style={{alignSelf:'center',alignContent:'center',textAlign:'center',textAlignVertical:'center',color:'#D83714',fontSize:20,fontWeight:'bold'}}>取消</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {Page===0 &&(
                <View style={[MyTicket_style.normal_view,{backgroundColor:((!TicketUse)&&YourTickets.length!==0)||((TicketUse)&&UsedTickets.length!==0)?'#D9D9D9':'#FFFFFF'}]}>
                    <View style={{flexDirection:'row',width:'100%'}}>
                        <TouchableOpacity style={{marginTop:'5%',flex:1,alignSelf:'center'}} onPress={()=>{if(TicketUse){setTicketUse(false);LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);}}}>
                            <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',fontSize:15,fontWeight:'bold'}}>未使用</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginTop:'5%',flex:1,alignSelf:'center'}} onPress={()=>{if(!TicketUse){setTicketUse(true);LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);}}}>
                            <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',fontSize:15,fontWeight:'bold'}}>已使用</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'100%',alignContent:'flex-start'}}>
                        <View style={{backgroundColor:'#D83714',height:3,width:'20%',borderRadius:5,marginLeft:TicketUse?'65%':'15%'}}></View>
                    </View>
                    {!TicketUse && (
                        YourTickets.length === 0 &&
                        (
                            <Image style={MyTicket_style.Noticket_img}
                                   source={require('./icons/No_ticket_have.png')}></Image>
                        )
                    )}
                    {TicketUse && (
                        UsedTickets.length === 0 &&
                        (
                            <Image style={MyTicket_style.Noticket_img}
                                   source={require('./icons/No_ticket_have.png')}></Image>
                        )
                    )}
                    {!TicketUse && (
                        YourTickets.length!==0 &&(
                            <ScrollView style={Paying_style.menu}>
                                {
                                    YourTickets.map((item,index)=>{
                                        return (
                                            <TouchableOpacity key={index} style={[Paying_style.cards,{height:item.OnewayReturn?300:150}]} onPress={()=>
                                                Alert.alert(
                                                    '大笨蛋',
                                                    '確定真的要使用嗎!',
                                                    [
                                                        {text: '確認', onPress: () => LoadTicketIn(index,true)},
                                                        {text: '取消' },
                                                    ])}>
                                                <View style={Paying_style.up}>
                                                    <Text style={Paying_style.code_text}>訂位編號</Text>
                                                    <Text style={Paying_style.ID_text}>{item.CodeNumber}</Text>
                                                    <Text style={Paying_style.no_paid_text}></Text>
                                                </View>
                                                {/*<View style={[styles.seg_line,{width:'100%'}]}></View>*/}
                                                <View style={Booking_style.tickets_view}>
                                                    <View style={{flex:1}}>
                                                        <Text>{item.OnewayReturn?'去程':'單程'} · {item.StartDate}</Text>
                                                    </View>
                                                    <View style={{flex:3,flexDirection:'row'}}>
                                                        <View style={Booking_style.up}>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={Booking_style.Stations_text}>{item.StartStation}</Text>
                                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.StartTime}</Text>
                                                            </View>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={Booking_style.order_text}>------></Text>
                                                                <Text style={Booking_style.order_text}>{item.Order}</Text>
                                                            </View>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{item.ArriveStation}</Text>
                                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.ArriveTime}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                {item.OnewayReturn===true && (
                                                    <View style={Booking_style.tickets_view}>
                                                        <View style={{flex:1}}>
                                                            <Text>回程 · {item.BackDate}</Text>
                                                        </View>
                                                        <View style={{flex:3,flexDirection:'row'}}>
                                                            <View style={Booking_style.up}>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={Booking_style.Stations_text}>{item.ArriveStation}</Text>
                                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.BackStartTime}</Text>
                                                                </View>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={Booking_style.order_text}>------></Text>
                                                                    <Text style={Booking_style.order_text}>{item.BackOrder}</Text>
                                                                </View>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{item.StartStation}</Text>
                                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.BackArriveTime}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    )}
                            </ScrollView>
                        )
                    )}
                    {TicketUse && (
                        UsedTickets.length!==0 &&(
                            <ScrollView style={Paying_style.menu}>
                                {
                                    UsedTickets.map((item,index)=>{
                                        return (
                                            <TouchableOpacity key={index} style={[Paying_style.cards,{height:item.OnewayReturn?300:150}]} onPress={()=>
                                                Alert.alert(
                                                    '大笨蛋',
                                                    '確定真的要查詢嗎!',
                                                    [
                                                        {text: '確認', onPress: () => LoadPaidTicketIn(index,true)},
                                                        {text: '取消' },
                                                    ])}>
                                                <View style={Paying_style.up}>
                                                    <Text style={Paying_style.code_text}>訂位編號</Text>
                                                    <Text style={Paying_style.ID_text}>{item.CodeNumber}</Text>
                                                    <Text style={Paying_style.no_paid_text}></Text>
                                                </View>
                                                {/*<View style={[styles.seg_line,{width:'100%'}]}></View>*/}
                                                <View style={Booking_style.tickets_view}>
                                                    <View style={{flex:1}}>
                                                        <Text>{item.OnewayReturn?'去程':'單程'} · {item.StartDate}</Text>
                                                    </View>
                                                    <View style={{flex:3,flexDirection:'row'}}>
                                                        <View style={Booking_style.up}>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={Booking_style.Stations_text}>{item.StartStation}</Text>
                                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.StartTime}</Text>
                                                            </View>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={Booking_style.order_text}>------></Text>
                                                                <Text style={Booking_style.order_text}>{item.Order}</Text>
                                                            </View>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{item.ArriveStation}</Text>
                                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.ArriveTime}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                {item.OnewayReturn===true && (
                                                    <View style={Booking_style.tickets_view}>
                                                        <View style={{flex:1}}>
                                                            <Text>回程 · {item.BackDate}</Text>
                                                        </View>
                                                        <View style={{flex:3,flexDirection:'row'}}>
                                                            <View style={Booking_style.up}>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={Booking_style.Stations_text}>{item.ArriveStation}</Text>
                                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.BackStartTime}</Text>
                                                                </View>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={Booking_style.order_text}>------></Text>
                                                                    <Text style={Booking_style.order_text}>{item.BackOrder}</Text>
                                                                </View>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{item.StartStation}</Text>
                                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.BackArriveTime}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    )}
                            </ScrollView>
                        )
                    )}
                </View>
            )}

            {Page===1 &&(
                <View style={styles.cbox}>
                    <View style={{width:'100%',flex:3,justifyContent:'flex-start', alignSelf:'center'}}>
                        <View style={{marginTop:'1%',alignSelf:'center',width:'50%',height:'60%',alignContent:'center',justifyContent:'space-between',flexDirection:'row'}}>
                            <View style={styles.circle}></View>
                            <Text style={styles.work_text}>全線正常營運</Text>
                        </View>
                        <View style={[styles.seg_line,{marginTop:'1%',height:1}]}></View>
                    </View>
                    <View style={[styles.chossen_bars,{flex: 3}]}>
                        <TouchableOpacity style={styles.station_choose} onPress={()=>{setStations(StartStation);setIsStart(true);setlocationtype(0);setChooseStationVisible(true);}}>
                            <Text style={styles.sation_start_end}>起程站</Text>
                            <Text style={styles.station}>{StartstationText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.return_oneway_frame} onPress={switchStation}>
                            <Image style={styles.return_oneway_img} source={expanded?require('./icons/return_ticket.png'):require('./icons/one_way_ticket.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.station_choose} onPress={()=>{setStations(EndStation);setIsStart(false);setlocationtype(0);setChooseStationVisible(true);}}>
                            <Text style={[styles.sation_start_end,{alignSelf:'flex-end'}]}>到達站</Text>
                            <Text style={[styles.station,{alignSelf:'flex-end'}]}>{EndstationText}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.chossen_bars]}>
                        <View style={styles.chosebg}>
                            <View style={[styles.move_bar,{left:expanded?'50%':'5%'}]}></View>
                            <TouchableOpacity onPress={one_way_ticket} style={{flex:1,alignItems:'center'}}>
                                <Text >單程票</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={return_ticket} style={{flex:1,alignItems:'center'}}>
                                <Text>去回票</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <TouchableOpacity style={styles.chossen_bars} onPress={()=>{getfromtext(0);}}>
                        <View style={styles.menu_icon_pos}>
                            <Image source={require('./icons/go_date.png')} style={styles.menu_icon}></Image>
                        </View>
                        <View style={styles.chossen_pos}>
                            <Text style={styles.chossen_title}>去程時間</Text>
                            <Text style={styles.chossen_text}>{TimeText}</Text>
                        </View>
                        <View style={styles.to_pos}>
                            <Image source={require('./icons/to.png')} style={styles.to_img}></Image>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.seg_line,{width: '90%',height:'0.2%'}]}></View>
                    {expanded && (
                        <TouchableOpacity style={styles.chossen_bars} onPress={()=>{getfromtext(1);}}>
                            <View style={styles.menu_icon_pos}>
                                <Image source={require('./icons/back_date.png')} style={styles.menu_icon}></Image>
                            </View>
                            <View style={styles.chossen_pos}>
                                <Text style={styles.chossen_title}>回程時間</Text>
                                <Text style={styles.chossen_text}>{BackTimeText}</Text>
                            </View>
                            <View style={styles.to_pos}>
                                <Image source={require('./icons/to.png')} style={styles.to_img}></Image>
                            </View>
                        </TouchableOpacity>
                    )}
                    {expanded && (
                        <View style={[styles.seg_line,{width: '90%',height:'0.2%'}]}></View>
                    )}
                    <TouchableOpacity style={styles.chossen_bars} onPress={() => setTypeVisible(true)}>
                        <View style={styles.menu_icon_pos}>
                            <Image source={require('./icons/train.png')} style={styles.menu_icon}></Image>
                        </View>
                        <View style={styles.chossen_pos}>
                            <Text style={styles.chossen_title}>車廂種類</Text>
                            <Text style={styles.chossen_text}>{TypeText}</Text>
                        </View>
                        <View style={styles.to_pos}>
                            <Image source={require('./icons/to.png')} style={styles.to_img}></Image>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.seg_line,{width: '90%',height:'0.2%'}]}></View>
                    <TouchableOpacity style={styles.chossen_bars} onPress={()=>{setcopyTickets(Tickets);setTicketsVisible(true);}}>
                        <View style={styles.menu_icon_pos}>
                            <Image source={require('./icons/people.png')} style={styles.menu_icon}></Image>
                        </View>
                        <View style={styles.chossen_pos}>
                            <Text style={styles.chossen_title}>乘客人數</Text>
                            <Text style={[styles.chossen_text,{maxWidth:'95%'}]}>{AllticketText}</Text>
                        </View>
                        <View style={styles.to_pos}>
                            <Image source={require('./icons/to.png')} style={styles.to_img}></Image>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.seg_line,{width: '90%',height:'0.2%'}]}></View>
                    {sumTickets===1 && (
                    <TouchableOpacity style={styles.chossen_bars} onPress={() => setModalVisible(true)}>
                        <View style={styles.menu_icon_pos}>
                            <Image source={require('./icons/seat.png')} style={styles.menu_icon}></Image>
                        </View>
                        <View style={styles.chossen_pos}>
                            <Text style={styles.chossen_title}>座位偏好</Text>
                            <Text style={styles.chossen_text}>{PreText}</Text>
                        </View>
                        <View style={styles.to_pos}>
                            <Image source={require('./icons/to.png')} style={styles.to_img}></Image>
                        </View>
                    </TouchableOpacity>)}
                    {sumTickets===1 && (
                    <View style={[styles.seg_line,{width: '90%',height:'0.2%'}]}></View>)}
                    <TouchableOpacity style={[styles.submit_btn,{flex:2,margin:'5%'}]}  onPress={()=>{setSearch(true);}}>
                    <Text style={styles.submit_text}>查詢</Text>
                </TouchableOpacity>
            </View>
            )}

            {Page===2 &&(
                <View style={[Paying_style.normal_view,{backgroundColor:((!PayOrTake)&&BookedDatas.length!==0)||((PayOrTake)&&PaidDatas.length!==0)?'#D9D9D9':'#FFFFFF'}] }>
                    <View style={{flexDirection:'row',width:'100%'}}>
                        <TouchableOpacity style={{marginTop:'5%',flex:1,alignSelf:'center'}} onPress={()=>{if(PayOrTake){setPayOrTake(false);LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);}}}>
                            <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',fontSize:15,fontWeight:'bold'}}>付款</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginTop:'5%',flex:1,alignSelf:'center'}} onPress={()=>{if(!PayOrTake){setPayOrTake(true);LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);}}}>
                            <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',fontSize:15,fontWeight:'bold'}}>取票</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'100%',alignContent:'flex-start'}}>
                        <View style={{backgroundColor:'#D83714',height:3,width:'20%',borderRadius:5,marginLeft:PayOrTake?'65%':'15%'}}></View>
                    </View>
                    {!PayOrTake && (
                        BookedDatas.length===0 &&(
                            <Image style={Paying_style.Noticket_img} source={require('./icons/No_ticket_pay.png')}></Image>
                        )
                    )}
                    {PayOrTake && (
                        PaidDatas.length===0 &&(
                            <Image style={Paying_style.Noticket_img} source={require('./icons/No_ticket_pay.png')}></Image>
                        )
                    )}
                    {!PayOrTake && (
                        BookedDatas.length!==0 &&(
                            <ScrollView style={Paying_style.menu}>
                                {
                                    BookedDatas.map((item,index)=>{
                                        return (
                                            <TouchableOpacity key={index} style={[Paying_style.cards,{height:item.OnewayReturn?300:150}]} onPress={()=>{
                                                Alert.alert(
                                                    '大笨蛋',
                                                    '確定真的要付款嗎!',
                                                    [
                                                        {text: '確認', onPress: () => LoadTicketIn(index,false)},
                                                        {text: '取消' },
                                                    ])}}>
                                                <View style={Paying_style.up}>
                                                    <Text style={Paying_style.code_text}>訂位編號</Text>
                                                    <Text style={Paying_style.ID_text}>{item.CodeNumber}</Text>
                                                    <Text style={Paying_style.no_paid_text}>未付款</Text>
                                                </View>
                                                {/*<View style={[styles.seg_line,{width:'100%'}]}></View>*/}
                                                <View style={Booking_style.tickets_view}>
                                                    <View style={{flex:1}}>
                                                        <Text>{item.OnewayReturn?'去程':'單程'} · {item.StartDate}</Text>
                                                    </View>
                                                    <View style={{flex:3,flexDirection:'row'}}>
                                                        <View style={Booking_style.up}>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={Booking_style.Stations_text}>{item.StartStation}</Text>
                                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.StartTime}</Text>
                                                            </View>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={Booking_style.order_text}>------></Text>
                                                                <Text style={Booking_style.order_text}>{item.Order}</Text>
                                                            </View>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{item.ArriveStation}</Text>
                                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.ArriveTime}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                {item.OnewayReturn===true && (
                                                    <View style={Booking_style.tickets_view}>
                                                        <View style={{flex:1}}>
                                                            <Text>回程 · {item.BackDate}</Text>
                                                        </View>
                                                        <View style={{flex:3,flexDirection:'row'}}>
                                                            <View style={Booking_style.up}>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={Booking_style.Stations_text}>{item.ArriveStation}</Text>
                                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.BackStartTime}</Text>
                                                                </View>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={Booking_style.order_text}>------></Text>
                                                                    <Text style={Booking_style.order_text}>{item.BackOrder}</Text>
                                                                </View>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{item.StartStation}</Text>
                                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.BackArriveTime}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    )}
                            </ScrollView>
                        )
                    )}
                    {PayOrTake && (
                        PaidDatas.length!==0 &&(
                            <ScrollView style={Paying_style.menu}>
                                {
                                    PaidDatas.map((item,index)=>{
                                        return (
                                            <TouchableOpacity key={index} style={[Paying_style.cards,{marginBottom:index===PaidDatas.length-1?'20%':0,height:item.OnewayReturn?300:150}]} onPress={()=>{
                                                Alert.alert(
                                                    '大笨蛋',
                                                    '確定真的要取票嗎!',
                                                    [
                                                        {text: '確認', onPress: () => LoadPaidTicketIn(index,false)},
                                                        {text: '取消' },
                                                    ])}}>
                                                <View style={Paying_style.up}>
                                                    <Text style={Paying_style.code_text}>訂位編號</Text>
                                                    <Text style={Paying_style.ID_text}>{item.CodeNumber}</Text>
                                                    <Text style={Paying_style.no_paid_text}>已付款</Text>
                                                </View>
                                                {/*<View style={[styles.seg_line,{width:'100%'}]}></View>*/}
                                                <View style={Booking_style.tickets_view}>
                                                    <View style={{flex:1}}>
                                                        <Text>{item.OnewayReturn?'去程':'單程'} · {item.StartDate}</Text>
                                                    </View>
                                                    <View style={{flex:3,flexDirection:'row'}}>
                                                        <View style={Booking_style.up}>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={Booking_style.Stations_text}>{item.StartStation}</Text>
                                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.StartTime}</Text>
                                                            </View>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={Booking_style.order_text}>------></Text>
                                                                <Text style={Booking_style.order_text}>{item.Order}</Text>
                                                            </View>
                                                            <View style={Booking_style.order_view}>
                                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{item.ArriveStation}</Text>
                                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.ArriveTime}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                {item.OnewayReturn===true && (
                                                    <View style={Booking_style.tickets_view}>
                                                        <View style={{flex:1}}>
                                                            <Text>回程 · {item.BackDate}</Text>
                                                        </View>
                                                        <View style={{flex:3,flexDirection:'row'}}>
                                                            <View style={Booking_style.up}>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={Booking_style.Stations_text}>{item.ArriveStation}</Text>
                                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.BackStartTime}</Text>
                                                                </View>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={Booking_style.order_text}>------></Text>
                                                                    <Text style={Booking_style.order_text}>{item.BackOrder}</Text>
                                                                </View>
                                                                <View style={Booking_style.order_view}>
                                                                    <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{item.StartStation}</Text>
                                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{item.BackArriveTime}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    )}
                            </ScrollView>
                        )
                    )}
                    {PayOrTake && (
                        <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignContent:'center',position:'absolute',width:'100%',bottom:'0%',backgroundColor:'#FFFFFF'}} onPress={()=>{setScanVisible(true)}}>
                            <Image style={{marginRight:'5%',alignSelf:'center',width:'8%',aspectRatio:1,resizeMode:'contain',marginVertical:'5%'}} source={require('./icons/camera.png')}></Image>
                            <Text style={{alignSelf:'center',marginVertical:'5%',fontSize:15,fontWeight:'bold',}}>開啟相機 掃描條碼 進行分票</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {Page===3 &&(
                <ScrollView style={load_view.bgview}>
                    <View style={load_view.card}>
                        <View style={load_view.infoview}>
                            <Text style={load_view.infotext}>提供網路訂票、TGO 會員及其他適用專案之訂位紀錄載入 T Express 進行付款/取票;如欲取得他人T Express分票支手機票證，請輸入分票人提供之取票驗證碼進行取票。</Text>
                        </View>
                        <View style={load_view.inputview}>
                            <Text style={load_view.explaintext}>訂位代號</Text>
                            <TextInput style={load_view.inputtext} keyboardType='numeric' maxLength={8} onChangeText={setBookNumber} value={BookNumber} placeholder="訂位代號共8碼"></TextInput>
                            <View style={load_view.seg_line}></View>
                        </View>
                        <View style={load_view.inputview}>
                            <Text style={load_view.explaintext}>取票驗證碼/取票識別碼</Text>
                            <TextInput style={load_view.inputtext} autoCapitalize={'characters'} maxLength={10} onChangeText={setGetTicketCode} value={GetTicketCode} placeholder="驗證碼或身分證/護照/居留證號末4碼"></TextInput>
                            <View style={load_view.seg_line}></View>
                        </View>
                    </View>
                    <TouchableOpacity style={load_view.completebtn} onPress={()=>{getLoseTicket()}}>
                        <Text style={load_view.completetext}>完成</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={load_view.findbtn} onPress={()=>openurl(2)}>
                        <Text style={load_view.findtext}>查詢訂位代號</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {Page===4 &&(
                <ScrollView style={other_style.scview}>
                    <View style={other_style.view1}>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>openurl(0)}>
                            <View style={other_style.iconspos}>
                                <Image style={other_style.icons} source={require('./icons/clockTable.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>高鐵時刻表</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>openurl(1)}>
                            <View style={other_style.iconspos}>
                                <Image style={[other_style.icons,{height:'100%'}]} source={require('./icons/moneyInfo.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>票價資訊</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>{openurl(2)}}>
                            <View style={other_style.iconspos}>
                                <Image style={[other_style.icons,{height:'100%'}]} source={require('./icons/codeInfo.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>查詢訂位代號</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                    </View>
                    <View style={other_style.view2}>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>openurl(3)}>
                            <View style={other_style.iconspos}>
                                <Image style={other_style.icons} source={require('./icons/merchandiseInfo.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>交易注意事項</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>{openurl(4)}}>
                            <View style={other_style.iconspos}>
                                <Image style={other_style.icons} source={require('./icons/contractInfo.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>旅客運送契約</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>{openurl(5)}}>
                            <View style={other_style.iconspos}>
                                <Image style={other_style.icons} source={require('./icons/useInfo.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>使用導覽</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                    </View>
                    <View style={other_style.view3}>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>{openurl(6)}}>
                            <View style={other_style.iconspos}>
                                <Image style={other_style.icons} source={require('./icons/quesInfo.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>關於HSR-Booking</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>openurl(7)}>
                            <View style={other_style.iconspos}>
                                <Image style={other_style.icons} source={require('./icons/webInfo.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>前往高鐵網站</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>{openurl(8)}}>
                            <View style={other_style.iconspos}>
                                <Image style={other_style.icons} source={require('./icons/App.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>前往高鐵台鐵APP</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                        <TouchableOpacity style={other_style.btn} onPress={()=>{openurl(9)}}>
                            <View style={other_style.iconspos}>
                                <Image style={other_style.icons} source={require('./icons/TLife.png')}></Image>
                            </View>
                            <Text style={other_style.btntext}>前往高鐵 TLife 網站</Text>
                            <View style={other_style.topos}>
                                <Image style={other_style.toimg} source={require('./icons/to.png')}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={other_style.seg_line}></View>
                    </View>
                    <Text style={other_style.Vtext}>版本 {Version}</Text>
                </ScrollView>
            )}

            <Modal animationType="slide" transparent={false} visible={ScanVisible} onRequestClose={()=>{setScanVisible(false);setScanned(false);}}>
                {(hasPermission === null)  &&(
                    <Text style={{fontSize:30,fontWeight:'bold',alignSelf:'center',alignContent:'center',justifyContent:'center'}}>Requesting for camera permission</Text>
                )}
                {(hasPermission === false) &&(
                    <Text style={{fontSize:30,fontWeight:'bold',alignSelf:'center',alignContent:'center',justifyContent:'center'}}>No access to camera</Text>
                )}
                {(hasPermission===true) &&(
                    <View style={{flex:1}}>
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                            style={[StyleSheet.absoluteFillObject,{position:'absolute'}]}
                        >
                        </BarCodeScanner>
                        <View style={{flex:1,justifyContent:'flex-start'}}>
                            <View style={{marginTop:'15%',backgroundColor:'#D9D9D9',borderRadius:30,alignItems:'center',alignSelf:'center'}}>
                                <Text style={{color:'#FFFFFF',fontWeight:'bold',fontSize:20,margin:'5%'}}>進行分票 掃描條碼</Text>
                            </View>
                        </View>
                        <View style={{flex:1,justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{marginBottom:'15%',backgroundColor:'#D83714',borderRadius:30,alignItems:'center',alignSelf:'center'}} onPress={()=>{setScanVisible(false);setScanned(false);}}>
                                <Text style={{color:'#FFFFFF',fontWeight:'bold',fontSize:20,margin:'5%'}}>返回</Text>
                            </TouchableOpacity>
                        </View>
                        {scanned &&
                            <TouchableOpacity style={{marginBottom:'15%',backgroundColor:'#D83714',borderRadius:30,alignItems:'center',alignSelf:'center'}} onPress={()=>{setScanned(false);}}>
                                <Text style={{color:'#FFFFFF',fontWeight:'bold',fontSize:20,margin:'5%'}}>Tap to Scan Again!</Text>
                            </TouchableOpacity>
                        }
                    </View>
                )}
            </Modal>

            <Modal animationType="slide" transparent={false} visible={timetable} onRequestClose={() => settimetable(!timetable)}>
                <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        {(!TableStationsByVisible &&!ChooseStationVisible && !TableDateVisible && !TableVisible) &&(
                            <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{settimetable(false)}}>
                                <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                            </TouchableOpacity>
                        )}
                        {(!TableStationsByVisible &&!ChooseStationVisible && !TableDateVisible && !TableVisible) &&(
                            <Text style={Booking_style.bigtitle}>高鐵時刻表</Text>
                        )}
                    </View>
                    <View style={[load_view.card,{height:350}]}>
                        <View style={load_view.infoview}>
                            <View style={[other_style.textview,{marginTop: '5%'}]}>
                                <Text style={other_style.NumberText}>1.</Text>
                                <Text style={other_style.NormalText}>本時刻表查詢係以營運日為單位，提供旅客查詢出發日期之營運時刻表。</Text>
                            </View>
                            <View style={[other_style.textview,{marginTop:'5%',marginBottom:'5%'}]}>
                                <Text style={other_style.NumberText}>2.</Text>
                                <Text style={other_style.NormalText}>旅客可自行透過「更新」功能查詢最新時刻表。</Text>
                            </View>
                        </View>
                        <View style={{marginBottom:'10%',flexDirection:'row',height:'15%',alignSelf:'center',width:'90%',alignContent:'center',justifyContent:'center'}}>
                            <TouchableOpacity style={[styles.station_choose]} onPress={()=>{setStations(StartStation);setIsStart(true);setlocationtype(1);setChooseStationVisible(true);settimetable(false);}}>
                                <Text style={styles.sation_start_end}>起程站</Text>
                                <Text style={styles.station}>{StartstationText}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.return_oneway_frame} onPress={switchStation}>
                                <Image style={styles.return_oneway_img} source={require('./icons/return_ticket.png')}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.station_choose} onPress={()=>{setStations(EndStation);setIsStart(false);setlocationtype(1);setChooseStationVisible(true);settimetable(false);}}>
                                <Text style={[styles.sation_start_end,{alignSelf:'flex-end'}]}>到達站</Text>
                                <Text style={[styles.station,{alignSelf:'flex-end'}]}>{EndstationText}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[load_view.inputview,{height:'20%'}]} onPress={()=>{setTableDateVisible(true);settimetable(false);}}>
                            <Text style={[load_view.explaintext,{fontSize: 14}]}>出發日期</Text>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={[load_view.inputtext,{fontSize: 14}]}>{TableTimeText}</Text>
                                <View style={[load_view.chooseview,{position:'absolute',right:'10%'}]}>
                                    <Image style={load_view.chooseimg} source={require('./icons/choose_arrow.png')}></Image>
                                </View>
                            </View>
                            <View style={load_view.seg_line}></View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[load_view.completebtn,{height: '5%'}]} onPress={()=>{getTimeTable()}}>
                        <Text style={[load_view.completetext,{fontSize: 20}]}>查詢</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={TableVisible} onRequestClose={() =>{settimetable(true); setTableVisible(!TableVisible);}}>
                <View style={Booking_style.container}>
                    <View style={Booking_style.hbox}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'22%'}]} onPress={() => {settimetable(true);setTableVisible(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.title}>當日時刻表</Text>
                        <View style={Booking_style.direction_view}>
                            <Text style={Booking_style.start_end_text}>{start}</Text>
                            <Text style={Booking_style.start_end_text}>------></Text>
                            <Text style={Booking_style.start_end_text}>{end}</Text>
                        </View>
                    </View>
                    <View style={Booking_style.time_view}>
                        <Text style={Booking_style.bookingtime_text}>{TableTimeText}</Text>
                    </View>
                    <ScrollView style={Booking_style.menu}>{
                        TableData.map((item,index) => {
                            return (
                                <View key={index} style={Booking_style.cards}>
                                    <View style={Booking_style.up}>
                                        <Text style={Booking_style.timetext}>{item.StartTime}</Text>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.order_text}>------></Text>
                                            <Text style={Booking_style.order_text}>{item.Order}</Text>
                                        </View>
                                        <Text style={Booking_style.timetext}>{item.ArriveTime}</Text>
                                    </View>
                                    <View style={Booking_style.seg_line}></View>
                                    <View style={Booking_style.down}>
                                        <View style={Booking_style.totaltime_view}>
                                            <Image style={Booking_style.down_icons} source={require('./icons/time.png')}></Image>
                                            <Text style={Booking_style.totaltimetext}>{getTotalTime(item.StartTime,item.ArriveTime)}</Text>
                                        </View>
                                        <TouchableOpacity style={Booking_style.route_btn} onPress={()=>{setStationsByOrder(item.Order);setStationsByDatas(item.StationsBy);setTableStationsByVisible(true);setTableVisible(false);}}>
                                            <Image style={Booking_style.route_img} source={require('./icons/route.png')}></Image>
                                            <Text style={Booking_style.totaltimetext}>查看停靠站</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })
                    }
                    </ScrollView>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={TableStationsByVisible} onRequestClose={() =>{setTableVisible(true);setTableStationsByVisible(false);}}>
                <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setTableVisible(true);setTableStationsByVisible(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>車次 {StationsByOrder}</Text>
                    </View>
                    <View style={Booking_style.wcard}>
                        <View style={Booking_style.upcard}>
                            <Text style={[Booking_style.uptext,{textAlign:'right'}]}>發車時間</Text>
                            <View style={{flex:2}}></View>
                            <Text style={[Booking_style.uptext,{textAlign:'left'}]}>停靠站</Text>
                        </View>
                        <View style={[Booking_style.seg_line,{marginTop:'5%',height:1}]}></View>
                        <View style={Booking_style.downcard}>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D83714'}]}>{item}</Text>
                                        )
                                    }
                                    else if(item.length===0){
                                        return(
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#FFFFFF'}]}>00</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D9D9D9'}]}>{item}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                            <View style={Booking_style.cardforcircle}>
                            </View>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(item.length===0){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D9D9D9'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D83714'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#000000'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                        </View>
                        <TouchableOpacity style={Booking_style.cardclose} onPress={()=>{setTableVisible(true);setTableStationsByVisible(false);}}>
                            <Text style={Booking_style.cardclosetext}>關閉</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal animationType="slide" transparent={false} visible={TableDateVisible} onRequestClose={() => {settimetable(true);setTableDateVisible(!TableDateVisible);}}>
                <View style={{alignSelf:'center',justifyContent:'space-around',width:'100%',height:'100%'}}>
                    <View style={styles.hbox}>
                        <Text style={[styles.Htext]}>選擇出發日期</Text>
                    </View>
                    {CalerdarVisible && (
                        <DatePicker
                            options={{
                                backgroundColor: '#34393E',
                                textHeaderColor: '#FFA25B',
                                textDefaultColor: '#F6E7C1',
                                selectedTextColor: '#fff',
                                mainColor: '#F4722B',
                                textSecondaryColor: '#D6C7A1',
                                borderColor: 'rgba(122, 146, 165, 0.1)',
                            }}
                            mode={'calendar'}
                            selected={DateOfTable}
                            minimumDate={minDate}
                            maximumDate={maxDate}
                            current={DateOfTable}
                            onDateChange={date=>{setday(date)}}
                            style={{ flex:3,borderRadius: 10,width:'90%',alignSelf:'center',margin:'10%'}}
                        ></DatePicker>
                    )}
                    <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
                        <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',margin:'5%',width:'40%',backgroundColor:'#FFA25B',height:'90%',borderRadius:10}} onPress={settablebeinit}>
                            <Text style={{color:'#FFFFFF',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>今天</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',margin:'5%',width:'40%',borderWidth:3,borderColor:'#FFA25B',height:'90%',borderRadius:10}} onPress={cancelsettabletime}>
                            <Text style={{color:'#FFA25B',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{alignContent:'center',alignSelf:'center',justifyContent:'center',margin:'10%',width:'90%',backgroundColor:'#34393E',height:'8%',borderRadius:10}} onPress={completeselecttableday}>
                        <Text style={{color:'#FFA25B',alignSelf:'center',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>確認</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={findcodeVisible} onRequestClose={() => setfindcodeVisible(!findcodeVisible)}>
                {IdPassportModal &&(
                    <View style={[styles.overlay,{position:'absolute',zIndex:999}]}>
                        <TouchableWithoutFeedback onPress={()=>setIdPassportModal(!IdPassportModal)}>
                            <View  style={{position:'absolute',width:'100%',height:'100%',top:0,left:0,backgroundColor:'rgba(0,0,0,.5)'}}/>
                        </TouchableWithoutFeedback>
                        <View style={[styles.menu,{height:'20%'}]}>
                            <View style={styles.title}>
                                <Text style={styles.title_text}>擇一填寫</Text>
                            </View>
                            <View style={styles.seg_line}></View>
                            <TouchableOpacity style={styles.choices} onPress={()=>{setIdPassportModal(false);setIdOrPassport('身分證字號');}}>
                                <Text style={styles.menu_text}>身分證字號</Text>
                            </TouchableOpacity>
                            <View style={styles.seg_line}></View>
                            <TouchableOpacity style={styles.choices} onPress={()=>{setIdPassportModal(false);setIdOrPassport('護照/居留證號碼');}}>
                                <Text style={styles.menu_text}>護照/居留證號碼</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.cancel_btn} onPress={() => setIdPassportModal(false)}>
                            <Text style={styles.cancel_text}>取消</Text>
                        </TouchableOpacity>

                    </View>
                )}
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        {(!ChooseStationVisible && !FindDateVisible &&!FindDetailsVisible) &&(
                            <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setfindcodeVisible(false)}}>
                                <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                            </TouchableOpacity>
                        )}
                        {(!ChooseStationVisible && !FindDateVisible &&!FindDetailsVisible) &&(
                            <Text style={Booking_style.bigtitle}>查詢訂位代號</Text>
                        )}
                    </View>

                    <ScrollView style={{width:'100%'}}>
                        <View style={[load_view.card,{height:550}]}>
                            <View style={load_view.infoview}>
                                <View style={[other_style.textview,{marginTop: '5%'}]}>
                                    <Text style={other_style.NumberText}>1.</Text>
                                    <Text style={other_style.NormalText}>適用查詢透過網路訂票系統及自動語音訂位服務預定之訂位紀錄。</Text>
                                </View>
                                <View style={[other_style.textview,{marginTop:'5%',marginBottom:'5%'}]}>
                                    <Text style={other_style.NumberText}>2.</Text>
                                    <Text style={other_style.NormalText}>不適用查詢已逾發車當天日期或已取票之訂位紀錄。</Text>
                                </View>
                            </View>
                            <View style={{marginBottom:'10%',flexDirection:'row',height:'15%',alignSelf:'center',width:'90%',alignContent:'center',justifyContent:'center'}}>
                                <TouchableOpacity style={[styles.station_choose]} onPress={()=>{setStations(StartStation);setIsStart(true);setlocationtype(3);setChooseStationVisible(true);setfindcodeVisible(false);}}>
                                    <Text style={styles.sation_start_end}>起程站</Text>
                                    <Text style={styles.station}>{StartstationText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.return_oneway_frame} onPress={switchStation}>
                                    <Image style={styles.return_oneway_img} source={require('./icons/return_ticket.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.station_choose} onPress={()=>{setStations(EndStation);setIsStart(false);setlocationtype(3);setChooseStationVisible(true);setfindcodeVisible(false);}}>
                                    <Text style={[styles.sation_start_end,{alignSelf:'flex-end'}]}>到達站</Text>
                                    <Text style={[styles.station,{alignSelf:'flex-end'}]}>{EndstationText}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[load_view.inputview,{height:'20%'}]} onPress={()=>{setFindDateVisible(true);setfindcodeVisible(false);}}>
                                <Text style={[load_view.explaintext,{fontSize: 14}]}>去程日期</Text>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <Text style={[load_view.inputtext,{fontSize: 14}]}>{FindTimeText}</Text>
                                    <View style={[load_view.chooseview,{position:'absolute',right:'10%'}]}>
                                        <Image style={load_view.chooseimg} source={require('./icons/choose_arrow.png')}></Image>
                                    </View>
                                </View>
                                <View style={load_view.seg_line}></View>
                            </TouchableOpacity>
                            <View style={[load_view.inputview,{height:'20%'}]}>
                                <Text style={[load_view.explaintext,{fontSize: 14}]}>車次號碼</Text>
                                <TextInput style={[load_view.inputtext,{fontSize: 14}]} onChangeText={setOrderOfFind} value={OrderOfFind} placeholder="車次號碼"></TextInput>
                                <View style={load_view.seg_line}></View>
                            </View>
                            <View style={[load_view.inputview,{width:'90%',height:'20%'}]}>
                                <Text style={[load_view.explaintext,{color:'#000000',fontSize: 15}]}>取票識別碼</Text>
                                <View style={load_view.idview}>
                                    <TouchableOpacity style={[load_view.idbtn,{height:'30%'}]} onPress={()=>{setIdPassportModal(true);}}>
                                        <View style={load_view.idtextview}>
                                            <Text style={load_view.idtext}>{IdOrPassport}</Text>
                                            <View style={load_view.chooseview}>
                                                <Image style={load_view.chooseimg} source={require('./icons/choose_arrow.png')}></Image>
                                            </View>
                                        </View>
                                        <View style={[load_view.seg_line,{width:'100%'}]}></View>
                                    </TouchableOpacity>
                                    <View style={[load_view.idbtn,{height:'30%'}]}>
                                        <View style={load_view.idtextview}>
                                            <TextInput style={[load_view.inputtext,{fontSize: 15,marginTop: '0%'}]} maxLength={10} onChangeText={setIdOfFind} value={IdOfFind} placeholder=""></TextInput>
                                            <View style={load_view.chooseview}>
                                            </View>
                                        </View>
                                        <View style={[load_view.seg_line,{width:'100%'}]}></View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={load_view.completebtn} onPress={()=>{getLoseCode()}}>
                            <Text style={load_view.completetext}>完成</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={FindDetailsVisible} onRequestClose={() => {setfindcodeVisible(true);setFindDetailsVisible(!FindDetailsVisible);}}>
                <View style={[styles.container,{justifyContent: 'flex-start',backgroundColor: '#FFFFFF'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setfindcodeVisible(true);setFindDetailsVisible(false)}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>查詢訂位代號</Text>
                    </View>
                    <ScrollView style={{width:'100%'}}>
                    <View style={[load_view.card,{height:250}]}>
                        <View style={[load_view.inputview,{height:'20%',marginTop:'5%'}]}>
                            <Text style={[load_view.explaintext,{fontSize: 14}]}>取票人證號</Text>
                            <Text style={load_view.inputtext}>{IdOfFind}</Text>
                            <View style={load_view.seg_line}></View>
                        </View>
                        <View style={[load_view.inputview,{height:'20%'}]}>
                            <Text style={[load_view.explaintext,{fontSize: 14}]}>起訖車站</Text>
                            <Text style={load_view.inputtext}>{StartstationText} - {EndstationText}</Text>
                            <View style={load_view.seg_line}></View>
                        </View>
                        <View style={[load_view.inputview,{height:'20%'}]}>
                            <Text style={[load_view.explaintext,{fontSize: 14}]}>去程日期</Text>
                            <Text style={load_view.inputtext}>{FindTimeText}</Text>
                            <View style={load_view.seg_line}></View>
                        </View>
                        <View style={[load_view.inputview,{height:'20%'}]}>
                            <Text style={[load_view.explaintext,{fontSize: 14}]}>車次號碼</Text>
                            <Text style={load_view.inputtext}>{OrderOfFind}</Text>
                            <View style={load_view.seg_line}></View>
                        </View>
                    </View>
                    <Text style={{marginBottom:'5%',marginTop:'5%',alignSelf:'center',textAlign:'left',textAlignVertical:'center',width:'81%',maxWidth:'100%',fontWeight:'bold',fontSize:15}}>符合結果之訂位紀錄如下，點選訂位代號可將該筆訂位紀錄擷取至手機。</Text>
                    <View style={[load_view.card,{flexDirection:'row',height:'auto'}]}>
                        <View style={[load_view.triview,{justifyContent:'flex-start',marginLeft:'5%'}]}>
                            <Text style={load_view.explaintext}>訂位代號</Text>
                            {FindOfDatas.map((item,index)=>{
                                return(
                                    <TouchableOpacity style={load_view.findcodebtn} key={index} onPress={()=>{loadticketnow(item.State==='True',item)}}>
                                        <Text style={[load_view.findcodetext,{textAlign:'left',textDecorationLine: item.State==='True'?'none':'underline',textDecorationColor:'#D83714',color:item.State==='True'?'#000000':'#D83714'}]}>{item.Code}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View style={load_view.triview}>
                            <Text style={[load_view.explaintext,{textAlign: 'center'}]}>交易狀態</Text>
                            {FindOfDatas.map((item,index)=>{
                                return(
                                    <TouchableOpacity key={index} style={load_view.findcodebtn} onPress={()=>{loadticketnow(item.State==='True',item)}}>
                                        <Text style={[load_view.findcodetext,{textDecorationLine: item.State==='True'?'none':'underline',textDecorationColor:'#D83714',color:item.State==='True'?'#000000':'#D83714',textAlign:'center'}]}>{item.State==='True'?'已付款':'未付款'}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View style={[load_view.triview,{justifyContent:'flex-start',marginRight:'5%'}]}>
                            <Text style={[load_view.explaintext,{textAlign:'right'}]}>付款期限</Text>
                            {FindOfDatas.map((item,index)=>{
                                return(
                                    <View key={index} style={load_view.findcodebtn}>
                                        <Text style={[load_view.findcodetext,{textAlign:'right'}]}>{item.State==='True'?'已付款':'發車前30分'}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={findfare} onRequestClose={() => setfindfare(!findfare)}>
                <View style={[Booking_style.hbox,{height: '10%'}]}>
                    {(!ChooseStationVisible && !Gainfare) &&(
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setfindfare(false)}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                    )}
                    {(!ChooseStationVisible && !Gainfare) &&(
                        <Text style={Booking_style.bigtitle}>票價資訊</Text>
                    )}
                </View>
                <View style={{width:'100%'}}>
                    <View style={[load_view.card,{height:300}]}>
                        <View style={[load_view.infoview]}>
                            <View style={[other_style.textview,{marginTop: '5%'}]}>
                                <Text style={other_style.NumberText}>1.</Text>
                                <Text style={other_style.NormalText}>本票價資訊專區所顯示之價格，以旅客查詢當日之售價計費;票價或優惠折扣資訊若有變動，請以各車站現場及企業網站公告為準。</Text>
                            </View>
                            <View style={[other_style.textview,{marginTop:'5%',marginBottom:'5%'}]}>
                                <Text style={other_style.NumberText}>2.</Text>
                                <Text style={[other_style.NormalText]}>本票價表未提及之優惠折扣方案，請查詢台灣高鐵企業網站 www.thsrc.com.tw。</Text>
                            </View>
                        </View>
                        <View style={{marginBottom:'10%',flexDirection:'row',height:'15%',alignSelf:'center',width:'90%',alignContent:'center',justifyContent:'center'}}>
                            <TouchableOpacity style={[styles.station_choose]} onPress={()=>{setStations(StartStation);setIsStart(true);setlocationtype(2);setChooseStationVisible(true);setfindfare(false);}}>
                                <Text style={styles.sation_start_end}>起程站</Text>
                                <Text style={styles.station}>{StartstationText}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.return_oneway_frame} onPress={switchStation}>
                                <Image style={styles.return_oneway_img} source={require('./icons/return_ticket.png')}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.station_choose} onPress={()=>{setStations(EndStation);setIsStart(false);setlocationtype(2);setChooseStationVisible(true);setfindfare(false);}}>
                                <Text style={[styles.sation_start_end,{alignSelf:'flex-end'}]}>到達站</Text>
                                <Text style={[styles.station,{alignSelf:'flex-end'}]}>{EndstationText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={[load_view.completebtn,{height: '10%'}]} onPress={()=>{setGainfare(true);setfindfare(false);}}>
                        <Text style={[load_view.completetext,{fontSize: 20}]}>查詢</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={Gainfare} onRequestClose={() =>{setfindfare(true); setGainfare(!Gainfare);}}>
                <View style={[styles.container,{justifyContent: 'flex-start',backgroundColor: '#FFFFFF'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setfindfare(true);setGainfare(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>票價資訊</Text>
                    </View>
                    <View style={other_style.parrelbar}>
                        <TouchableOpacity style={other_style.typebtn} onPress={()=>{if(!fareinfo){setfareinfo(true);LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);}}}>
                            <Text style={[other_style.typetext,{color:fareinfo?'#D83714':'#A3A3A3'}]}>標準車廂</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={other_style.typebtn} onPress={()=>{if(fareinfo){setfareinfo(false);LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);}}}>
                            <Text style={[other_style.typetext,{color:(!fareinfo)?'#D83714':'#A3A3A3'}]}>商務車廂</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={other_style.typebar}>
                        <View style={[other_style.typeline,{marginLeft: fareinfo?'12.5%':'62.5%'}]}></View>
                    </View>
                    <View style={other_style.allfareview}>
                        <View style={other_style.stationview}>
                            <View style={other_style.triview}>
                                <Text style={other_style.stationname}>起程站</Text>
                                <Text style={other_style.stationtext}>{StartstationText}</Text>
                            </View>
                            <View style={other_style.triview}></View>
                            {/*<Image source={}></Image>*/}
                            <View style={other_style.triview}>
                                <Text style={[other_style.stationname,{textAlign:'right'}]}>到達站</Text>
                                <Text style={[other_style.stationtext,{textAlign:'right'}]}>{EndstationText}</Text>
                            </View>
                        </View>
                        <View style={other_style.seg_line}></View>
                        {fareinfo &&(
                            <View style={other_style.faresview}>
                                <View style={other_style.lrfareview}>
                                    <Text style={other_style.leftfare}>全票</Text>
                                    <Text style={other_style.leftfare}>孩童</Text>
                                    <Text style={other_style.leftfare}>敬老</Text>
                                    <Text style={other_style.leftfare}>愛心</Text>
                                    <Text style={other_style.leftfare}>早鳥65折</Text>
                                    <Text style={other_style.leftfare}>早鳥8折</Text>
                                    <Text style={other_style.leftfare}>早鳥9折</Text>
                                    <Text style={other_style.leftfare}>大學生5折</Text>
                                    <Text style={other_style.leftfare}>大學生75折</Text>
                                    <Text style={[other_style.leftfare,{marginBottom:'15%'}]}>大學生88折</Text>
                                </View>
                                <View style={other_style.lrfareview}>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Adult)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Child)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Old)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Love)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Early65)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Early8)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Early9)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Student5)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Student75)}</Text>
                                    <Text style={[other_style.rightfare,{marginBottom:'15%'}]}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Standard.Student88)}</Text>
                                </View>
                            </View>
                        )}
                        {!fareinfo &&(
                            <View style={other_style.faresview}>
                                <View style={other_style.lrfareview}>
                                    <Text style={other_style.leftfare}>全票</Text>
                                    <Text style={other_style.leftfare}>孩童</Text>
                                    <Text style={other_style.leftfare}>敬老</Text>
                                    <Text style={[other_style.leftfare,{marginBottom:'15%'}]}>愛心</Text>
                                </View>
                                <View style={other_style.lrfareview}>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Bussiness.Adult)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Bussiness.Child)}</Text>
                                    <Text style={other_style.rightfare}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Bussiness.Old)}</Text>
                                    <Text style={[other_style.rightfare,{marginBottom:'15%'}]}>TWD {moneyManifest(Fares[StartstationText][EndstationText].Bussiness.Love)}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={FindDateVisible} onRequestClose={() => {setfindcodeVisible(true);setFindDateVisible(!FindDateVisible);}}>
                <View style={{alignSelf:'center',justifyContent:'space-around',width:'100%',height:'100%'}}>
                    <View style={styles.hbox}>
                        <Text style={[styles.Htext]}>請選擇日期</Text>
                    </View>
                    {CalerdarVisible && (
                        <DatePicker
                            options={{
                                backgroundColor: '#34393E',
                                textHeaderColor: '#FFA25B',
                                textDefaultColor: '#F6E7C1',
                                selectedTextColor: '#fff',
                                mainColor: '#F4722B',
                                textSecondaryColor: '#D6C7A1',
                                borderColor: 'rgba(122, 146, 165, 0.1)',
                            }}
                            mode={'calendar'}
                            selected={DateOfFind}
                            minimumDate={minDate}
                            maximumDate={maxDate}
                            current={DateOfFind}
                            onDateChange={date=>{setday(date)}}
                            style={{ flex:3,borderRadius: 10,width:'90%',alignSelf:'center',margin:'10%'}}
                        ></DatePicker>
                    )}
                    <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
                        <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',margin:'5%',width:'40%',backgroundColor:'#FFA25B',height:'90%',borderRadius:10}} onPress={setfindbeinit}>
                            <Text style={{color:'#FFFFFF',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>今天</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',margin:'5%',width:'40%',borderWidth:3,borderColor:'#FFA25B',height:'90%',borderRadius:10}} onPress={cancelsetfindtime}>
                            <Text style={{color:'#FFA25B',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{alignContent:'center',alignSelf:'center',justifyContent:'center',margin:'10%',width:'90%',backgroundColor:'#34393E',height:'8%',borderRadius:10}} onPress={completeselectfindday}>
                        <Text style={{color:'#FFA25B',alignSelf:'center',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>確認</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={cautionsVisible} onRequestClose={() => setcautionsVisible(!cautionsVisible)}>
                <View style={styles.container}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setcautionsVisible(false)}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>交易注意事項</Text>
                    </View>
                    <ScrollView style={other_style.scview}>
                        <View style={[other_style.textview,{marginTop: '5%'}]}>
                            <Text style={other_style.OrangeText}>使用者條款</Text>
                        </View>
                        <View style={[other_style.textview,{marginTop: '5%',marginBottom:'5%'}]}>
                            <Text style={[other_style.NormalText,{maxWidth:'100%'}]}>歡迎使用台灣高鐵T Express行動購票服務，為了您的權益，請詳細閱讀以下注意事項。如果您點選「同意」，就將視為您事先已知悉、並同意本條款，如果您無法接受本條款時，請勿使用本系統訂位/購票。您可利用高鐵企業網站之「聯絡我們」或撥打台灣高鐵客服專線（服務時間
                                06:00~24:00)：市話撥打4066-3000 （代表號），手機請撥打02-4066-3000，國際來話請撥+886-2-4066-3000與我們聯繫。謝謝！
                            </Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>1.</Text>
                            <Text style={other_style.NormalText}>您在訂位完成後，即構成有效購票契約，雙方之權利義務依台灣高鐵報請交通部備查並對外公告實施之「旅客運送契約」和其他依法訂定之詳細營運規章及對外公告内容。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>2.</Text>
                            <Text style={other_style.NormalText}>您同意訂位後如未在台灣高鐵指定之期限内付款時，台灣高鐵可逕行取消您的訂位紀錄。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>3.</Text>
                            <Text style={other_style.NormalText}>您同意以本系統取得之QR Code手機票證為搭乘高鐵之唯一票證，並不得透過任何方式複製截圖或傳輸其他手機使用。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>4.</Text>
                            <Text style={other_style.NormalText}>您同意於使用本系統所提供之功能或以手機票證乘車時，得於必要時依高鐵人員要求配合手機操作，或由高鐵人員於您的手機進行相關票證查驗作業。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>5.</Text>
                            <Text style={other_style.NormalText}>本系統若因高鐵公司營運或系統控管之事由而無法提供服務時，請逕洽高鐵各車站或使用其他購票通路辦理購/取票事宜。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>6.</Text>
                            <Text style={other_style.NormalText}>您同意本系統「個人資料設定」與「取票人資訊」内所含之身分證字號、護照號碼、會員帳號、企業會員統編、電話與電子郵件等資料，以及相關訂票資訊內容：確由旅客自行提供，如非本人提供，應由提供人告知與旅客之關係及資料來源。又本公司基於個人資料保護法規定，於執行職務或業務之必要範圍內蒐集、處理及利用旅客個人資料，目的為確保本系統能提供最佳服務。有關旅客個人資料保護權益事項等請參考台灣高鐵企業網站www.thsrc.com.tw及車站公告。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>7.</Text>
                            <Text style={other_style.NormalText}>有關本條款之行使、及所有因本條款所生或與本條款有關之爭議，應以中華民國法律為準據法。</Text>
                        </View>
                        <View style={[other_style.textview,{marginTop:'10%',marginBottom:'5%'}]}>
                            <Text style={other_style.OrangeText}>交易注意事項</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>1.</Text>
                            <Text style={other_style.NormalText}>取得手機票證後，僅限用原取票手機開啟乘車票證（含乘車條 碼QR Code)，且該票證無法轉移至其他手機使用，請您於取票前先行確認將使用本手機通過閘門乘車。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>2.</Text>
                            <Text style={other_style.NormalText}>訂位紀錄付款前/後，可使用手機辦理行程變更、減少人數及刪除行程；手機票證開立後，僅能辦理退票作業，若您要變更行程請於列車出發前30分鐘，持手機票證前往車站辦理。使用手機分票功能後，末被其他手機領取之票證，可由執行分票之手機辦理退票。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>3.</Text>
                            <Text style={other_style.NormalText}>己付款之訂位紀錄，每段行程各可於本系統辦理變更行程乙次，免收手續費，之後如欲再次變更，須辦理「退票」後重新訂票購買；退票或退費作業(含減少人數及刪減單段行程)皆須收取相關手續費用。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>4.</Text>
                            <Text style={other_style.NormalText}>手機票證因去程已搭，或已渝退票時限末使用，如無法於手機端辦理回程變更或回程退票時，請於列車出發前30分鐘持手機票證至高鐵車站辦理。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>5.</Text>
                            <Text style={other_style.NormalText}>透過本系統預訂一小時內車次，訂位完成時須立即付款，預訂30分鐘内車次者，付款後不受理退費/退票。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>6.</Text>
                            <Text style={other_style.NormalText}>手機分票服務僅適用本系統或網路訂票完成付款之多人交易，一旦經分票功能處理後，該訂位紀錄內之所有車票僅能透過手機取票，無法選擇其他通路開票，請您使用此功能前，務必確認所有同行者均持有智慧型手機，且已安裝「台灣高鐵TExpress]，以利取票乘車。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>7.</Text>
                            <Text style={other_style.NormalText}>訂位紀錄中含敬老/愛心票者，可至車站售票窗口或本公司合作之便利商店付款/取票，取票時須核驗搭乘者之身分證明文件(如：身分證、身心障礙證明）。凡透過車站窗口購/取敬老/愛心票的旅客，自該次購/取票的翌日起至次年年底前，可開放使用自動售票機、T Express行動購票App取票（身心障礙證明之重新鑑定日期如早於次年年底，以該重新鑑定日期為限）。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>8.</Text>
                            <Text style={other_style.NormalText}>手機票證之電子車票證明可直接透過本系統下載，或可至高鐵企業網站之「交易/搭乘紀錄查詢」專區下載。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>9.</Text>
                            <Text style={other_style.NormalText}>手機票證為不記名乘車票，如手機遺失或故障致無法出示手機票證者，恕無法受理車票補發作業，旅客須另行購票搭乘。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>10.</Text>
                            <Text style={other_style.NormalText}>乘車、查驗票或辦理相關票務作業時，應透過本系統出示手機票證，如手機遺失、故障或電池耗盡等因素，致手機無法使用本系統顯示手機票證時，將視同末攜帶有效乘車票處理。為保障旅客權益，敬請妥善保管手機票證，並於乘車前確認手機電力是否充足。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>11.</Text>
                            <Text style={other_style.NormalText}>手機票證限以所載之日期、車次有效，逾期作廢。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>12.</Text>
                            <Text style={other_style.NormalText}>敬老/愛心票種限本國籍旅客購買使用，購買時請填寫搭乘者之姓名及身分證字號，取票及乘車時，並請備妥有效身分證明文件核驗。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>13.</Text>
                            <Text style={other_style.NormalText}>持用學生票者，如學生證「無當學期註冊章或為免蓋註冊章」，務必合併出示「在學證明正本」方得適用優惠，詳情請參閱企網大學生優惠活動說明。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>14.</Text>
                            <Text style={other_style.NormalText}>本系統訂位時輸入電子郵件者，於完成訂位、付款、退票及辦理行程變更後，將自動寄發確認信函。尖峰車次可能有座位不相鄰之情況，請留意系統顯示之座位資訊。另，本系統提供商務車廂旅客於訂位完成後，每一行程即可重新選位乙次（限非當日行程）。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>15.</Text>
                            <Text style={other_style.NormalText}>列車運行中斷、運轉變更或因可歸責於本公司之事由導致列車遲延而得退費時，請務必保留手機票證，並於乘車日起一年內憑手機票證至各車站辦理退費。</Text>
                        </View>
                        <View style={other_style.textview}>
                            <Text style={other_style.NumberText}>16.</Text>
                            <Text style={other_style.NormalText}>本系統可提供旅客於訂位/付款後事先取得便利商店電子結帳條碼，請逕至合作業者門市結帳(特殊門市除外)並取得便利商店實體車票乘車，使用方式詳見公告。</Text>
                        </View>
                        <View style={[other_style.textview,{marginBottom:'10%'}]}>
                            <Text style={other_style.NumberText}>17.</Text>
                            <Text style={other_style.NormalText}>相關票務規定，均依台灣高鐵「旅客運送契約」辦理。其他訂票及乘車注意事項請參考台灣高鐵企業網站及車站公告，或撥打台灣高鐵客服專線（服務時間：06:00~24:00)：市話撥打4066-3000（代表號），手機請撥打02-4066-3000，國際來話請撥+886-2-4066-3000。以上皆為付費電話，依一般市話及行動電話、國際電話費率標準計費。</Text>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={SelectDateMode} onRequestClose={() => setSelectedDate(!selectedDate)}>
                <View style={{alignSelf:'center',justifyContent:'space-around',width:'100%',height:'100%'}}>
                    <View style={styles.hbox}>
                        <Text style={[styles.Htext]}>{Gostate?'去程時間':'回程時間'}</Text>
                    </View>
                    {CalerdarVisible && (
                        <DatePicker
                            options={{
                                backgroundColor: '#34393E',
                                textHeaderColor: '#FFA25B',
                                textDefaultColor: '#F6E7C1',
                                selectedTextColor: '#fff',
                                mainColor: '#F4722B',
                                textSecondaryColor: '#D6C7A1',
                                borderColor: 'rgba(122, 146, 165, 0.1)',
                            }}
                            selected={selectedDate}
                            minimumDate={Gostate?minDate:backminDate}
                            maximumDate={maxDate}
                            minuteInterval={5}
                            current={selectedDate}
                            onDateChange={date=>{setday(date)}}
                            onSelectedChange={()=>{}}
                            onTimeChange={timechange=>{sethm(timechange);}}
                            style={{ flex:3,borderRadius: 10,width:'90%',alignSelf:'center',margin:'10%'}}
                        ></DatePicker>
                    )}
                    <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
                        <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',margin:'5%',width:'40%',backgroundColor:'#FFA25B',height:'90%',borderRadius:10}} onPress={setbeinit}>
                            <Text style={{color:'#FFFFFF',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>今天</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',margin:'5%',width:'40%',borderWidth:3,borderColor:'#FFA25B',height:'90%',borderRadius:10}} onPress={cancelsettime}>
                            <Text style={{color:'#FFA25B',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{alignContent:'center',alignSelf:'center',justifyContent:'center',margin:'10%',width:'90%',backgroundColor:'#34393E',height:'8%',borderRadius:10}} onPress={completeselectday}>
                        <Text style={{color:'#FFA25B',alignSelf:'center',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>確認</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={ChooseStationVisible} onRequestClose={() => {if(locationtype===1){settimetable(true);}else if(locationtype===2){setfindfare(true);}else if(locationtype===3){setfindcodeVisible(true);}setChooseStationVisible(false);}}>
                <View style={styles.container}>
                    <View style={styles.Hview}>
                        <Text style={styles.Choose_text}>選擇車站</Text>
                    </View>
                    <View style={styles.result_view}>
                        <View style={styles.manifest_view}>
                            <Text style={styles.target_start_end}>起程站</Text>
                            <TouchableOpacity style={[styles.target_station_box,{borderWidth:IsStart?1.5:0}]} onPress={StartStationPress}>
                                <Text style={[styles.target_station_text,{color:IsStart?'#000000':'#9f9b9b'}]}>{StartstationText}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.change_frame]} onPress={switchStation}>
                            <Image style={[styles.return_oneway_img,{top:'10%'}]} source={require('./icons/return_ticket.png')}></Image>
                        </TouchableOpacity>
                        <View style={styles.manifest_view}>
                            <Text style={[styles.target_start_end,{alignSelf:'flex-end'}]}>到達站</Text>
                            <TouchableOpacity style={[styles.target_station_box,{borderWidth:IsStart?0:1.5,alignSelf:'flex-end'}]} onPress={EndStationPress}>
                                <Text style={[styles.target_station_text,{color:IsStart?'#9f9b9b':'#000000'}]}>{EndstationText}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={styles.contentview}>
                        <View style={styles.stations_frames}>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===0?1.5:0}]} onPress={()=>{SetTargetStation(0)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===0?'#D83714':'#9f9b9b'}]}>{Stations_Name[0]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===1?1.5:0}]} onPress={()=>{SetTargetStation(1)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===1?'#D83714':'#9f9b9b'}]}>{Stations_Name[1]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===2?1.5:0}]} onPress={()=>{SetTargetStation(2)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===2?'#D83714':'#9f9b9b'}]}>{Stations_Name[2]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.stations_frames}>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===3?1.5:0}]} onPress={()=>{SetTargetStation(3)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===3?'#D83714':'#9f9b9b'}]}>{Stations_Name[3]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===4?1.5:0}]} onPress={()=>{SetTargetStation(4)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===4?'#D83714':'#9f9b9b'}]}>{Stations_Name[4]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===5?1.5:0}]} onPress={()=>{SetTargetStation(5)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===5?'#D83714':'#9f9b9b'}]}>{Stations_Name[5]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.stations_frames}>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===6?1.5:0}]} onPress={()=>{SetTargetStation(6)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===6?'#D83714':'#9f9b9b'}]}>{Stations_Name[6]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===7?1.5:0}]} onPress={()=>{SetTargetStation(7)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===7?'#D83714':'#9f9b9b'}]}>{Stations_Name[7]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===8?1.5:0}]} onPress={()=>{SetTargetStation(8)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===8?'#D83714':'#9f9b9b'}]}>{Stations_Name[8]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.stations_frames}>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===9?1.5:0}]} onPress={()=>{SetTargetStation(9)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===9?'#D83714':'#9f9b9b'}]}>{Stations_Name[9]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===10?1.5:0}]} onPress={()=>{SetTargetStation(10)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===10?'#D83714':'#9f9b9b'}]}>{Stations_Name[10]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.manifest_view}>
                                <TouchableOpacity style={[styles.target_station_box,{borderWidth: Stations===11?1.5:0}]} onPress={()=>{SetTargetStation(11)}}>
                                    <Text style={[styles.target_station_text,{fontSize: 17,color: Stations===11?'#D83714':'#9f9b9b'}]}>{Stations_Name[11]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.stations_complete_btn} onPress={()=>{if(locationtype===1){settimetable(true);}else if(locationtype===2){setfindfare(true);}else if(locationtype===3){setfindcodeVisible(true);}setChooseStationVisible(false);}}>
                        <Text style={styles.stations_complete_text}>完成</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal style={styles.overlay} animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
                <TouchableWithoutFeedback onPress={()=>setModalVisible(!modalVisible)}>
                    <View  style={{position:'absolute',width:'100%',height:'100%',top:0,left:0,backgroundColor:'rgba(0,0,0,.5)'}}/>
                </TouchableWithoutFeedback>
                <View style={[styles.menu,{height:'30%'}]}>
                    <View style={styles.title}>
                        <Text style={styles.title_text}>選擇座位偏好</Text>
                    </View>
                    <View style={styles.seg_line}></View>
                    <TouchableOpacity style={styles.choices} onPress={()=>{setModalVisible(!modalVisible);setPre(1);}}>
                        <Text style={styles.menu_text}>靠窗優先</Text>
                    </TouchableOpacity>
                    <View style={styles.seg_line}></View>
                    <TouchableOpacity style={styles.choices} onPress={()=>{setModalVisible(!modalVisible);setPre(2);}}>
                        <Text style={styles.menu_text}>靠走道優先</Text>
                    </TouchableOpacity>
                    <View style={styles.seg_line}></View>
                    <TouchableOpacity style={styles.choices} onPress={()=>{setModalVisible(!modalVisible);setPre(0);}}>
                        <Text style={styles.menu_text}>無偏好</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.cancel_btn} onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.cancel_text}>取消</Text>
                </TouchableOpacity>

            </Modal>

            <Modal style={styles.overlay} animationType="slide" transparent={true} visible={TicketsVisible} onRequestClose={() => setTicketsVisible(!TicketsVisible)}>
                <TouchableWithoutFeedback onPress={()=>{setTickets(copyTickets);setTicketsVisible(!TicketsVisible);}}>
                    <View  style={{position:'absolute',width:'100%',height:'100%',top:0,left:0,backgroundColor:'rgba(0,0,0,.5)'}}/>
                </TouchableWithoutFeedback>
                <View style={[styles.menu,{height:'60%',width:'100%',bottom:'0%'}]}>
                    <View style={styles.title}>
                        <Text style={styles.title_text}>選擇乘客人數</Text>
                    </View>
                    <View style={[styles.seg_line,{width: '80%',height: '0.2%'}]}></View>
                    <View style={styles.ticket_view}>
                        <View style={styles.ticket_info}>
                            <Text style={styles.ticket_type_text}>全票</Text>
                            <Text style={styles.ticket_info_text}>12歲以上</Text>
                        </View>
                        <View style={styles.number_of_ticket_view}>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(0,'minus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/minus.png')}></Image>
                            </TouchableOpacity>
                            <View style={styles.vertical_line}></View>
                            <Text style={[styles.number_of_ticket_text,{color:Tickets[0]===0?'#000000':'#D83714'}]}>{Tickets[0]}</Text>
                            <View style={styles.vertical_line}></View>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(0,'plus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/plus.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.seg_line,{width: '80%',height: '0.2%'}]}></View>
                    <View style={styles.ticket_view}>
                        <View style={styles.ticket_info}>
                            <Text style={styles.ticket_type_text}>孩童</Text>
                            <Text style={styles.ticket_info_text}>6歲-11歲</Text>
                        </View>
                        <View style={styles.number_of_ticket_view}>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(1,'minus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/minus.png')}></Image>
                            </TouchableOpacity>
                            <View style={styles.vertical_line}></View>
                            <Text style={[styles.number_of_ticket_text,{color:Tickets[1]===0?'#000000':'#D83714'}]}>{Tickets[1]}</Text>
                            <View style={styles.vertical_line}></View>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(1,'plus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/plus.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.seg_line,{width: '80%',height: '0.2%'}]}></View>
                    <View style={styles.ticket_view}>
                        <View style={styles.ticket_info}>
                            <Text style={styles.ticket_type_text}>敬老</Text>
                            <Text style={styles.ticket_info_text}>65歲以上之本國國民</Text>
                        </View>
                        <View style={styles.number_of_ticket_view}>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(2,'minus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/minus.png')}></Image>
                            </TouchableOpacity>
                            <View style={styles.vertical_line}></View>
                            <Text style={[styles.number_of_ticket_text,{color:Tickets[2]===0?'#000000':'#D83714'}]}>{Tickets[2]}</Text>
                            <View style={styles.vertical_line}></View>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(2,'plus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/plus.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.seg_line,{width: '80%',height: '0.2%'}]}></View>
                    <View style={styles.ticket_view}>
                        <View style={styles.ticket_info}>
                            <Text style={styles.ticket_type_text}>愛心</Text>
                            <Text style={styles.ticket_info_text}>持有身心障礙證明之本國國民</Text>
                        </View>
                        <View style={styles.number_of_ticket_view}>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(3,'minus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/minus.png')}></Image>
                            </TouchableOpacity>
                            <View style={styles.vertical_line}></View>
                            <Text style={[styles.number_of_ticket_text,{color:Tickets[3]===0?'#000000':'#D83714'}]}>{Tickets[3]}</Text>
                            <View style={styles.vertical_line}></View>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(3,'plus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/plus.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.seg_line,{width: '80%',height: '0.2%'}]}></View>
                    {TypeText==='標準車廂' &&(
                        <View style={styles.ticket_view}>
                        <View style={styles.ticket_info}>
                            <Text style={styles.ticket_type_text}>大學生</Text>
                            <Text style={styles.ticket_info_text}>持本國大專院校有效學生證之學生</Text>
                        </View>
                        <View style={styles.number_of_ticket_view}>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(4,'minus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/minus.png')}></Image>
                            </TouchableOpacity>
                            <View style={styles.vertical_line}></View>
                            <Text style={[styles.number_of_ticket_text,{color:Tickets[4]===0?'#000000':'#D83714'}]}>{Tickets[4]}</Text>
                            <View style={styles.vertical_line}></View>
                            <TouchableOpacity style={styles.plus_minus_btn} onPress={()=>{setTicketNumber(4,'plus')}}>
                                <Image style={styles.plus_minus_img} source={require('./icons/plus.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>)}
                    {TypeText==='標準車廂' &&(
                        <View style={[styles.seg_line,{width: '80%',height: '0.2%'}]}></View>)}
                    <View style={[styles.complete_view]} >
                        <TouchableOpacity style={styles.complete_btn} onPress={countTicket}>
                            <Text style={styles.complete_text}>完成</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal style={styles.overlay} animationType="slide" transparent={true} visible={TypeVisible} onRequestClose={() => setModalVisible(!TypeVisible)}>
                <TouchableWithoutFeedback onPress={()=>setTypeVisible(!TypeVisible)}>
                    <View  style={{position:'absolute',width:'100%',height:'100%',top:0,left:0,backgroundColor:'rgba(0,0,0,.5)'}}/>
                </TouchableWithoutFeedback>
                <View style={[styles.menu,{height:'20%'}]}>
                    <View style={styles.title}>
                        <Text style={styles.title_text}>選擇車廂種類</Text>
                    </View>
                    <View style={styles.seg_line}></View>
                    <TouchableOpacity style={styles.choices} onPress={()=>{setTypeVisible(!TypeVisible);TypeChoose(0);}}>
                        <Text style={styles.menu_text}>標準車廂</Text>
                    </TouchableOpacity>
                    <View style={styles.seg_line}></View>
                    <TouchableOpacity style={styles.choices} onPress={()=>{setTypeVisible(!TypeVisible);TypeChoose(1);}}>
                        <Text style={styles.menu_text}>商務車廂</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.cancel_btn} onPress={() => setTypeVisible(!TypeVisible)}>
                    <Text style={styles.cancel_text}>取消</Text>
                </TouchableOpacity>

            </Modal>

            <View style={styles.ebox}>
                <TouchableOpacity style={styles.diferent_pages} onPress={()=>{setPage(0);setStarted(true);}}>
                    <Image source={Page===0?require('./icons/Ticket_orange.png'):require('./icons/Ticket_gray.png')} style={styles.icons}></Image>
                    <Text style={[styles.icons_text,{color:Page===0?'#D83714':'#A3A3A3'}]}>我的車票</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.diferent_pages} onPress={()=>{setPage(1);setStarted(true);}}>
                    <Image source={Page===1?require('./icons/book_orange.png'):require('./icons/book_gray.png')} style={styles.icons}></Image>
                    <Text style={[styles.icons_text,{color:Page===1?'#D83714':'#A3A3A3'}]}>訂票</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.diferent_pages} onPress={()=>{setPage(2);setStarted(true);}}>
                    <Image source={Page===2?require('./icons/Buy_orange.png'):require('./icons/Buy_gray.png')} style={styles.icons}></Image>
                    <Text style={[styles.icons_text,{color:Page===2?'#D83714':'#A3A3A3'}]}>付款/取票</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.diferent_pages} onPress={()=>{setPage(3);setStarted(true);}}>
                    <Image source={Page===3?require('./icons/load_orange.png'):require('./icons/load_gray.png')} style={styles.icons}></Image>
                    <Text style={[styles.icons_text,{color:Page===3?'#D83714':'#A3A3A3'}]}>載入訂位</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.diferent_pages} onPress={()=>{setPage(4);setStarted(true);}}>
                    <Image source={Page===4?require('./icons/others_orange.png'):require('./icons/others_gray.png')} style={[styles.icons,{width:'40%'}]}></Image>
                    <Text style={[styles.icons_text,{color:Page===4?'#D83714':'#A3A3A3'}]}>其他</Text>
                </TouchableOpacity>
            </View>

            <Modal animationType="slide" transparent={false} visible={BookVisible} onRequestClose={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',[{text: '取消'},{text: '確定', onPress: () => {setBookVisible(false);}}])}}>
                <View style={Booking_style.container}>
                    <View style={Booking_style.hbox}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'22%'}]} onPress={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',
                            [
                                {text: '取消'},
                                {text: '確定', onPress: () => {setBookVisible(false);}},
                            ])}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.title}>{Titletext}</Text>
                        <View style={Booking_style.direction_view}>
                            <Text style={Booking_style.start_end_text}>{start}</Text>
                            <Text style={Booking_style.start_end_text}>------></Text>
                            <Text style={Booking_style.start_end_text}>{end}</Text>
                        </View>
                    </View>
                    <View style={Booking_style.time_view}>
                        <Text style={Booking_style.bookingtime_text}>{gotime}</Text>
                    </View>
                    <ScrollView style={Booking_style.menu}>{
                        datas.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={Booking_style.cards} onPress={()=>{gobook(index);}}>
                                    <View style={Booking_style.up}>
                                        <Text style={Booking_style.timetext}>{item.StartTime}</Text>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.order_text}>------></Text>
                                            <Text style={Booking_style.order_text}>{item.Order}</Text>
                                        </View>
                                        <Text style={Booking_style.timetext}>{item.ArriveTime}</Text>
                                    </View>
                                    <View style={Booking_style.seg_line}></View>
                                    <View style={Booking_style.down}>
                                        <View style={Booking_style.totaltime_view}>
                                            <Image style={Booking_style.down_icons} source={require('./icons/time.png')}></Image>
                                            <Text style={Booking_style.totaltimetext}>{getTotalTime(item.StartTime,item.ArriveTime)}</Text>
                                        </View>
                                        <TouchableOpacity key={index} style={Booking_style.route_btn} onPress={()=>{setStationsByDatas(item.StationsBy);setStationsByOrder(item.Order);setBookStationsByVisible(true);setBookVisible(false);}}>
                                            <Image style={Booking_style.route_img} source={require('./icons/route.png')}></Image>
                                            <Text style={Booking_style.totaltimetext}>查看停靠站</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    </ScrollView>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={BookStationsByVisible} onRequestClose={() =>{setBookVisible(true);setBookStationsByVisible(false);}}>
                <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setBookVisible(true);setBookStationsByVisible(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>車次 {StationsByOrder}</Text>
                    </View>
                    <View style={Booking_style.wcard}>
                        <View style={Booking_style.upcard}>
                            <Text style={[Booking_style.uptext,{textAlign:'right'}]}>發車時間</Text>
                            <View style={{flex:2}}></View>
                            <Text style={[Booking_style.uptext,{textAlign:'left'}]}>停靠站</Text>
                        </View>
                        <View style={[Booking_style.seg_line,{marginTop:'5%',height:1}]}></View>
                        <View style={Booking_style.downcard}>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D83714'}]}>{item}</Text>
                                        )
                                    }
                                    else if(item.length===0){
                                        return(
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#FFFFFF'}]}>00</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D9D9D9'}]}>{item}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                            <View style={Booking_style.cardforcircle}>
                            </View>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(item.length===0){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D9D9D9'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D83714'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#000000'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                        </View>
                        <TouchableOpacity style={Booking_style.cardclose} onPress={()=>{setBookVisible(true);setBookStationsByVisible(false);}}>
                            <Text style={Booking_style.cardclosetext}>關閉</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal animationType="slide" transparent={false} visible={BackBookVisible} onRequestClose={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',[{text: '取消'},{text: '確定', onPress: () => {setBackBookVisible(false);}}])}}>
                <View style={Booking_style.container}>
                    <View style={Booking_style.hbox}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'22%'}]} onPress={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',
                            [
                                {text: '取消'},
                                {text: '確定', onPress: () => {setBackBookVisible(false);}},
                            ])}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.title}>回程</Text>
                        <View style={Booking_style.direction_view}>
                            <Text style={Booking_style.start_end_text}>{end}</Text>
                            <Text style={Booking_style.start_end_text}>------></Text>
                            <Text style={Booking_style.start_end_text}>{start}</Text>
                        </View>
                    </View>
                    <View style={Booking_style.time_view}>
                        <Text style={Booking_style.bookingtime_text}>{backtime}</Text>
                    </View>
                    <ScrollView style={Booking_style.menu}>{
                        backdatas.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={Booking_style.cards} onPress={()=>{backbook(index);}}>
                                    <View style={Booking_style.up}>
                                        <Text style={Booking_style.timetext}>{item.StartTime}</Text>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.order_text}>------></Text>
                                            <Text style={Booking_style.order_text}>{item.Order}</Text>
                                        </View>
                                        <Text style={Booking_style.timetext}>{item.ArriveTime}</Text>
                                    </View>
                                    <View style={Booking_style.seg_line}></View>
                                    <View style={Booking_style.down}>
                                        <View style={Booking_style.totaltime_view}>
                                            <Image style={Booking_style.down_icons} source={require('./icons/time.png')}></Image>
                                            <Text style={Booking_style.totaltimetext}>{getTotalTime(item.StartTime,item.ArriveTime)}</Text>
                                        </View>
                                        <TouchableOpacity style={Booking_style.route_btn} onPress={()=>{setStationsByOrder(item.Order);setStationsByDatas(item.StationsBy);setBackBookStationsByVisible(true);setBackBookVisible(false);}}>
                                            <Image style={Booking_style.route_img} source={require('./icons/route.png')}></Image>
                                            <Text style={Booking_style.totaltimetext}>查看停靠站</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    </ScrollView>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={BackBookStationsByVisible} onRequestClose={() =>{setBackBookVisible(true);setBackBookStationsByVisible(false);}}>
                <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setBackBookVisible(true);setBackBookStationsByVisible(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>車次 {StationsByOrder}</Text>
                    </View>
                    <View style={Booking_style.wcard}>
                        <View style={Booking_style.upcard}>
                            <Text style={[Booking_style.uptext,{textAlign:'right'}]}>發車時間</Text>
                            <View style={{flex:2}}></View>
                            <Text style={[Booking_style.uptext,{textAlign:'left'}]}>停靠站</Text>
                        </View>
                        <View style={[Booking_style.seg_line,{marginTop:'5%',height:1}]}></View>
                        <View style={Booking_style.downcard}>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D83714'}]}>{item}</Text>
                                        )
                                    }
                                    else if(item.length===0){
                                        return(
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#FFFFFF'}]}>00</Text>
                                        )
                                    }
                                    else if(item.length===0){
                                        return(
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#FFFFFF'}]}>00</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D9D9D9'}]}>{item}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                            <View style={Booking_style.cardforcircle}>
                            </View>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(item.length===0){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D9D9D9'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D83714'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#000000'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                        </View>
                        <TouchableOpacity style={Booking_style.cardclose} onPress={()=>{setBackBookVisible(true);setBackBookStationsByVisible(false);}}>
                            <Text style={Booking_style.cardclosetext}>關閉</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal animationType="slide" transparent={false} visible={IDcheckVisible} onRequestClose={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',[{text: '取消'},{text: '確定', onPress: () => {setIDcheckVisible(false);}}])}}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                    <View style={Booking_style.hbox}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',
                            [
                                {text: '取消'},
                                {text: '確定', onPress: () => {setIDcheckVisible(false);}},
                            ])}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>取票人資訊</Text>
                    </View>
                    <View style={Booking_style.time_view}>
                        <Text style={Booking_style.info_text}>請填入基本資訊</Text>
                    </View>
                    <ScrollView style={Booking_style.info_menu}>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>姓名(Last name and First name)</Text>
                            <TextInput style={Booking_style.input} onChangeText={setName} value={Name} placeholder="童維維"></TextInput>
                        </View>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>性別(Gender)</Text>
                            <View style={Booking_style.gender_bg}>
                                <View style={[Booking_style.white_bar,{left:Gender?'0%':'50%'}]}></View>
                                <TouchableOpacity onPress={()=>{changeGender(0);}} style={Booking_style.input}>
                                    <Text style={Booking_style.item_text}>男(Male)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{changeGender(1);}} style={Booking_style.input}>
                                    <Text style={Booking_style.item_text}>女(Female)</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>身分證字號(ID-number)</Text>
                            <TextInput style={Booking_style.input} maxLength={10} onChangeText={setIDnumber} value={IDnumber} placeholder="A123456789"></TextInput>
                        </View>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>手機號碼(Phone-number)</Text>
                            <TextInput style={Booking_style.input} maxLength={10} onChangeText={setPhonenumber} value={Phonenumber} placeholder="0912345678" keyboardType='numeric'></TextInput>
                        </View>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>電子郵箱(E-mail)</Text>
                            <TextInput style={Booking_style.input} onChangeText={setEmail} value={Email} placeholder="abc@xxx.com"></TextInput>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={[Booking_style.submit_btn,{marginBottom:'10%'}]} onPress={LoginComplete}>
                        <Text style={Booking_style.submit_text}>送出訂位資訊</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={InfoVisible} onRequestClose={() => setInfoVisible(!InfoVisible)}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                    <View style={[Booking_style.hbox,{height:'10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setInfoVisible(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>個人基本資訊</Text>
                    </View>
                    <View style={Booking_style.time_view}>
                        <Text style={Booking_style.info_text}>請填入基本資訊</Text>
                    </View>
                    <ScrollView style={Booking_style.info_menu}>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>姓名(Last name and First name)</Text>
                            <TextInput style={Booking_style.input} onChangeText={setName} value={Name} placeholder="童維維"></TextInput>
                        </View>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>性別(Gender)</Text>
                            <View style={Booking_style.gender_bg}>
                                <View style={[Booking_style.white_bar,{left:Gender?'0%':'50%'}]}></View>
                                <TouchableOpacity onPress={()=>{changeGender(0);}} style={Booking_style.input}>
                                    <Text style={Booking_style.item_text}>男(Male)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{changeGender(1);}} style={Booking_style.input}>
                                    <Text style={Booking_style.item_text}>女(Female)</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>身分證字號(ID-number)</Text>
                            <TextInput style={Booking_style.input} maxLength={10} onChangeText={setIDnumber} value={IDnumber} placeholder="A123456789"></TextInput>
                        </View>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>手機號碼(Phone-number)</Text>
                            <TextInput style={Booking_style.input} maxLength={10} onChangeText={setPhonenumber} value={Phonenumber} placeholder="0912345678" keyboardType='numeric'></TextInput>
                        </View>
                        <View style={Booking_style.info_view}>
                            <Text style={Booking_style.item_text}>電子郵箱(E-mail)</Text>
                            <TextInput style={Booking_style.input} onChangeText={setEmail} value={Email} placeholder="abc@xxx.com"></TextInput>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={[Booking_style.submit_btn,{marginBottom:'10%'}]} onPress={InfoComplete}>
                        <Text style={Booking_style.submit_text}>完成</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={DetailsVisible} onRequestClose={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',[{text: '取消'},{text: '確定', onPress: () => {setDetailsVisible(false);setCheck(false);}}])}}>
                <View style={styles.container}>
                    <View style={Booking_style.hbox}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',
                            [
                                {text: '取消'},
                                {text: '確定', onPress: () => {setDetailsVisible(false);setCheck(false);}},
                            ])}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.Details_title}>訂位明細</Text>
                    </View>
                    <View style={Booking_style.Details_view}>
                        <View style={Booking_style.tickets_view}>
                            <View style={{flex:1}}>
                                <Text>{oneway_return?'去程':'單程'} · {gotime}</Text>
                            </View>
                            <View style={{flex:3,flexDirection:'row'}}>
                                <View style={Booking_style.up}>
                                    <View style={Booking_style.order_view}>
                                        <Text style={Booking_style.Stations_text}>{StartstationText}</Text>
                                        <Text style={[Booking_style.timetext,{fontSize:oneway_return?22:25}]}>{Tickinfo[1]}</Text>
                                    </View>
                                    <View style={Booking_style.order_view}>
                                        <Text style={Booking_style.order_text}>------></Text>
                                        <Text style={Booking_style.order_text}>{Tickinfo[0]}</Text>
                                    </View>
                                    <View style={Booking_style.order_view}>
                                        <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{EndstationText}</Text>
                                        <Text style={[Booking_style.timetext,{fontSize:oneway_return?22:25}]}>{Tickinfo[2]}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[Booking_style.seg_line,{height:'0.5%',width: '100%'}]}></View>
                        {oneway_return===true && (
                            <View style={Booking_style.tickets_view}>
                                <View style={{flex:1}}>
                                    <Text>回程 · {backtime}</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row'}}>
                                    <View style={Booking_style.up}>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.Stations_text}>{EndstationText}</Text>
                                            <Text style={[Booking_style.timetext,{fontSize:22}]}>{BackTickinfo[1]}</Text>
                                        </View>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.order_text}>------></Text>
                                            <Text style={Booking_style.order_text}>{BackTickinfo[0]}</Text>
                                        </View>
                                        <View style={Booking_style.order_view}>
                                            <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{StartstationText}</Text>
                                            <Text style={[Booking_style.timetext,{fontSize:22}]}>{BackTickinfo[2]}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                        {oneway_return &&(
                            <View style={[Booking_style.seg_line,{height:'0.5%',width: '100%'}]}></View>
                        )}
                        <View style={Booking_style.cost_view}>
                            <View style={[Booking_style.cost_info_view,{flex:1}]}>
                                <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}></Text>
                                <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>全票</Text>
                                <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>孩童</Text>
                                <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>敬老</Text>
                                <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>愛心</Text>
                                <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>大學生</Text>
                            </View>
                            <View style={Booking_style.cost_info_view}>
                                <Text style={[Booking_style.cost_info_title]}>票數</Text>
                                <Text style={Booking_style.cost_info_text}>{oneway_return? Tickets[0]*2:Tickets[0]}</Text>
                                <Text style={Booking_style.cost_info_text}>{oneway_return? Tickets[1]*2:Tickets[1]}</Text>
                                <Text style={Booking_style.cost_info_text}>{oneway_return? Tickets[2]*2:Tickets[2]}</Text>
                                <Text style={Booking_style.cost_info_text}>{oneway_return? Tickets[3]*2:Tickets[3]}</Text>
                                <Text style={Booking_style.cost_info_text}>{oneway_return? Tickets[4]*2:Tickets[4]}</Text>
                            </View>
                            <View style={Booking_style.cost_info_view}>
                                <Text style={Booking_style.cost_info_title}>小計</Text>
                                <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[0])}</Text>
                                <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[1])}</Text>
                                <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[2])}</Text>
                                <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[3])}</Text>
                                <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[4])}</Text>
                            </View>
                        </View>
                        <View style={[Booking_style.seg_line,{height:'0.5%',width: '100%'}]}></View>
                        <View style={Booking_style.totalcost_view}>
                            <View style={[Booking_style.cost_info_view,{flex:1}]}>
                                <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>{TypeText}/總計</Text>
                            </View>
                            <View style={Booking_style.cost_info_view}>
                                <Text style={Booking_style.cost_info_text}>{oneway_return? Number(sumTickets)*2:sumTickets}</Text>
                            </View>
                            <View style={Booking_style.cost_info_view}>
                                <Text style={[Booking_style.cost_info_text,{color:'#D83714'}]}>TWD {moneyManifest(Allprices)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={Booking_style.notice_view}>
                        <TouchableOpacity style={Booking_style.check_btn} onPress={()=>{setCheck(!Check);}}>
                            <Image style={Booking_style.check_img} source={Check?require('./icons/check.png'):require('./icons/uncheck.png')}></Image>
                        </TouchableOpacity>
                        <Hyperlink linkDefault={true} style={{alignSelf:'center',justifyContent:'center'}} linkStyle={ { color: '#D83714',textDecorationLine:'underline' } } linkText={url => url === RefundUrl ? '線上購票交易及取消/退票注意事項' : url}>
                            <Text style={Booking_style.notice_text}>我已了解並同意{RefundUrl}</Text>
                        </Hyperlink>
                    </View>
                    <TouchableOpacity onPress={()=>setBook(true)} style={[Booking_style.submit_btn,{flex:0.2,bottom: '3%'}]}>
                        <Text style={Booking_style.submit_text}>確認車次</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={PaidTicketVisible} onRequestClose={() => setPaidTicketVisible(!PaidTicketVisible)}>
                <View style={styles.container}>
                    <View style={ticket_style.header}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'10%'}]} onPress={()=>{setPaidTicketVisible(false)}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={ticket_style.header_text}>票證資訊</Text>
                    </View>
                    <View style={ticket_style.cenview}>
                        <ScrollView style={ticket_style.scview}>
                            <View style={ticket_style.card1}>
                                <View style={ticket_style.up}>
                                    <Text style={ticket_style.left_text}>訂位代號</Text>
                                    <Text style={ticket_style.right_text}>{TicketDatas.CodeNumber}</Text>
                                </View>
                                <View style={ticket_style.seg_line}></View>
                                <View style={ticket_style.info_view}>
                                    <View style={ticket_style.info_part}>
                                        <Text style={ticket_style.up_info}>交易狀態</Text>
                                        <Text style={[ticket_style.down_info,{color:'#000000'}]}>{TicketDatas.BussinessState?'已使用':'已付款'}</Text>
                                    </View>
                                    <View style={ticket_style.info_part}>
                                        <Text style={ticket_style.up_info}>付款期限</Text>
                                        <Text style={ticket_style.down_info}>{TicketDatas.BussinessState?'已使用':'已付款'}</Text>
                                    </View>
                                    <View style={ticket_style.info_part}>
                                        <Text style={ticket_style.up_info}>行程 / 車廂 / 票種</Text>
                                        <Text style={ticket_style.down_info}>{TicketDatas.OnewayReturn?'去回票':'單程票'} / {TicketDatas.Type} / 對號座</Text>
                                    </View>
                                    <View style={ticket_style.info_part}>
                                        <Text style={ticket_style.up_info}>票數</Text>
                                        <Text style={ticket_style.down_info}>{TicketDatas.TotalText}</Text>
                                    </View>
                                </View>
                                <View style={ticket_style.seg_line}></View>
                                <View style={ticket_style.up}>
                                    <Text style={ticket_style.down_left}>總票價</Text>
                                    <Text style={ticket_style.down_right}>TWD {moneyManifest(TicketDatas.TotalPrice)}</Text>
                                </View>
                            </View>
                            {!(TicketDatas.BussinessState) &&(
                                <View style={[ticket_style.card2,{height:150,justifyContent:'center',alignSelf: 'center',alignContent:'center'}]}>
                                    <Text style={{width:'100%',textAlign:'center',textAlignVertical:'center',marginTop:'5%',fontWeight:'bold',fontSize:15,marginBottom:'2.5%'}}>點擊下方票券 進行分票</Text>
                                    <View style={{width:'100%',flexDirection:'row',height:100,justifyContent:'center',alignSelf: 'center',alignContent:'center'}}>
                                        <TouchableOpacity style={{marginLeft:'5%',margin:'2.5%',flex:1,backgroundColor:'#D9D9D9',borderRadius:5,justifyContent:'space-around',alignContent:'space-around'}} onPress={()=>{GetQRCode(0,TicketDatas.NumOfTickets[0],TicketDatas.NumOfTickets[0]);}}>
                                            <Text style={{textAlign:'center',textAlignVertical:'center'}}>全票</Text>
                                            <Text style={{fontSize:20,textAlign:'center',textAlignVertical:'center',color:TicketDatas.NumOfTickets[0]===0?'#000000':'#D83714'}}>{TicketDatas.NumOfTickets[0]}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{margin:'2.5%',flex:1,backgroundColor:'#D9D9D9',borderRadius:5,justifyContent:'space-around',alignContent:'space-around'}} onPress={()=>{GetQRCode(1,TicketDatas.NumOfTickets[1],TicketDatas.NumOfTickets[0]+TicketDatas.NumOfTickets[1]);}}>
                                            <Text style={{textAlign:'center',textAlignVertical:'center'}}>孩童</Text>
                                            <Text style={{fontSize:20,textAlign:'center',textAlignVertical:'center',color:TicketDatas.NumOfTickets[1]===0?'#000000':'#D83714'}}>{TicketDatas.NumOfTickets[1]}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{margin:'2.5%',flex:1,backgroundColor:'#D9D9D9',borderRadius:5,justifyContent:'space-around',alignContent:'space-around'}} onPress={()=>{GetQRCode(2,TicketDatas.NumOfTickets[2],TicketDatas.NumOfTickets[0]+TicketDatas.NumOfTickets[1]+TicketDatas.NumOfTickets[2]);}}>
                                            <Text style={{textAlign:'center',textAlignVertical:'center'}}>敬老</Text>
                                            <Text style={{fontSize:20,textAlign:'center',textAlignVertical:'center',color:TicketDatas.NumOfTickets[2]===0?'#000000':'#D83714'}}>{TicketDatas.NumOfTickets[2]}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{margin:'2.5%',flex:1,backgroundColor:'#D9D9D9',borderRadius:5,justifyContent:'space-around',alignContent:'space-around'}} onPress={()=>{GetQRCode(3,TicketDatas.NumOfTickets[3],TicketDatas.NumOfTickets[0]+TicketDatas.NumOfTickets[1]+TicketDatas.NumOfTickets[2]+TicketDatas.NumOfTickets[3]);}}>
                                            <Text style={{textAlign:'center',textAlignVertical:'center'}}>愛心</Text>
                                            <Text style={{fontSize:20,textAlign:'center',textAlignVertical:'center',color:TicketDatas.NumOfTickets[3]===0?'#000000':'#D83714'}}>{TicketDatas.NumOfTickets[3]}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{marginRight:'5%',margin:'2.5%',flex:1,backgroundColor:'#D9D9D9',borderRadius:5,justifyContent:'space-around',alignContent:'space-around'}} onPress={()=>{GetQRCode(4,TicketDatas.NumOfTickets[4],TicketDatas.NumOfTickets[0]+TicketDatas.NumOfTickets[1]+TicketDatas.NumOfTickets[2]+TicketDatas.NumOfTickets[3]+TicketDatas.NumOfTickets[4]);}}>
                                            <Text style={{textAlign:'center',textAlignVertical:'center'}}>大學生</Text>
                                            <Text style={{fontSize:20,textAlign:'center',textAlignVertical:'center',color:TicketDatas.NumOfTickets[4]===0?'#000000':'#D83714'}}>{TicketDatas.NumOfTickets[4]}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <View style={ticket_style.card2}>
                                <View style={[ticket_style.up,{flexDirection: 'row',justifyContent: 'space-between'}]}>
                                    <Text style={[ticket_style.left_text]}>{TicketDatas.OnewayReturn?'去程':'單程'} · {TicketDatas.Start.Date}</Text>
                                    <TouchableOpacity style={{marginTop:'5%',marginRight:'5%',borderRadius:5,borderColor:'#D83714',borderWidth:1,alignSelf:'center',alignContent:'center'}} onPress={()=>{setStationsByOrder(TicketDatas.Start.Order);setStationsByDatas(TicketDatas.Start.StationsBy);setPaidTicketStationsByVisible(true);setPaidTicketVisible(false);}}>
                                        <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',color:'#D87413',fontWeight:'bold',fontSize:12}}>查看停靠站</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[ticket_style.seg_line,{height:0.5}]}></View>
                                <View>
                                    <View style={{flexDirection:'row',width:'90%',alignSelf:'center'}}>
                                        <View style={Booking_style.up}>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.Stations_text}>{TicketDatas.StartStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Start.StartTime}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.order_text}>------></Text>
                                                <Text style={Booking_style.order_text}>{TicketDatas.Start.Order}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{TicketDatas.ArriveStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Start.ArriveTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {TicketDatas.BussinessState &&(TicketDatas.Start.Tickets.map((item,index)=>{
                                        return (
                                            <View key={index} style={ticket_style.cards}>
                                                <Text style={ticket_style.typetext}>{item.Type}</Text>
                                                <Text style={ticket_style.seatpostext}>{item.Position}</Text>
                                                <View style={[ticket_style.black_seg_line,{height:1}]}></View>
                                                <Text style={ticket_style.costtext}>TWD {moneyManifest(item.Price)}</Text>
                                            </View>

                                        );
                                    }))}
                                </View>
                            </View>
                            {TicketDatas.OnewayReturn &&(
                                <View style={ticket_style.card2}>
                                    <View style={[ticket_style.up,{flexDirection: 'row',justifyContent: 'space-between'}]}>
                                        <Text style={[ticket_style.left_text]}>{TicketDatas.OnewayReturn?'回程':'單程'} · {TicketDatas.Arrive.Date}</Text>
                                        <TouchableOpacity style={{marginTop:'5%',marginRight:'5%',borderRadius:5,borderColor:'#D83714',borderWidth:1,alignSelf:'center',alignContent:'center'}} onPress={()=>{setStationsByOrder(TicketDatas.Arrive.Order);setStationsByDatas(TicketDatas.Arrive.StationsBy);setPaidTicketStationsByVisible(true);setPaidTicketVisible(false);}}>
                                            <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',color:'#D87413',fontWeight:'bold',fontSize:12}}>查看停靠站</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[ticket_style.seg_line,{height:0.5}]}></View>
                                    <View>
                                        <View style={{flexDirection:'row',width:'90%',alignSelf:'center'}}>
                                            <View style={Booking_style.up}>
                                                <View style={Booking_style.order_view}>
                                                    <Text style={Booking_style.Stations_text}>{TicketDatas.ArriveStation}</Text>
                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Arrive.StartTime}</Text>
                                                </View>
                                                <View style={Booking_style.order_view}>
                                                    <Text style={Booking_style.order_text}>------></Text>
                                                    <Text style={Booking_style.order_text}>{TicketDatas.Arrive.Order}</Text>
                                                </View>
                                                <View style={Booking_style.order_view}>
                                                    <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{TicketDatas.StartStation}</Text>
                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Arrive.ArriveTime}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {TicketDatas.BussinessState && (TicketDatas.Arrive.Tickets.map((item,index)=>{
                                            return (
                                                <View key={index} style={ticket_style.cards}>
                                                    <Text style={ticket_style.typetext}>{item.Type}</Text>
                                                    <Text style={ticket_style.seatpostext}>{item.Position}</Text>
                                                    <View style={[ticket_style.black_seg_line,{height:1}]}></View>
                                                    <Text style={ticket_style.costtext}>TWD {item.Price}</Text>
                                                </View>
                                            );
                                        }))}
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    <View style={ticket_style.btview}>
                        <TouchableOpacity style={ticket_style.paybtn} onPress={()=>{distribute(TicketDatas.BussinessState,PayOrUseIndex);}}>
                            <Text style={ticket_style.paytext}>{TicketDatas.BussinessState?'刪除票券':'立即取票'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={QRCodeVisible} onRequestClose={() => {checkGot()}}>
                <View style={styles.container}>
                    <View style={ticket_style.header}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'10%'}]} onPress={()=>{checkGot()}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={ticket_style.header_text}>票證資訊</Text>
                    </View>
                    <View style={ticket_style.cenview}>
                        <ScrollView style={ticket_style.scview}>
                            <View style={ticket_style.card1}>
                                <View style={ticket_style.up}>
                                    <Text style={ticket_style.left_text}>訂位代號</Text>
                                    <Text style={ticket_style.right_text}>{TicketDatas.CodeNumber}</Text>
                                </View>
                                <View style={ticket_style.seg_line}></View>
                                <View style={[ticket_style.info_view,{flex:1}]}>
                                    <View style={{width:'100%',height:'100%',alignSelf:'center',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                        <QRCode value={JSON.stringify(QRCodeData)} size={300} logo={require('./icons/logo.png')} logoSize={100}></QRCode>
                                    </View>
                                </View>
                            </View>
                            <View style={ticket_style.card2}>
                                <View style={[ticket_style.up,{flexDirection: 'row',justifyContent: 'space-between'}]}>
                                    <Text style={[ticket_style.left_text]}>{TicketDatas.OnewayReturn?'去程':'單程'} · {TicketDatas.Start.Date}</Text>
                                    <TouchableOpacity style={{marginTop:'5%',marginRight:'5%',borderRadius:5,borderColor:'#D83714',borderWidth:1,alignSelf:'center',alignContent:'center'}} onPress={()=>{setStationsByOrder(TicketDatas.Start.Order);setStationsByDatas(TicketDatas.Start.StationsBy);setQRTicketStationsByVisible(true);setQRCodeVisible(false);}}>
                                        <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',color:'#D87413',fontWeight:'bold',fontSize:12}}>查看停靠站</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[ticket_style.seg_line,{height:0.5}]}></View>
                                <View>
                                    <View style={{flexDirection:'row',width:'90%',alignSelf:'center'}}>
                                        <View style={Booking_style.up}>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.Stations_text}>{TicketDatas.StartStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Start.StartTime}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.order_text}>------></Text>
                                                <Text style={Booking_style.order_text}>{TicketDatas.Start.Order}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{TicketDatas.ArriveStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Start.ArriveTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {TicketDatas.OnewayReturn &&(
                                <View style={ticket_style.card2}>
                                    <View style={[ticket_style.up,{flexDirection: 'row',justifyContent: 'space-between'}]}>
                                        <Text style={[ticket_style.left_text]}>{TicketDatas.OnewayReturn?'回程':'單程'} · {TicketDatas.Arrive.Date}</Text>
                                        <TouchableOpacity style={{marginTop:'5%',marginRight:'5%',borderRadius:5,borderColor:'#D83714',borderWidth:1,alignSelf:'center',alignContent:'center'}} onPress={()=>{setStationsByOrder(TicketDatas.Arrive.Order);setStationsByDatas(TicketDatas.Arrive.StationsBy);setQRTicketStationsByVisible(true);setQRCodeVisible(false);}}>
                                            <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',color:'#D87413',fontWeight:'bold',fontSize:12}}>查看停靠站</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[ticket_style.seg_line,{height:0.5}]}></View>
                                    <View>
                                        <View style={{flexDirection:'row',width:'90%',alignSelf:'center'}}>
                                            <View style={Booking_style.up}>
                                                <View style={Booking_style.order_view}>
                                                    <Text style={Booking_style.Stations_text}>{TicketDatas.ArriveStation}</Text>
                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Arrive.StartTime}</Text>
                                                </View>
                                                <View style={Booking_style.order_view}>
                                                    <Text style={Booking_style.order_text}>------></Text>
                                                    <Text style={Booking_style.order_text}>{TicketDatas.Arrive.Order}</Text>
                                                </View>
                                                <View style={Booking_style.order_view}>
                                                    <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{TicketDatas.StartStation}</Text>
                                                    <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Arrive.ArriveTime}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    <View style={ticket_style.btview}>
                        <TouchableOpacity style={ticket_style.paybtn} onPress={()=>{checkGot();}}>
                            <Text style={ticket_style.paytext}>返回</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={QRTicketStationsByVisible} onRequestClose={() =>{setQRCodeVisible(true);setQRTicketStationsByVisible(false);}}>
                <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setQRCodeVisible(true);setQRTicketStationsByVisible(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>車次 {StationsByOrder}</Text>
                    </View>
                    <View style={Booking_style.wcard}>
                        <View style={Booking_style.upcard}>
                            <Text style={[Booking_style.uptext,{textAlign:'right'}]}>發車時間</Text>
                            <View style={{flex:2}}></View>
                            <Text style={[Booking_style.uptext,{textAlign:'left'}]}>停靠站</Text>
                        </View>
                        <View style={[Booking_style.seg_line,{marginTop:'5%',height:1}]}></View>
                        <View style={Booking_style.downcard}>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D83714'}]}>{item}</Text>
                                        )
                                    }
                                    else if(item.length===0){
                                        return(
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#FFFFFF'}]}>00</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D9D9D9'}]}>{item}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                            <View style={Booking_style.cardforcircle}>
                            </View>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(item.length===0){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D9D9D9'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D83714'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#000000'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                        </View>
                        <TouchableOpacity style={Booking_style.cardclose} onPress={()=>{setQRCodeVisible(true);setQRTicketStationsByVisible(false);}}>
                            <Text style={Booking_style.cardclosetext}>關閉</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal animationType="slide" transparent={false} visible={PayTicketStationsByVisible} onRequestClose={() =>{setPayticketVisible(true);setPayTicketStationsByVisible(false);}}>
                <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setPayticketVisible(true);setPayTicketStationsByVisible(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>車次 {StationsByOrder}</Text>
                    </View>
                    <View style={Booking_style.wcard}>
                        <View style={Booking_style.upcard}>
                            <Text style={[Booking_style.uptext,{textAlign:'right'}]}>發車時間</Text>
                            <View style={{flex:2}}></View>
                            <Text style={[Booking_style.uptext,{textAlign:'left'}]}>停靠站</Text>
                        </View>
                        <View style={[Booking_style.seg_line,{marginTop:'5%',height:1}]}></View>
                        <View style={Booking_style.downcard}>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D83714'}]}>{item}</Text>
                                        )
                                    }
                                    else if(item.length===0){
                                        return(
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#FFFFFF'}]}>00</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D9D9D9'}]}>{item}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                            <View style={Booking_style.cardforcircle}>
                            </View>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(item.length===0){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D9D9D9'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D83714'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#000000'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                        </View>
                        <TouchableOpacity style={Booking_style.cardclose} onPress={()=>{setPayticketVisible(true);setPayTicketStationsByVisible(false);}}>
                            <Text style={Booking_style.cardclosetext}>關閉</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal animationType="slide" transparent={false} visible={PayticketVisible} onRequestClose={() => setPayticketVisible(!PayticketVisible)}>
                <View style={styles.container}>
                    <View style={ticket_style.header}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'10%'}]} onPress={()=>{setPayticketVisible(false)}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={ticket_style.header_text}>票證資訊</Text>
                    </View>
                    <View style={ticket_style.cenview}>
                        <ScrollView style={ticket_style.scview}>
                            <View style={ticket_style.card1}>
                                <View style={ticket_style.up}>
                                    <Text style={ticket_style.left_text}>訂位代號</Text>
                                    <Text style={ticket_style.right_text}>{TicketDatas.CodeNumber}</Text>
                                </View>
                                <View style={ticket_style.seg_line}></View>
                                <View style={ticket_style.info_view}>
                                    <View style={ticket_style.info_part}>
                                        <Text style={ticket_style.up_info}>交易狀態</Text>
                                        <Text style={[ticket_style.down_info,{color: TicketDatas.BussinessState?'#000000':'#D83714'}]}>{TicketDatas.BussinessState?'已付款':'未付款'}</Text>
                                    </View>
                                    <View style={ticket_style.info_part}>
                                        <Text style={ticket_style.up_info}>付款期限</Text>
                                        <Text style={ticket_style.down_info}>{TicketDatas.BussinessState?'已付款':'發車前30分鐘'}</Text>
                                    </View>
                                    <View style={ticket_style.info_part}>
                                        <Text style={ticket_style.up_info}>行程 / 車廂 / 票種</Text>
                                        <Text style={ticket_style.down_info}>{TicketDatas.OnewayReturn?'去回票':'單程票'} / {TicketDatas.Type} / 對號座</Text>
                                    </View>
                                    <View style={ticket_style.info_part}>
                                        <Text style={ticket_style.up_info}>票數</Text>
                                        <Text style={ticket_style.down_info}>{TicketDatas.TotalText}</Text>
                                    </View>
                                </View>
                                <View style={ticket_style.seg_line}></View>
                                <View style={ticket_style.up}>
                                    <Text style={ticket_style.down_left}>總票價</Text>
                                    <Text style={ticket_style.down_right}>TWD {moneyManifest(TicketDatas.TotalPrice)}</Text>
                                </View>
                            </View>
                            <View style={ticket_style.card2}>
                                <View style={[ticket_style.up,{flexDirection: 'row',justifyContent: 'space-between'}]}>
                                    <Text style={[ticket_style.left_text]}>{TicketDatas.OnewayReturn?'去程':'單程'} · {TicketDatas.Start.Date}</Text>
                                    <TouchableOpacity style={{marginTop:'5%',marginRight:'5%',borderRadius:5,borderColor:'#D83714',borderWidth:1,alignSelf:'center',alignContent:'center'}} onPress={()=>{setStationsByOrder(TicketDatas.Start.Order);setStationsByDatas(TicketDatas.Start.StationsBy);setPayTicketStationsByVisible(true);setPayticketVisible(false);}}>
                                        <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',color:'#D87413',fontWeight:'bold',fontSize:12}}>查看停靠站</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[ticket_style.seg_line,{height:0.5}]}></View>
                                <View>
                                    <View style={{flexDirection:'row',width:'90%',alignSelf:'center'}}>
                                        <View style={Booking_style.up}>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.Stations_text}>{TicketDatas.StartStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Start.StartTime}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.order_text}>------></Text>
                                                <Text style={Booking_style.order_text}>{TicketDatas.Start.Order}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{TicketDatas.ArriveStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Start.ArriveTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {TicketDatas.Start.Tickets.map((item,index)=>{
                                            return (
                                                <View key={index} style={ticket_style.cards}>
                                                    <Text style={ticket_style.typetext}>{item.Type}</Text>
                                                    <Text style={ticket_style.seatpostext}>{item.Position}</Text>
                                                    <View style={[ticket_style.black_seg_line,{height:1}]}></View>
                                                    <Text style={ticket_style.costtext}>TWD {moneyManifest(item.Price)}</Text>
                                                </View>

                                            );
                                    })}
                                </View>
                            </View>
                            {TicketDatas.OnewayReturn &&(
                                <View style={ticket_style.card2}>
                                    <View style={[ticket_style.up,{flexDirection: 'row',justifyContent: 'space-between'}]}>
                                        <Text style={[ticket_style.left_text]}>{TicketDatas.OnewayReturn?'回程':'單程'} · {TicketDatas.Arrive.Date}</Text>
                                        <TouchableOpacity style={{marginTop:'5%',marginRight:'5%',borderRadius:5,borderColor:'#D83714',borderWidth:1,alignSelf:'center',alignContent:'center'}} onPress={()=>{setStationsByOrder(TicketDatas.Arrive.Order);setStationsByDatas(TicketDatas.Arrive.StationsBy);setPayTicketStationsByVisible(true);setPayticketVisible(false);}}>
                                            <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center',color:'#D87413',fontWeight:'bold',fontSize:12}}>查看停靠站</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[ticket_style.seg_line,{height:0.5}]}></View>
                                    <View>
                                        <View style={{flexDirection:'row',width:'90%',alignSelf:'center'}}>
                                        <View style={Booking_style.up}>
                                        <View style={Booking_style.order_view}>
                                        <Text style={Booking_style.Stations_text}>{TicketDatas.ArriveStation}</Text>
                                        <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Arrive.StartTime}</Text>
                                    </View>
                                    <View style={Booking_style.order_view}>
                                        <Text style={Booking_style.order_text}>------></Text>
                                        <Text style={Booking_style.order_text}>{TicketDatas.Arrive.Order}</Text>
                                    </View>
                                        <View style={Booking_style.order_view}>
                                            <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{TicketDatas.StartStation}</Text>
                                            <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Arrive.ArriveTime}</Text>
                                        </View>
                                    </View>
                                </View>
                            {TicketDatas.Arrive.Tickets.map((item,index)=>{
                                return (
                                <View key={index} style={ticket_style.cards}>
                                    <Text style={ticket_style.typetext}>{item.Type}</Text>
                                    <Text style={ticket_style.seatpostext}>{item.Position}</Text>
                                    <View style={[ticket_style.black_seg_line,{height:1}]}></View>
                                    <Text style={ticket_style.costtext}>TWD {moneyManifest(item.Price)}</Text>
                                </View>
                                );
                            })}
                                </View>
                                </View>
                            )}
                            <View style={ticket_style.card3}>
                                {!TicketDatas.BussinessState &&(
                                    <TouchableOpacity style={ticket_style.funcbtn} onPress={()=>{setPayticketVisible(false)}}>
                                        <Image style={ticket_style.refundimg} source={require('./icons/later.png')}></Image>
                                        <Text style={ticket_style.refundtext}>稍後付款</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity style={ticket_style.funcbtn} onPress={()=>{let d=TicketDatas;setCopyTicketInfo(d);setEditVisible(true);setPayticketVisible(false);}}>
                                    <Image style={ticket_style.refundimg} source={require('./icons/edit.png')}></Image>
                                    <Text style={ticket_style.refundtext}>修改</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={ticket_style.funcbtn} onPress={()=>{setRefundDetailsVisible(true);setPayticketVisible(false);}}>
                                    <Image style={ticket_style.refundimg} source={require('./icons/refund.png')}></Image>
                                    <Text style={ticket_style.refundtext}>退票</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                    <View style={ticket_style.btview}>
                        <TouchableOpacity style={ticket_style.paybtn} onPress={()=>{getit(TicketDatas.BussinessState,PayOrUseIndex);}}>
                            <Text style={ticket_style.paytext}>{TicketDatas.BussinessState?'立即使用':'立即付款'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={PaidTicketStationsByVisible} onRequestClose={() =>{setPaidTicketVisible(true);setPaidTicketStationsByVisible(false);}}>
                <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setPaidTicketVisible(true);setPaidTicketStationsByVisible(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>車次 {StationsByOrder}</Text>
                    </View>
                    <View style={Booking_style.wcard}>
                        <View style={Booking_style.upcard}>
                            <Text style={[Booking_style.uptext,{textAlign:'right'}]}>發車時間</Text>
                            <View style={{flex:2}}></View>
                            <Text style={[Booking_style.uptext,{textAlign:'left'}]}>停靠站</Text>
                        </View>
                        <View style={[Booking_style.seg_line,{marginTop:'5%',height:1}]}></View>
                        <View style={Booking_style.downcard}>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D83714'}]}>{item}</Text>
                                        )
                                    }
                                    else if(item.length===0){
                                        return(
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#FFFFFF'}]}>00</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D9D9D9'}]}>{item}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                            <View style={Booking_style.cardforcircle}>
                            </View>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(item.length===0){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D9D9D9'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D83714'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#000000'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                        </View>
                        <TouchableOpacity style={Booking_style.cardclose} onPress={()=>{setPaidTicketVisible(true);setPaidTicketStationsByVisible(false);}}>
                            <Text style={Booking_style.cardclosetext}>關閉</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal animationType="slide" transparent={false} visible={EditVisible} onRequestClose={() => setEditVisible(!EditVisible)}>
                <View style={styles.container}>
                    <View style={ticket_style.header}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'10%'}]} onPress={()=>{setEditVisible(false)}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={ticket_style.header_text}>訂位修改</Text>
                    </View>
                    <View style={ticket_style.cenview}>
                        <View style={ticket_style.card2}>
                            <View style={ticket_style.up}>
                                <Text style={[ticket_style.left_text,{width:'95%'}]}>{CopyTicketInfo.OnewayReturn?'去程':'單程'} · {CopyTicketInfo.Start.Date}</Text>
                            </View>
                            <View style={[ticket_style.seg_line,{height:1}]}></View>
                            <View>
                                <View style={{flexDirection:'row',width:'90%',alignSelf:'center'}}>
                                    <View style={[Booking_style.up,{height:100}]}>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.Stations_text}>{CopyTicketInfo.StartStation}</Text>
                                            <Text style={[Booking_style.timetext,{fontSize:22}]}>{CopyTicketInfo.Start.StartTime}</Text>
                                        </View>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.order_text}>------></Text>
                                            <Text style={Booking_style.order_text}>{CopyTicketInfo.Start.Order}</Text>
                                        </View>
                                        <View style={Booking_style.order_view}>
                                            <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{CopyTicketInfo.ArriveStation}</Text>
                                            <Text style={[Booking_style.timetext,{fontSize:22}]}>{CopyTicketInfo.Start.ArriveTime}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={ticket_style.editbtn} onPress={()=>{editit(0);}}>
                                <Text style={ticket_style.edittext}>修改</Text>
                            </TouchableOpacity>
                        </View>
                        {CopyTicketInfo.OnewayReturn &&(
                            <View style={ticket_style.card2}>
                                <View style={ticket_style.up}>
                                    <Text style={[ticket_style.left_text,{width:'95%'}]}>{CopyTicketInfo.OnewayReturn?'回程':'單程'} · {CopyTicketInfo.Arrive.Date}</Text>
                                </View>
                                <View style={[ticket_style.seg_line,{height:1}]}></View>
                                <View>
                                    <View style={{flexDirection:'row',width:'90%',alignSelf:'center'}}>
                                        <View style={[Booking_style.up,{height:100}]}>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.Stations_text}>{CopyTicketInfo.ArriveStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{CopyTicketInfo.Arrive.StartTime}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.order_text}>------></Text>
                                                <Text style={Booking_style.order_text}>{CopyTicketInfo.Arrive.Order}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{CopyTicketInfo.StartStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{CopyTicketInfo.Arrive.ArriveTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity style={ticket_style.editbtn} onPress={()=>{editit(1);}}>
                                    <Text style={ticket_style.edittext}>修改</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View style={ticket_style.btview}>
                        <TouchableOpacity style={ticket_style.paybtn} onPress={editcheck}>
                            <Text style={ticket_style.paytext}>下一步</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={EditDateVisible} onRequestClose={() => setEditDateVisible(!EditDateVisible)}>
                <View style={{alignSelf:'center',justifyContent:'space-around',width:'100%',height:'100%'}}>
                    <View style={styles.hbox}>
                        <Text style={[styles.Htext]}>選擇出發日期</Text>
                    </View>
                    {CalerdarVisible && (
                        <DatePicker
                            options={{
                                backgroundColor: '#34393E',
                                textHeaderColor: '#FFA25B',
                                textDefaultColor: '#F6E7C1',
                                selectedTextColor: '#fff',
                                mainColor: '#F4722B',
                                textSecondaryColor: '#D6C7A1',
                                borderColor: 'rgba(122, 146, 165, 0.1)',
                            }}
                            mode={'calendar'}
                            selected={DateOfEdit}
                            minimumDate={minDate}
                            maximumDate={maxDate}
                            current={DateOfEdit}
                            onDateChange={date=>{setday(date)}}
                            style={{ flex:3,borderRadius: 10,width:'90%',alignSelf:'center',margin:'10%'}}
                        ></DatePicker>
                    )}
                    <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
                        <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',margin:'5%',width:'40%',backgroundColor:'#FFA25B',height:'90%',borderRadius:10}} onPress={seteditbeinit}>
                            <Text style={{color:'#FFFFFF',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>今天</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',margin:'5%',width:'40%',borderWidth:3,borderColor:'#FFA25B',height:'90%',borderRadius:10}} onPress={cancelsetedittime}>
                            <Text style={{color:'#FFA25B',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{alignContent:'center',alignSelf:'center',justifyContent:'center',margin:'10%',width:'90%',backgroundColor:'#34393E',height:'8%',borderRadius:10}} onPress={completeselecteditday}>
                        <Text style={{color:'#FFA25B',alignSelf:'center',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>確認</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={EditTrains} onRequestClose={() => setEditTrains(!EditTrains)}>
                <View style={Booking_style.container}>
                    <View style={Booking_style.hbox}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'22%'}]} onPress={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',
                            [
                                {text: '取消'},
                                {text: '確定', onPress: () => {setEditVisible(true);setEditTrains(false);}},
                            ])}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.title}>{editstate?"去程":"回程"}</Text>
                        <View style={Booking_style.direction_view}>
                            <Text style={Booking_style.start_end_text}>{editstate?CopyTicketInfo.StartStation:CopyTicketInfo.ArriveStation}</Text>
                            <Text style={Booking_style.start_end_text}>------></Text>
                            <Text style={Booking_style.start_end_text}>{(!editstate)?CopyTicketInfo.StartStation:CopyTicketInfo.ArriveStation}</Text>
                        </View>
                    </View>
                    <View style={Booking_style.time_view}>
                        <Text style={Booking_style.bookingtime_text}>{backType(DateOfEdit)} ({chiness_weeksate[new Date(DateOfEdit).getDay()]})</Text>
                    </View>
                    <ScrollView style={Booking_style.menu}>{
                        datas.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={Booking_style.cards} onPress={()=>{goedit(index)}}>
                                    <View style={Booking_style.up}>
                                        <Text style={Booking_style.timetext}>{item.StartTime}</Text>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.order_text}>------></Text>
                                            <Text style={Booking_style.order_text}>{item.Order}</Text>
                                        </View>
                                        <Text style={Booking_style.timetext}>{item.ArriveTime}</Text>
                                    </View>
                                    <View style={Booking_style.seg_line}></View>
                                    <View style={Booking_style.down}>
                                        <View style={Booking_style.totaltime_view}>
                                            <Image style={Booking_style.down_icons} source={require('./icons/time.png')}></Image>
                                            <Text style={Booking_style.totaltimetext}>{getTotalTime(item.StartTime,item.ArriveTime)}</Text>
                                        </View>
                                        <TouchableOpacity style={Booking_style.route_btn} onPress={()=>{setStationsByOrder(item.Order);setStationsByDatas(item.StationsBy);setTrainsStationsByVisible(true);setEditTrains(false);}}>
                                            <Image style={Booking_style.route_img} source={require('./icons/route.png')}></Image>
                                            <Text style={Booking_style.totaltimetext}>查看停靠站</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    </ScrollView>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={TrainsStationsByVisible} onRequestClose={() =>{setEditTrains(true);setTrainsStationsByVisible(false);}}>
                <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                    <View style={[Booking_style.hbox,{height: '10%'}]}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{setEditTrains(true);setTrainsStationsByVisible(false);}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.bigtitle}>車次 {StationsByOrder}</Text>
                    </View>
                    <View style={Booking_style.wcard}>
                        <View style={Booking_style.upcard}>
                            <Text style={[Booking_style.uptext,{textAlign:'right'}]}>發車時間</Text>
                            <View style={{flex:2}}></View>
                            <Text style={[Booking_style.uptext,{textAlign:'left'}]}>停靠站</Text>
                        </View>
                        <View style={[Booking_style.seg_line,{marginTop:'5%',height:1}]}></View>
                        <View style={Booking_style.downcard}>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D83714'}]}>{item}</Text>
                                        )
                                    }
                                    else if(item.length===0){
                                        return(
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#FFFFFF'}]}>00</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardtime,{color:'#D9D9D9'}]}>{item}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                            <View style={Booking_style.cardforcircle}>
                            </View>
                            <View style={Booking_style.cardfortext}>
                                {StationsByDatas.map((item,index)=>{
                                    if(item.length===0){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D9D9D9'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else if(index===StartStation || index===EndStation){
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#D83714'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                    else{
                                        return (
                                            <Text key={index} style={[Booking_style.cardStation,{color:'#000000'}]}>{Stations_Name[index]}</Text>
                                        )
                                    }
                                })
                                }
                            </View>
                        </View>
                        <TouchableOpacity style={Booking_style.cardclose} onPress={()=>{setEditTrains(true);setTrainsStationsByVisible(false);}}>
                            <Text style={Booking_style.cardclosetext}>關閉</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal animationType="slide" transparent={false} visible={EditDetailsVisible} onRequestClose={() => {setEditDetailsVisible(!EditDetailsVisible);setCheck(false);}}>
                <View style={styles.container}>
                    <View style={Booking_style.hbox}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',
                            [
                                {text: '取消'},
                                {text: '確定', onPress: () => {setEditDetailsVisible(false);setCheck(false);}},
                            ])}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.Details_title}>票證修改明細</Text>
                    </View>
                    <ScrollView style={{width:'100%',alignContent:'center',alignSelf:'center'}}>
                        <View style={{marginTop:'5%',alignSelf:'center',width:'90%',alignContent:'center',flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{flex:1,color:'#000000',fontSize:15,fontWeight:'bold',marginLeft:'5%',textAlign:'left',textAlignVertical:'center'}}>訂位代號</Text>
                            <Text style={{flex:1,color:'#D83714',fontSize:15,fontWeight:'bold',marginRight:'5%',textAlign:'right',textAlignVertical:'center'}}>{CopyTicketInfo.CodeNumber}</Text>
                        </View>
                        <View style={[Booking_style.Details_view,{marginTop:'5%',alignSelf:'center',height:CopyTicketInfo.OnewayReturn?600:400}]}>
                            <View style={[Booking_style.tickets_view,{marginTop:'10%'}]}>
                                <View style={{flex:1}}>
                                    <Text>{CopyTicketInfo.OnewayReturn?'去程':'單程'} · {CopyTicketInfo.Start.Date}</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row'}}>
                                    <View style={Booking_style.up}>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.Stations_text}>{CopyTicketInfo.StartStation}</Text>
                                            <Text style={[Booking_style.timetext,{fontSize:22}]}>{CopyTicketInfo.Start.StartTime}</Text>
                                        </View>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.order_text}>------></Text>
                                            <Text style={Booking_style.order_text}>{CopyTicketInfo.Start.Order}</Text>
                                        </View>
                                        <View style={Booking_style.order_view}>
                                            <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{CopyTicketInfo.ArriveStation}</Text>
                                            <Text style={[Booking_style.timetext,{fontSize:22}]}>{CopyTicketInfo.Start.ArriveTime}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={[Booking_style.seg_line,{height:'0.5%',width: '100%'}]}></View>
                            {CopyTicketInfo.OnewayReturn===true && (
                                <View style={Booking_style.tickets_view}>
                                    <View style={{flex:1}}>
                                        <Text>回程 · {CopyTicketInfo.Arrive.Date}</Text>
                                    </View>
                                    <View style={{flex:3,flexDirection:'row'}}>
                                        <View style={Booking_style.up}>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.Stations_text}>{CopyTicketInfo.ArriveStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{CopyTicketInfo.Arrive.StartTime}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.order_text}>------></Text>
                                                <Text style={Booking_style.order_text}>{CopyTicketInfo.Arrive.Order}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{CopyTicketInfo.ArriveStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{CopyTicketInfo.Arrive.ArriveTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {CopyTicketInfo.OnewayReturn &&(
                                <View style={[Booking_style.seg_line,{height:'0.5%',width: '100%'}]}></View>
                            )}
                            <View style={Booking_style.cost_view}>
                                {(!CopyTicketInfo.OnewayReturn) && (
                                    <View style={[Booking_style.cost_info_view,{flex:1.5}]}>
                                        <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>票數</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>全票{CopyTicketInfo.NumOfTickets[0]>0?"*"+CopyTicketInfo.NumOfTickets[0]:""}</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>孩童{CopyTicketInfo.NumOfTickets[1]>0?"*"+CopyTicketInfo.NumOfTickets[1]:""}</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>敬老{CopyTicketInfo.NumOfTickets[2]>0?"*"+CopyTicketInfo.NumOfTickets[2]:""}</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>愛心{CopyTicketInfo.NumOfTickets[3]>0?"*"+CopyTicketInfo.NumOfTickets[3]:""}</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>大學生{CopyTicketInfo.NumOfTickets[4]>0?"*"+CopyTicketInfo.NumOfTickets[4]:""}</Text>
                                    </View>
                                )}
                                {CopyTicketInfo.OnewayReturn && (
                                    <View style={[Booking_style.cost_info_view,{flex:1.5}]}>
                                        <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>票數</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>全票{CopyTicketInfo.NumOfTickets[0]>0?"*"+CopyTicketInfo.NumOfTickets[0]*2:""}</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>孩童{CopyTicketInfo.NumOfTickets[1]>0?"*"+CopyTicketInfo.NumOfTickets[1]*2:""}</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>敬老{CopyTicketInfo.NumOfTickets[2]>0?"*"+CopyTicketInfo.NumOfTickets[2]*2:""}</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>愛心{CopyTicketInfo.NumOfTickets[3]>0?"*"+CopyTicketInfo.NumOfTickets[3]*2:""}</Text>
                                        <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>大學生{CopyTicketInfo.NumOfTickets[4]>0?"*"+CopyTicketInfo.NumOfTickets[4]*2:""}</Text>
                                    </View>
                                )}

                                <View style={Booking_style.cost_info_view}>
                                    <Text style={Booking_style.cost_info_title}>變更後票價</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[0])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[1])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[2])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[3])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(Prices[4])}</Text>
                                </View>
                                <View style={Booking_style.cost_info_view}>
                                    <Text style={Booking_style.cost_info_title}>原票價</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(CopyTicketInfo.Prices[0])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(CopyTicketInfo.Prices[1])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(CopyTicketInfo.Prices[2])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(CopyTicketInfo.Prices[3])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(CopyTicketInfo.Prices[4])}</Text>
                                </View>
                                <View style={Booking_style.cost_info_view}>
                                    <Text style={Booking_style.cost_info_title}>手續費</Text>
                                    <Text style={Booking_style.cost_info_text}>{Fees[0]}</Text>
                                    <Text style={Booking_style.cost_info_text}>{Fees[1]}</Text>
                                    <Text style={Booking_style.cost_info_text}>{Fees[2]}</Text>
                                    <Text style={Booking_style.cost_info_text}>{Fees[3]}</Text>
                                    <Text style={Booking_style.cost_info_text}>{Fees[4]}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[Booking_style.Details_view,{marginTop:'5%',alignSelf:'center',height:200}]}>
                            <View style={Booking_style.cost_view}>
                                <View style={Booking_style.cost_info_view}>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>變更後票價</Text>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>原票價</Text>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>手續費</Text>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>返回帳戶金額</Text>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>本次應付金額</Text>
                                </View>
                                {CopyTicketInfo.BussinessState &&(
                                    <View style={Booking_style.cost_info_view}>
                                        <Text style={Booking_style.cost_info_text}>{moneyManifest(Allprices)}</Text>
                                        <Text style={Booking_style.cost_info_text}>{moneyManifest(CopyTicketInfo.TotalPrice)}</Text>
                                        <Text style={Booking_style.cost_info_text}>{AllFees}</Text>
                                        <Text style={Booking_style.cost_info_text}>{(Number(Allprices)+Number(AllFees)-CopyTicketInfo.TotalPrice)>0?'0':(-Number(Allprices)-Number(AllFees)+Number(CopyTicketInfo.TotalPrice)).toString()}</Text>
                                        <Text style={Booking_style.cost_info_text}>{(Number(Allprices)+Number(AllFees)-CopyTicketInfo.TotalPrice)>0?(Number(Allprices)+Number(AllFees)-Number(CopyTicketInfo.TotalPrice)).toString():'0'}</Text>
                                    </View>
                                )}
                                {(!CopyTicketInfo.BussinessState) &&(
                                    <View style={Booking_style.cost_info_view}>
                                        <Text style={Booking_style.cost_info_text}>{moneyManifest(Allprices)}</Text>
                                        <Text style={Booking_style.cost_info_text}>{moneyManifest(CopyTicketInfo.TotalPrice)}</Text>
                                        <Text style={Booking_style.cost_info_text}>{AllFees}</Text>
                                        <Text style={Booking_style.cost_info_text}>未付款</Text>
                                        <Text style={Booking_style.cost_info_text}>未付款</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={{justifyContent:'center',flexDirection:'row',height:50,marginTop:'5%',marginBottom:'5%'}}>
                            <TouchableOpacity style={Booking_style.check_btn} onPress={()=>{setCheck(!Check);}}>
                                <Image style={Booking_style.check_img} source={Check?require('./icons/check.png'):require('./icons/uncheck.png')}></Image>
                            </TouchableOpacity>
                            <Text style={Booking_style.notice_text}>我同意修改</Text>
                        </View>
                    </ScrollView>
                    <View style={{shadowColor:'black',
                        shadowOpacity:0.5,
                        shadowOffset:{width:0,height:0},
                        shadowRadius: 2,
                        //該屬性僅支援Android
                        elevation:1.5,backgroundColor:'#FFFFFF',justifyContent:'flex-start',height:80,width:'100%',flexDirection:'row',alignContent:'center'}}>
                        <TouchableOpacity onPress={()=>{setCheck(false);setEditDetailsVisible(false)}} style={[Booking_style.submit_btn,{margin:0,marginLeft:'5%',height:30,width: '42.5%'}]}>
                            <Text style={[Booking_style.submit_text,{fontSize: 12}]}>取消修改</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>editnow()} style={[Booking_style.submit_btn,{backgroundColor:'#D83714',borderWidth:0,margin:0,marginLeft:'5%',height:30,width: '42.5%'}]}>
                            <Text style={[Booking_style.submit_text,{color:'#FFFFFF',fontSize: 12}]}>確定修改</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={RefundDetailsVisible} onRequestClose={() => {setRefundDetailsVisible(!RefundDetailsVisible);setCheck(false);}}>
                <View style={styles.container}>
                    <View style={Booking_style.hbox}>
                        <TouchableOpacity style={[styles.backbtn,{bottom:'20%'}]} onPress={()=>{Alert.alert('大笨蛋','是否要離開此功能\n按下「確定」鍵後,系統將無法保留先前執行的動作。',
                            [
                                {text: '取消'},
                                {text: '確定', onPress: () => {setRefundDetailsVisible(false);setCheck(false);}},
                            ])}}>
                            <Image style={styles.backimg} source={require('./icons/back.png')}></Image>
                        </TouchableOpacity>
                        <Text style={Booking_style.Details_title}>退票明細</Text>
                    </View>
                    <ScrollView style={{width:'100%',alignContent:'center',alignSelf:'center'}}>
                        <View style={{marginTop:'5%',alignSelf:'center',width:'90%',alignContent:'center',flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{flex:1,color:'#000000',fontSize:15,fontWeight:'bold',marginLeft:'5%',textAlign:'left',textAlignVertical:'center'}}>訂位代號</Text>
                            <Text style={{flex:1,color:'#D83714',fontSize:15,fontWeight:'bold',marginRight:'5%',textAlign:'right',textAlignVertical:'center'}}>{TicketDatas.CodeNumber}</Text>
                        </View>
                        <View style={[Booking_style.Details_view,{marginTop:'5%',alignSelf:'center',height:TicketDatas.OnewayReturn?600:400}]}>
                            <View style={[Booking_style.tickets_view,{marginTop:'10%'}]}>
                                <View style={{flex:1}}>
                                    <Text>{TicketDatas.OnewayReturn?'去程':'單程'} · {TicketDatas.Start.Date}</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row'}}>
                                    <View style={Booking_style.up}>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.Stations_text}>{TicketDatas.StartStation}</Text>
                                            <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Start.StartTime}</Text>
                                        </View>
                                        <View style={Booking_style.order_view}>
                                            <Text style={Booking_style.order_text}>------></Text>
                                            <Text style={Booking_style.order_text}>{TicketDatas.Start.Order}</Text>
                                        </View>
                                        <View style={Booking_style.order_view}>
                                            <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{TicketDatas.ArriveStation}</Text>
                                            <Text style={[Booking_style.timetext,{fontSize:oneway_return?22:25}]}>{TicketDatas.Start.ArriveTime}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={[Booking_style.seg_line,{height:'0.5%',width: '100%'}]}></View>
                            {TicketDatas.OnewayReturn===true && (
                                <View style={Booking_style.tickets_view}>
                                    <View style={{flex:1}}>
                                        <Text>回程 · {TicketDatas.Arrive.Date}</Text>
                                    </View>
                                    <View style={{flex:3,flexDirection:'row'}}>
                                        <View style={Booking_style.up}>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.Stations_text}>{TicketDatas.ArriveStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Arrive.StartTime}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={Booking_style.order_text}>------></Text>
                                                <Text style={Booking_style.order_text}>{TicketDatas.Arrive.Order}</Text>
                                            </View>
                                            <View style={Booking_style.order_view}>
                                                <Text style={[Booking_style.Stations_text,{alignSelf:'flex-end'}]}>{TicketDatas.ArriveStation}</Text>
                                                <Text style={[Booking_style.timetext,{fontSize:22}]}>{TicketDatas.Arrive.ArriveTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {TicketDatas.OnewayReturn &&(
                                <View style={[Booking_style.seg_line,{height:'0.5%',width: '100%'}]}></View>
                            )}
                            <View style={Booking_style.cost_view}>
                                <View style={[Booking_style.cost_info_view,{flex:2}]}>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}></Text>
                                    <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>全票</Text>
                                    <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>孩童</Text>
                                    <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>敬老</Text>
                                    <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>愛心</Text>
                                    <Text style={[Booking_style.cost_info_text,{textAlign:'left'}]}>大學生</Text>
                                </View>
                                <View style={Booking_style.cost_info_view}>
                                    <Text style={Booking_style.cost_info_title}>票數</Text>
                                    <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[0]*2:TicketDatas.NumOfTickets[0]}</Text>
                                    <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[1]*2:TicketDatas.NumOfTickets[1]}</Text>
                                    <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[2]*2:TicketDatas.NumOfTickets[2]}</Text>
                                    <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[3]*2:TicketDatas.NumOfTickets[3]}</Text>
                                    <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[4]*2:TicketDatas.NumOfTickets[4]}</Text>
                                </View>
                                <View style={Booking_style.cost_info_view}>
                                    <Text style={Booking_style.cost_info_title}>小計</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(TicketDatas.Prices[0])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(TicketDatas.Prices[1])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(TicketDatas.Prices[2])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(TicketDatas.Prices[3])}</Text>
                                    <Text style={Booking_style.cost_info_text}>{moneyManifest(TicketDatas.Prices[4])}</Text>
                                </View>
                                {(!TicketDatas.BussinessState) &&(
                                    <View style={Booking_style.cost_info_view}>
                                        <Text style={Booking_style.cost_info_title}>手續費</Text>
                                        <Text style={Booking_style.cost_info_text}>{Number(TicketDatas.NumOfTickets[0])*0}</Text>
                                        <Text style={Booking_style.cost_info_text}>{Number(TicketDatas.NumOfTickets[1])*0}</Text>
                                        <Text style={Booking_style.cost_info_text}>{Number(TicketDatas.NumOfTickets[2])*0}</Text>
                                        <Text style={Booking_style.cost_info_text}>{Number(TicketDatas.NumOfTickets[3])*0}</Text>
                                        <Text style={Booking_style.cost_info_text}>{Number(TicketDatas.NumOfTickets[4])*0}</Text>
                                    </View>
                                )}
                                {TicketDatas.BussinessState &&(
                                    <View style={Booking_style.cost_info_view}>
                                        <Text style={Booking_style.cost_info_title}>手續費</Text>
                                        <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[0]*40:TicketDatas.NumOfTickets[0]*20}</Text>
                                        <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[1]*40:TicketDatas.NumOfTickets[1]*20}</Text>
                                        <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[2]*40:TicketDatas.NumOfTickets[2]*20}</Text>
                                        <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[3]*40:TicketDatas.NumOfTickets[3]*20}</Text>
                                        <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?TicketDatas.NumOfTickets[4]*40:TicketDatas.NumOfTickets[4]*20}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={[Booking_style.Details_view,{marginTop:'5%',alignSelf:'center',height:200}]}>
                            <View style={Booking_style.cost_view}>
                                <View style={Booking_style.cost_info_view}>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>退票張數</Text>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>變更後票價</Text>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>手續費</Text>
                                    <Text style={[Booking_style.cost_info_title,{textAlign:'left'}]}>返回帳戶金額</Text>
                                </View>
                                {TicketDatas.BussinessState &&(
                                    <View style={Booking_style.cost_info_view}>
                                        <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?2*(Number(TicketDatas.NumOfTickets[0])+Number(TicketDatas.NumOfTickets[1])+Number(TicketDatas.NumOfTickets[2])+Number(TicketDatas.NumOfTickets[3])+Number(TicketDatas.NumOfTickets[4])):Number(TicketDatas.NumOfTickets[0])+Number(TicketDatas.NumOfTickets[1])+Number(TicketDatas.NumOfTickets[2])+Number(TicketDatas.NumOfTickets[3])+Number(TicketDatas.NumOfTickets[4])}</Text>
                                        <Text style={Booking_style.cost_info_text}>TWD 0</Text>
                                        <Text style={Booking_style.cost_info_text}>TWD {20*(TicketDatas.OnewayReturn?2*(Number(TicketDatas.NumOfTickets[0])+Number(TicketDatas.NumOfTickets[1])+Number(TicketDatas.NumOfTickets[2])+Number(TicketDatas.NumOfTickets[3])+Number(TicketDatas.NumOfTickets[4])):Number(TicketDatas.NumOfTickets[0])+Number(TicketDatas.NumOfTickets[1])+Number(TicketDatas.NumOfTickets[2])+Number(TicketDatas.NumOfTickets[3])+Number(TicketDatas.NumOfTickets[4]))}</Text>
                                        <Text style={Booking_style.cost_info_text}>TWD {moneyManifest(TicketDatas.TotalPrice-(20*(TicketDatas.OnewayReturn?2*(Number(TicketDatas.NumOfTickets[0])+Number(TicketDatas.NumOfTickets[1])+Number(TicketDatas.NumOfTickets[2])+Number(TicketDatas.NumOfTickets[3])+Number(TicketDatas.NumOfTickets[4])):Number(TicketDatas.NumOfTickets[0])+Number(TicketDatas.NumOfTickets[1])+Number(TicketDatas.NumOfTickets[2])+Number(TicketDatas.NumOfTickets[3])+Number(TicketDatas.NumOfTickets[4]))))}</Text>
                                    </View>
                                )}
                                {(!TicketDatas.BussinessState) &&(
                                    <View style={Booking_style.cost_info_view}>
                                        <Text style={Booking_style.cost_info_text}>{TicketDatas.OnewayReturn?2*(Number(TicketDatas.NumOfTickets[0])+Number(TicketDatas.NumOfTickets[1])+Number(TicketDatas.NumOfTickets[2])+Number(TicketDatas.NumOfTickets[3])+Number(TicketDatas.NumOfTickets[4])):Number(TicketDatas.NumOfTickets[0])+Number(TicketDatas.NumOfTickets[1])+Number(TicketDatas.NumOfTickets[2])+Number(TicketDatas.NumOfTickets[3])+Number(TicketDatas.NumOfTickets[4])}</Text>
                                        <Text style={Booking_style.cost_info_text}>TWD 0</Text>
                                        <Text style={Booking_style.cost_info_text}>未付款</Text>
                                        <Text style={Booking_style.cost_info_text}>未付款</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={{justifyContent:'center',flexDirection:'row',height:50,marginTop:'5%',marginBottom:'5%'}}>
                            <TouchableOpacity style={Booking_style.check_btn} onPress={()=>{setCheck(!Check);}}>
                                <Image style={Booking_style.check_img} source={Check?require('./icons/check.png'):require('./icons/uncheck.png')}></Image>
                            </TouchableOpacity>
                            <Text style={Booking_style.notice_text}>我同意退票</Text>
                        </View>
                    </ScrollView>
                    <View style={{shadowColor:'black',
                        shadowOpacity:0.5,
                        shadowOffset:{width:0,height:0},
                        shadowRadius: 2,
                        //該屬性僅支援Android
                        elevation:1.5,backgroundColor:'#FFFFFF',justifyContent:'center',height:80,width:'100%',flexDirection:'row',alignContent:'center'}}>
                        <TouchableOpacity onPress={()=>refundnow()} style={[Booking_style.submit_btn,{backgroundColor:'#D83714',borderWidth:0,margin:0,height:30,width: '70%',alignSelf: 'center'}]}>
                            <Text style={[Booking_style.submit_text,{color:'#FFFFFF',fontSize: 12}]}>確定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const load_view=StyleSheet.create({
    bgview:{
        height:'70%',
        width:'100%',
        alignSelf:'center',
        alignContent:'center',
    },
    card:{
        height:300,
        marginTop:'5%',
        width:'90%',
        alignSelf:'center',
        backgroundColor:'#FFFFFF',
        borderRadius:5,
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
        justifyContent:'space-around'
    },
    infoview:{
        borderRadius:5,
        marginTop:'5%',
        backgroundColor:'#D9D9D9',
        width:'90%',
        alignSelf:'center',
        alignContent:'center',
        justifyContent:'space-around',
        flex:2,
        marginBottom:'5%',
    },
    infotext:{
        alignSelf:'center',
        textAlign:'left',
        textAlignVertical:'center',
        color:'#000000',
        fontWeight:'bold',
        fontSize:12,
        maxWidth:'90%'
    },
    inputview:{
        marginBottom:'5%',
        marginLeft:'5%',
        flex:1,
    },
    explaintext:{
        color:'#A3A3A3',
        fontSize:12,
        fontWeight:'bold',
        textAlign:'left'
    },
    inputtext:{
        width:'90%',
        textAlign:'left',
        fontSize:12,
        fontWeight:'bold',
        color:'#000000',
        marginTop:'3%',
    },
    seg_line:{
        backgroundColor:'#A3A3A3',
        width:'90%',
        height:'1%',
        alignSelf:'flex-start',
        marginTop:'0.5%',
    },
    completebtn:{
        marginTop:'5%',
        width:'80%',
        height:30,
        backgroundColor:'#D83714',
        borderRadius:5,
        alignSelf:'center',
        justifyContent:'center'
    },
    completetext:{
        fontSize:15,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold',
        color:'#FFFFFF'
    },
    findbtn:{
        alignSelf:'center',
        marginTop:'10%'
    },
    findtext:{
        textDecorationLine:'underline',
        color:'#000000',
        fontSize:15,
        fontWeight:'bold'
    },
    idview:{
        marginTop:'5%',
        width:'95%',
        height:'90%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignContent:'center'
    },
    idbtn:{
        width:'45%',
        height:'50%',
        alignContent:'space-between'
    },
    idtextview:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    idtext:{
        color:'#000000',
        fontSize:15,
        fontWeight:'bold',
        textAlignVertical:'center',
        textAlign:'left',
    },
    chooseview:{
        height:'90%',
        alignContent:'flex-end',
        alignSelf:'flex-end',
        justifyContent:'center',
    },
    chooseimg:{
        resizeMode:'contain',
        height:'30%',
        aspectRatio:1
    },
    triview:{
        flex:1,
        justifyContent:'center',
    },
    findcodetext:{
        marginTop:'5%',
        fontSize:15,
        fontWeight:'bold',
        color:'#000000',
    },
    findcodebtn:{
        marginTop:'5%'
    },
})

const other_style=StyleSheet.create({
    scview:{
        width:'100%'
    },
    view1:{
        backgroundColor:'#FFFFFF',
        height:180,
        marginTop:'5%'
    },
    view2:{
        backgroundColor:'#FFFFFF',
        height:180,
        marginTop:'5%'
    },
    view3:{
        backgroundColor:'#FFFFFF',
        height:240,
        marginTop:'5%'
    },
    btn:{
        width:'100%',
        alignSelf:'center',
        flex:1,
        alignContent:'center',
        alignItem:'center',
        flexDirection:'row',
    },
    btntext:{
        marginLeft:'5%',
        width:'60%',
        alignSelf:'center',
        justifyContent:'flex-start',
        color:'#000000',
        fontSize:15,
        fontWeight:'bold',
        textAlign:'left',
        textAlignVertical:'center',
    },
    iconspos:{
        marginLeft:'5%',
        height:'60%',
        justifyContent:'center',
        alignContent:'center',
        aspectRatio:1,
        alignItems:'center',
        alignSelf:'center'
    },
    icons:{
        height:'80%',
        resizeMode:'contain',
        aspectRatio:1,
        alignSelf:'center',
        justifyContent:'center'
    },
    topos:{
        position:'absolute',
        right:'5%',
        height:'80%',
        justifyContent:'center',
        alignContent:'center',
        aspectRatio:1,
        alignItems:'center',
        alignSelf:'center'
    },
    toimg:{
        alignSelf:'center',
        justifyContent:'center',
        height:'20%',
        aspectRatio:1,
        resizeMode:'contain',
    },
    seg_line:{
        backgroundColor:'#D9D9D9',
        width:'100%',
        height:'0.3%'
    },
    Vtext:{
        color:'#A3A3A3',
        fontSize:15,
        width:'100%',
        marginTop:'5%',
        marginBottom:'5%',
        textAlign:'center',
        textAlignVertical:'center'
    },
    NormalText:{
        color:'#000000',
        fontSize:15,
        fontWeight:'bold',
        textAlign:'left',
        textAlignVertical:'center',
        maxWidth:'90%'
    },
    NumberText:{
        color:'#000000',
        fontSize:15,
        width:'10%',
        fontWeight:'bold',
        textAlign:'left',
    },
    OrangeText:{
        color:'#D83714',
        fontSize:15,
        fontWeight:'bold',
        textAlign:'left',
        textAlignVertical:'center',
    },
    textview:{
        width:'90%',
        alignSelf:'center',
        flexDirection:'row',
        marginTop:'3%',
    },
    titletext:{
        fontStyle:'normal',
        fontWeight:'400',
        fontSize:25,
        color: '#FFFFFF',
        alignContent:'center',
        textAlignVertical:'center',
        alignSelf:'center'
    },
    parrelbar:{
        backgroundColor:'#FFFFFF',
        width:'100%',
        flexDirection:'row',
        height:'5%',
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    typebtn:{
        flex:1,
        height:'100%',
        alignSelf:'center',
        alignContent:'center',
        justifyContent:'center',
    },
    typetext:{
        color:'#A3A3A3',
        fontSize:12,
        textAlign:'center',
        textAlignVertical:'center',
        alignSelf:'center'
    },
    typebar:{
        width:'100%',
        height:'0.5%',
    },
    typeline:{
        backgroundColor:'#D83714',
        height:'100%',
        width:'25%',
        marginLeft:'12.5%',
        borderRadius:5
    },
    allfareview:{
        width:'90%',
        marginTop:'5%',
        alignSelf:'center',
        justifyContent:'space-around',
        backgroundColor:'#FFFFFF',
        borderRadius:5,
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    stationview:{
        marginTop:'5%',
        width:'90%',
        alignSelf:'center',
        flexDirection:'row',
        height:100
    },
    triview:{
        flex:1,
        flexDirection:'column',
    },
    stationname:{
        flex:1,
        fontSize:10,
        color:'#A3A3A3',
        fontWeight:'bold'
    },
    stationtext:{
        flex:2,
        fontSize:25,
        color:'#000000',
        fontWeight:'bold',
        marginTop:'5%'
    },
    faresview:{
        width:'90%',
        alignSelf:'center',
        alignContent:'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    lrfareview:{
        flex:1,
        justifyContent:'space-around',
        alignContent:'space-around'
    },
    leftfare:{
        marginTop:'15%',
        fontSize:15,
        fontWeight:'bold',
        color:'#000000',
        textAlign:'left',
    },
    rightfare:{
        marginTop:'15%',
        fontSize:15,
        fontWeight:'bold',
        color:'#000000',
        textAlign:'right',
    },
})

const ticket_style=StyleSheet.create({
    header:{
        backgroundColor:'#34393E',
        flex:1.5,
        width:'100%',
        alignContent:'center',
        flexDirection:'row',
        justifyContent:'center'
    },
    header_text:{
        fontSize:15,
        fontWeight:'bold',
        color:'#FFFFFF',
        alignSelf:'center',
        alignContent:'center',
        textAlign:'center',
        textAlignVertical:'center',
        marginTop:'10%'
    },
    cenview:{
        flex:12,
        width:'100%',
        alignContent:'center',
        backgroundColor:'#D9D9D9'
    },
    scview:{
        width:'100%',
    },
    card1:{
        alignSelf:'center',
        margin:'5%',
        backgroundColor:'#FFFFFF',
        height:400,
        width:'95%',
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    up:{
        height:50,
        width:'100%',
        flexDirection:'row',
        alignContent:'space-around',
        justifyContent:'space-around'
    },
    left_text:{
        marginTop:'5%',
        textAlign:'left',
        textAlignVertical:'center',
        fontWeight:'bold',
        fontSize:13,
        alignSelf:'center',
        color:'#000000',
        width:'45%',
        marginLeft:'5%'
    },
    right_text:{
        marginTop:'5%',
        textAlign:'right',
        textAlignVertical:'center',
        alignSelf:'center',
        fontWeight:'bold',
        fontSize:18,
        marginRight:'5%',
        color:'#D83714',
        width:'45%'
    },
    info_view:{
        height:'65%',
        width:'100%',
        justifyContent:'space-around',
    },
    info_part:{
        flex:1,
        width:'90%',
        alignSelf:'center',
        margin:'5%',
        justifyContent:'center',
    },
    up_info:{
        color:'#9f9b9b',
        fontSize:14,
        fontWeight:'bold',
        marginBottom:'3%'
    },
    down_info:{
        color:'#000000',
        fontSize:17,
    },
    down_left:{
        marginBottom:'5%',
        textAlign:'left',
        textAlignVertical:'center',
        fontWeight:'bold',
        fontSize:16,
        alignSelf:'center',
        color:'#000000',
        width:'45%',
        marginLeft:'5%'
    },
    down_right:{
        marginBottom:'5%',
        textAlign:'right',
        textAlignVertical:'center',
        alignSelf:'center',
        fontWeight:'bold',
        fontSize:16,
        marginRight:'5%',
        color:'#000000',
        width:'45%'
    },
    seg_line:{
        backgroundColor:'#D9D9D9',
        width:'90%',
        height:'0.3%',
        margin:'3%'
    },
    card2:{
        alignSelf:'center',
        margin:'5%',
        marginBottom:'3%',
        marginTop:'3%',
        backgroundColor:'#FFFFFF',
        width:'95%',
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    cards:{
        backgroundColor:'#dadada',
        width:'90%',
        alignSelf:'center',
        borderRadius:5,
        margin:'3%',
        justifyContent:'space-around',
        height:100
    },
    black_seg_line:{
        backgroundColor:'#000000',
        width:'90%',
        height:'0.3%',
        alignSelf:'center'
    },
    typetext:{
        marginLeft:'5%',
        fontWeight:'bold',
        fontSize:18,
        textAlignVertical:'center'
    },
    seatpostext:{
        fontSize:15,
        color:'#9F9B9B',
        marginLeft:'5%',
        fontWeight:'bold'
    },
    costtext:{
        fontSize:13,
        width:'95%',
        textAlign:'right',
        textAlignVertical:'center',
        fontWeight:'bold'
    },
    card3:{
        marginBottom:'5%',
        alignSelf:'center',
        margin:'5%',
        backgroundColor:'#FFFFFF',
        width:'95%',
        height:60,
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
        flexDirection:'row',
    },
    funcbtn:{
        height:'90%',
        alignSelf:'center',
        flex:1,
        margin:'5%',
        justifyContent:'center',
    },
    refundimg:{
        resizeMode:'contain',
        height:'60%',
        aspectRatio:1,
        alignSelf:'center',
        justifyContent:'center'
    },
    refundtext:{
        fontWeight:'bold',
        fontSize:12,
        color:'#A3A3A3',
        textAlign:'center',
        alignSelf:'center',
        textAlignVertical:'center'
    },
    btview:{
        width:'100%',
        flex:1.5,
        backgroundColor:'#FFFFFF',
        alignContent:'center',
        justifyContent:'center',
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    paybtn:{
        marginBottom:'8%',
        backgroundColor:'#D83714',
        borderRadius:5,
        width:'80%',
        alignSelf:'center',
        height:'50%',
        justifyContent:'center',
        alignContent:'center',
        margin:'5%',
    },
    paytext:{
        color:'#FFFFFF',
        fontSize:15,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold'
    },
    editbtn:{
        height:'15%',
        borderRadius:5,
        borderColor:'#D83714',
        borderWidth:2,
        width:'90%',
        alignSelf:'center',
        alignContent:'center',
        justifyContent:'center'
    },
    edittext:{
        color:'#D83714',
        fontSize:15,
        fontWeight:'bold',
        textAlign:'center',
        textAlignVertical:'center',
    },
})

const MyTicket_style=StyleSheet.create({
    normal_view:{
        backgroundColor: '#FFFFFF',
        width: '85%',
        height:'70%',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        borderRadius:7,
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    Noticket_img:{
        marginTop:'5%',
        alignSelf:'center',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        resizeMode:'contain',
        width:'90%',
        height:'90%',
        left:'2%'
    }
});

const Paying_style=StyleSheet.create({
    normal_view:{
        backgroundColor: '#FFFFFF',
        width: '85%',
        height:'70%',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        borderRadius:7,
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    Noticket_img:{
        marginTop:'5%',
        alignSelf:'center',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        resizeMode:'contain',
        width:'90%',
        height:'90%',
        left:'2%'
    },
    cards:{
        alignSelf:'center',
        margin:20,
        backgroundColor:'#FFFFFF',
        height:150,
        width:'90%',
        borderRadius:7,
        // justifyContent: 'space-around',
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    menu:{
        flex:1,
        width:'100%',
        alignContent:'center'
    },
    up:{
        width:'90%',
        alignSelf:'center',
        flex:1,
        flexDirection:'row',
        alignContent:'space-around',
        justifyContent:'center',
        alignItems:'center'
    },
    code_text:{
        fontSize:15,
        flex:2,
        color:'#000000',
        fontWeight:'bold',
        textAlignVertical:'center'
    },
    ID_text:{
        textAlignVertical:'center',
        fontSize:15,
        flex:3,
        color:'#D83714',
        fontWeight:'bold',
        marginLeft:'5%'
    },
    no_paid_text:{
        textAlignVertical:'center',
        fontSize:15,
        // alignSelf:'flex-end',
        textAlign:'right',
        color:'#D83714'
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backbtn:{
        height:'30%',
        aspectRatio:1,
        justifyContent:'flex-start',
        alignContent:'center',
        alignSelf:'center',
        position:'absolute',
        left:'5%'
    },
    backimg:{
        resizeMode:'contain',
        height:'100%',
        aspectRatio:1,
    },
    Htext:{
        width: 'auto',
        height: 'auto',
        marginTop:'10%',
        fontStyle:'normal',
        fontWeight:'400',
        fontSize:25,
        color: '#FFFFFF',
        alignSelf:'center',
        justifyContent:'center',
    },
    user_image:{
        resizeMode:'contain',
        width:'100%'
    },
    hbox:{
        flexDirection:'row',
        backgroundColor: '#34393E',
        justifyContent:'center',
        width: '100%',
        height:'15%',
        alignItems: 'center',
    },
    cbox:{
        backgroundColor: '#FFFFFF',
        width: '85%',
        height:'70%',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius:7,
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    chossen_bars:{
        flex:2,
        flexDirection:'row',
        width:'80%',
        alignContent:'space-around',
        justifyContent:'space-around',
        margin:'5%'
    },
    circle:{
        alignSelf:'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '12%',
        aspectRatio:1,
        borderColor:'#5dd942',
        borderWidth: 2,
        borderRadius: 60,
    },
    work_text:{
        alignSelf:'center',
        justifyContent:'center',
        color:'#5dd942',
        fontSize:15,
        fontWeight:'bold',
    },
    seg_line:{
        backgroundColor:'#D9D9D9',
        width:'100%',
        height:'0.7%',
    },
    station_choose:{
        flex:3,
        flexDirection:'column',
        alignContent:'space-around',
        justifyContent:'space-around'
    },
    sation_start_end:{
        fontSize:10,
        color:'#9f9b9b'
    },
    station:{
        fontSize:30,
        justifyContent:'center',
        top:'20%',
        fontWeight:'bold'
    },
    return_oneway_frame:{
        flex:1,
        justifyContent:'center',
    },
    return_oneway_img:{
        top:'35%',
        width:'60%',
        resizeMode:'contain',
        alignSelf:'center'
    },
    Hview:{
        backgroundColor: '#34393E',
        width: '100%',
        flex:2.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Choose_text:{
        fontStyle:'normal',
        fontWeight:'400',
        alignSelf:'center',
        fontSize:20,
        color: '#FFFFFF',
        top:'15%'
    },
    result_view:{
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
        backgroundColor:'#FFFFFF',
        width:'100%',
        flexDirection:'row',
        flex:3.5,
        alignContent:'space-around',
        justifyContent:'center'
    },
    manifest_view:{
        flexDirection:'column',
        justifyContent:'space-around',
        alignSelf:'center',
        width:'40%',
        height:'60%',
    },
    target_start_end:{
        color:'#9f9b9b',
        fontSize:15,
        fontWeight:'bold',
    },
    change_frame:{
        alignSelf:'center',
        alignContent:'center',
        justifyContent:'center',
        flex:0.5
    },
    target_station_box:{
        borderColor:'#D83714',
        borderRadius:5,
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
        backgroundColor:'#FFFFFF',
        width:'90%',
        height:'60%',
        justifyContent:'center',
        alignContent:'center'
    },
    target_station_text:{
        color:'#9f9b9b',
        fontWeight:'bold',
        fontSize:25,
        textAlign:'center',
        textAlignVertical:'center',
    },
    contentview:{
        backgroundColor:'#D9D9D9',
        flex:13
    },
    stations_frames:{
        left:'1%',
        height:'20%',
        width:'70%',
        alignContent:'flex-end',
        flexDirection:'row'
    },
    stations_complete_btn:{
        borderRadius:5,
        borderColor:'#D83714',
        borderWidth:1,
        width:'80%',
        alignSelf:'center',
        height:'5%',
        backgroundColor:'#FFFFFF',
        justifyContent:'center',
        bottom:'10%'
    },
    stations_complete_text:{
        color:'#D83714',
        fontSize:20,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold'
    },
    chosebg:{
        backgroundColor:'#D9D9D9',
        borderRadius:999,
        width:'100%',
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row'
    },
    ticket_font:{
        fontSize:50,
    },
    move_bar:{
        width:'45%',
        height:'80%',
        borderRadius: 999,
        backgroundColor: '#FFFFFF',
        position:'absolute',
        left:'5%',
    },
    menu_icon_pos:{
        width:'15%',
        aspectRatio:1
    },
    chossen_pos:{
        width:'70%',
        flexDirection:'column',
        alignSelf:'center'
    },
    menu_icon:{
        right:'20%',
        width:'80%',
        height:'80%',
        resizeMode:'contain',
        justifyContent:'center',
        alignSelf:'center',
        alignItems:'center',
        alignContent:'center',
        margin:'5%'
    },
    to_pos:{
        width:'20%',
        height:'90%',
        justifyContent:'center',
        alignSelf:'center',
    },
    to_img:{
        resizeMode:'contain',
        height:'30%',
        aspectRatio:1,
        justifyContent:'center',
        alignSelf:'flex-end'
    },
    chossen_title:{
        fontSize:15,
        fontWeight:'bold',
        color:'#9f9b9b'
    },
    chossen_text:{
        top:'15%',
        fontSize:15,
        fontWeight:'bold',
    },
    overlay:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
    },
    cancel_btn:{
        position:'absolute',
        top:'90%',
        alignSelf:'center',
        width:'90%',
        height:'6%',
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
        alignItems: "center",
        backgroundColor:'#FFFFFF',
        borderRadius:20
    },
    menu:{
        position:'absolute',
        bottom:'11%',
        width:'90%',
        alignSelf:'center',
        flexDirection:'column',
        alignContent:'center',
        justifyContent:'center',
        alignItems: "center",
        backgroundColor:'#FFFFFF',
        borderRadius:20
    },
    title:{
        width:'100%',
        flex:1,
        alignItems:'center',
        alignContent:'center',
        justifyContent:'center',
    },
    ticket_view:{
        flex:1.5,
        flexDirection:'row',
        width:'80%'
    },
    ticket_info:{
        left:'5%',
        flex:2,
        justifyContent:'center'
    },
    ticket_type_text:{
        fontSize:18,
        fontWeight:'bold',
        bottom:'5%'
    },
    ticket_info_text:{
        top:'5%',
        fontSize:12,
        maxWidth:'90%',
        fontWeight:'bold',
        color:'#9f9b9b'
    },
    number_of_ticket_view:{
        flex:1.2,
        borderRadius:5,
        flexDirection:'row',
        borderColor:'#9f9b9b',
        borderWidth:1,
        height:'40%',
        alignSelf:'center',

    },
    plus_minus_btn:{
        flex:1,
        alignContent:'center',
        justifyContent:'center',
    },
    vertical_line:{
        width:'10%',
        height:'100%',
        backgroundColor:'#9f9b9b',
        flex:0.03
    },
    number_of_ticket_text:{
        flex:1,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold',
        fontSize:15,
        alignSelf:'center'
    },
    plus_minus_img:{
        resizeMode:'contain',
        width:'50%',
        alignSelf:'center',
        justifyContent:'center',
        alignContent:'center'
    },
    choices:{
        width:'100%',
        alignItems:'center',
        alignContent:'center',
        justifyContent:'center',
        flex:1.5,
    },
    complete_view:{
        flex:2,
        justifyContent:'center',
        width:'100%'
    },
    complete_btn:{
        bottom:'8%',
        width:'80%',
        height:'40%',
        backgroundColor:'#D83714',
        borderRadius:8,
        alignSelf:'center',
        justifyContent:'center'
    },
    complete_text:{
        fontSize:15,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold',
        color:'#FFFFFF'
    },
    title_text:{
        color:'#9f9b9b',
        fontSize:15,
        fontWeight:'bold'
    },
    menu_text:{
        fontSize:18,
        fontWeight:'bold'
    },
    cancel_text:{
        fontSize:15
    },
    submit_btn:{
        width:'90%',
        height:'8%',
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#D83714',
        borderRadius:15,
    },
    submit_text:{
        color:'#FFFFFF'
    },
    ebox:{
        backgroundColor: '#FFFFFF',
        width: '100%',
        height:'10%',
        alignItems: 'stretch',
        alignContent:'stretch',
        flexDirection:'row'
    },
    diferent_pages:{
        flex:1,
        backgroundColor: '#FFFFFF',
        height:'100%',
        alignItems: 'center',
    },
    icons:{
        position:'absolute',
        top:'15%',
        resizeMode:'contain',
        height:'30%',
    },
    icons_text:{
        position:'absolute',
        fontSize:10,
        top:'55%',
        fontWeight:'bold'
    },
});

const Booking_style = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
    },
    hbox:{
        backgroundColor:'#34393E',
        width:'100%',height:'15%',
        alignContent:'center',
        justifyContent:'center'
    },
    title:{
        flex:2,
        top:'40%',
        textAlign:'center',
        fontSize:18,
        color:'#FFFFFF',
        alignSelf:'center'
    },
    direction_view:{
        flex:1,
        flexDirection:'row',
        alignContent:'center',
        width:'80%',
        alignSelf:'center',
        justifyContent:'space-around',
        alignItems:'center'
    },
    start_end_text:{
        textAlign:'center',
        color:'#FFFFFF',
        fontSize:13,
        fontWeight:'bold'
    },
    time_view:{
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
        backgroundColor:'#FFFFFF',
        width:'100%',
        height:'8%',
        margin:'3%',
        justifyContent:'center'
    },
    bookingtime_text:{
        textAlignVertical:'center',
        left:'5%',
        fontSize:15,
        fontWeight:'bold'
    },
    menu:{
        flex:1,
        width:'100%',
        alignContent:'center'
    },
    cards:{
        alignSelf:'center',
        margin:20,
        backgroundColor:'#FFFFFF',
        height:150,
        width:'90%',
        borderRadius:7,
        // justifyContent: 'space-around',
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
    },
    up:{
        margin:'1%',
        flex:3,
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center'
    },
    down:{
        margin:'1%',
        flex:2,
        flexDirection:'row'
    },
    timetext:{
        justifyContent:'center',
        alignSelf:'center',
        textAlign:'center',
        textAlignVertical:'center',
        flex:3,
        margin:10,
        fontSize:30,
        fontWeight:'bold',
        color:'#000000',
    },
    order_view:{
        flex:2,
        flexDirection:'column',
        justifyContent:'center',
        alignSelf:'center'
    },
    order_text:{
        textAlign:'center',
        fontSize:15,
        fontWeight:'bold',
        color:'#000000',
    },
    seg_line:{
        backgroundColor:'#9f9b9b',
        width:'90%',
        height:'1%',
        alignItems:'center',
        alignSelf:'center'
    },
    down_icons:{
        resizeMode:'contain',
        width:'20%',
        height:'auto',
        left:'3%'

    },
    totaltime_view:{
        alignSelf:'center',
        flex:3,
        flexDirection:'row',
    },
    totaltimetext:{
        textAlignVertical:'center',
        alignSelf:'center',
        color:'#9f9b9b',
        fontSize:17,
        fontWeight:'bold'
    },
    route_btn:{
        flexDirection:'row',
        flex:2,
        alignSelf:'center',
        right:'2%'
    },
    route_img:{
        resizeMode:'contain',
        width:'30%',
        height:'auto',
    },
    bigtitle:{
        top:'15%',
        textAlign:'center',
        fontSize:25,
        color:'#FFFFFF',
        alignSelf:'center',
        fontWeight:'bold'
    },
    info_text:{
        textAlignVertical:'center',
        fontSize:20,
        fontWeight:'bold',
        alignSelf:'center',
    },
    item_text:{
        fontSize:15,
        fontWeight:'bold',
    },
    input: {
        height: 40,
        margin: 12,
        borderRadius:3,
        borderWidth: 1,
        padding: 10,
    },
    info_menu:{
        top:'1%',
        width:'85%',
        alignContent:'center',
        height:'20%',
    },
    info_view:{
        flex:1,
    },
    white_bar:{
        width:'45%',
        height:'80%',
        borderRadius: 999,
        backgroundColor: '#FFFFFF',
        position:'absolute',
        left:'5%',
    },
    gender_bg:{
        backgroundColor:'#D9D9D9',
        borderRadius:999,
        width:'100%',
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row'
    },
    submit_btn:{
        borderRadius:5,
        borderColor:'#D83714',
        borderWidth:1,
        width:'80%',
        alignSelf:'center',
        height:'5%',
        backgroundColor:'#FFFFFF',
        justifyContent:'center',
        alignContent:'center',
        margin:'5%'
    },
    submit_text:{
        color:'#D83714',
        fontSize:20,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold'
    },
    Details_title:{
        fontSize:25,
        fontWeight:'bold',
        color:'#FFFFFF',
        alignSelf:'center',
        top:'15%'
    },
    Details_view:{
        width:'90%',
        height:'60%',
        backgroundColor:'#FFFFFF',
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
        borderRadius:3,
    },
    tickets_view:{
        flex:2,
        marginLeft:'5%',
        marginRight:'5%',
        marginTop:'2%'
    },
    cost_view:{
        flex:4,
        flexDirection:'row',
        alignContent:'space-around',
        justifyContent:'space-around',
        alignSelf:'center',
        width:'90%'
    },
    totalcost_view:{
        flex:1,
        flexDirection:'row',
        alignContent:'space-around',
        justifyContent:'space-around',
        alignSelf:'center',
        width:'90%'
    },
    Stations_text:{
        color:'#9f9b9b',
        fontWeight:'bold',
        fontSize:15,
    },
    cost_info_view:{
        justifyContent:'space-around',
        flex:1
    },
    cost_info_title:{
        fontSize:12,
        color:'#9f9b9b',
        fontWeight:'bold',
        textAlign:'right',
    },
    cost_info_text:{
        textAlign:'right',
        fontSize:15,
        fontWeight:'bold',
    },
    check_btn:{
        width:'10%',
        aspectRatio:1,
        justifyContent:'center',
        alignContent:'center',
        alignSelf:'center'
    },
    check_img:{
        resizeMode:'contain',
        width:'80%',
        height:'80%'
    },
    notice_view:{
        flexDirection:'row',
        flex:0.2,
    },
    notice_text:{
        textAlignVertical:'center',
        fontWeight:'bold',
        fontSize:13,
        alignSelf:'center'
    },
    wcard:{
        marginTop:'5%',
        width:'90%',
        backgroundColor:'#FFFFFF',
        shadowColor:'black',
        shadowOpacity:0.5,
        shadowOffset:{width:0,height:0},
        shadowRadius: 2,
        //該屬性僅支援Android
        elevation:1.5,
        borderRadius:5,
        alignSelf:'center',
        justifyContent:'flex-start',
    },
    upcard:{
        marginTop:'5%',
        width:'100%',
        flexDirection:'row'
    },
    uptext:{
        flex:5,
        fontSize:18,
        fontWeight:'bold',
        textAlignVertical:'center',
        color:'#000000'
    },
    downcard:{
        flexDirection:'row',
        marginTop:'5%'
    },
    cardfortext:{
        flex:5,
        flexDirection:'column',
    },
    cardforcircle:{
        flex:2,
        alignContent:'center',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
    },
    cardtime:{
        textAlign:'right',
        fontSize:15,
        fontWeight:'bold',
        marginTop:'10%',
    },
    circle:{
        alignSelf:'center',
        borderRadius:999,
        width:'10%',
        aspectRatio:1,
        marginTop:'5%',
        justifyContent:'center'
    },
    cardStation:{
        marginTop:'10%',
        fontSize:15,
        fontWeight:'bold',
    },
    cardclose:{
        marginTop:'5%',
        width:'90%',
        height:'10%',
        marginBottom:'5%',
        alignSelf:'center',
        justifyContent:'center',
        borderWidth:1,
        borderRadius:5,
        borderColor:'#D83714'
    },
    cardclosetext:{
        fontSize:15,
        color:'#D83714',
        fontWeight:'bold',
        textAlign:'center',
        textAlignVertical:'center',
    },
});
