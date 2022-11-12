import { StatusBar } from 'expo-status-bar';
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
    ScrollView, Booking_styleheet
} from 'react-native';
import React, {useState} from "react";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const apiurl='https://wei4test-api.herokuapp.com';
const [Start, setStarted] = useState(true);
const [expanded, setExpanded] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [TypeVisible, setTypeVisible] = useState(false);
const [TicketsVisible, setTicketsVisible] = useState(false);
const [Tickets, setTickets] = useState([1,0,0,0,0]);
const [TimeText, setTimeText] = useState('');
const [BackTimeText, setBackTimeText] = useState('請選擇回程時間');
const [PreText, setPreText] = useState('無偏好');
const [TypeText, setTypeText] = useState('標準車廂');
const [StartstationText, setStartstationText] = useState('左營');
const [EndstationText, setEndstationText] = useState('板橋');
const [AllticketText, setAllticketText] = useState('全票*1');
const [res, setit] = useState([]);

export function Booking(){
    let gotime=TimeText.toString().substring(0,14);
    let backtime=BackTimeText.toString().substring(0,14);
    let start=StartstationText;
    let end=EndstationText;
    let oneway_return=expanded;
    let datas=res;
    console.log(oneway_return);
    const Titletext=oneway_return?'去程':'單程';

    return (
        <Modal animationType="slide" transparent={true} visible={true}>
        <View style={Booking_style.container}>
            <View style={Booking_style.hbox}>
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
                        <TouchableOpacity key={index} style={Booking_style.cards}>
                            <View style={Booking_style.up}>
                                <Text style={Booking_style.timetext}>{item.gotime}</Text>
                                <View style={Booking_style.order_view}>
                                    <Text style={Booking_style.order_text}>------></Text>
                                    <Text style={Booking_style.order_text}>{item.orderof}</Text>
                                </View>
                                <Text style={Booking_style.timetext}>{item.arrivetime}</Text>
                            </View>
                            <View style={Booking_style.seg_line}></View>
                            <View style={Booking_style.down}>
                                <View style={Booking_style.totaltime_view}>
                                    <Image style={Booking_style.down_icons} source={require('./icons/time.png')}></Image>
                                    <Text style={Booking_style.totaltimetext}>{item.totaltime}</Text>
                                </View>
                                <TouchableOpacity style={Booking_style.route_btn}>
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
    );
};



export default function Home({navigation}) {
    const resttime=()=>{
        if(Start){
            var chiness_weeksate=['日','一','二','三','四','五','六'];
            var date=new Date();
            var year=date.getFullYear().toString();
            var month=date.getMonth().toString();
            if(month.length==1){
                month='0'+month;
            }
            var day=date.getDate().toString();
            if(day.length==1){
                day='0'+day;
            }
            var weekday=chiness_weeksate[date.getDay()];
            var hour=date.getHours().toString();
            if(hour.length==1){
                hour='0'+hour;
            }
            var minute=date.getMinutes().toString();
            if(minute.length==1){
                minute='0'+minute;
            }
            setTimeText(year+'/'+month+'/'+day+' ('+weekday+') '+hour+':'+minute);
            setStarted(false);
        }
    }
    const getapi=()=> {
        const data={
            'start':StartstationText.toString(),
            'end':EndstationText.toString(),
            'oneway_return':expanded.toString(),
            'gotime':TimeText.toString(),
            'returntime':BackTimeText.toString(),
            'traintype':TypeText.toString(),
            'people':AllticketText.toString(),
            'prefer':PreText.toString()
        };
        fetch(apiurl+'/test/',{method:'POST',headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },body:JSON.stringify(data)})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.data.length);
                setit(responseJson.data);
                Booking();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const switchStation=()=>{
        let tmp=EndstationText;
        setEndstationText(StartstationText);
        setStartstationText(tmp);
    };

    const TypeChoose=(index)=>{
        if(index===0){
            setTypeText('標準車廂');
        }
        else if(index===1){
            setTypeText('商務車廂');
        }
    };

    const setTicketNumber=(index,mode)=>{
        let TicketsCopy = [...Tickets];
        console.log(TicketsCopy," ",index);
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
        Tickets.map((item,index)=>{
            console.log(index,item);
            if(index===0 && item!==0){
                if(s.length!==0){
                    s=s.concat(', ');
                }
                s=s.concat('全票*'+item.toString());
            }
            else if(index===1 && item!==0){
                if(s.length!==0){
                    s=s.concat(' ,');
                }
                s=s.concat('孩童*'+item.toString());
            }
            else if(index===2 && item!==0){
                if(s.length!==0){
                    s=s.concat(' ,');
                }
                s=s.concat('敬老*'+item.toString());
            }
            else if(index===3 && item!==0){
                if(s.length!==0){
                    s=s.concat(' ,');
                }
                s=s.concat('愛心*'+item.toString());
            }
            else if(index===4 && item!==0){
                if(s.length!==0){
                    s=s.concat(', ');
                }
                s=s.concat('大學生*'+item.toString());
            }
        });
        console.log(s);
        if(s.length===0){
            Alert.alert('大笨蛋','每次訂位至少選擇一位乘客');
        }
        else{
            setAllticketText(s);
            setTicketsVisible(false);
        }
    };
    const noPre = () => {
        setPreText('無偏好');
    };
    const windowPre = () => {
        setPreText('靠窗優先');
    };
    const aislePre = () => {
        setPreText('靠走道優先');
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
    resttime();
    return (
        <View style={[styles.container,{opacity:modalVisible || TypeVisible?0.3:1}]}>
            <View style={styles.hbox}>
                <Text style={styles.Htext}>高鐵訂票系統</Text>
                <View style={{position: 'absolute',left: '85%',top: '60%',width:'5%'}}>
                    <TouchableOpacity onPress={getapi}>
                        <Image source={require('./icons/user.png')} style={styles.user_image}></Image>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.cbox}>
                <View style={[styles.chossen_bars,{flex:1.2,width: '50%'}]}>
                    <View style={styles.circle}></View>
                    <Text style={styles.work_text}>全線正常營運</Text>
                </View>
                <View style={styles.seg_line}></View>
                <View style={[styles.chossen_bars,{flex: 3}]}>
                    <View style={styles.station_choose}>
                        <Text style={styles.sation_start_end}>起程站</Text>
                        <Text style={styles.station}>{StartstationText}</Text>
                    </View>
                    <TouchableOpacity style={styles.return_oneway_frame} onPress={switchStation}>
                        <Image style={styles.return_oneway_img} source={expanded?require('./icons/return_ticket.png'):require('./icons/one_way_ticket.png')}></Image>
                    </TouchableOpacity>
                    <View style={styles.station_choose}>
                        <Text style={[styles.sation_start_end,{alignSelf:'flex-end'}]}>到達站</Text>
                        <Text style={[styles.station,{alignSelf:'flex-end'}]}>{EndstationText}</Text>
                    </View>
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
                <TouchableOpacity style={styles.chossen_bars}>
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
                    <TouchableOpacity style={styles.chossen_bars}>
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
                <TouchableOpacity style={styles.chossen_bars} onPress={()=>{setTicketsVisible(true)}}>
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
                </TouchableOpacity>
                <View style={[styles.seg_line,{width: '90%',height:'0.2%'}]}></View>
                <TouchableOpacity style={[styles.submit_btn,{flex:2,margin:'5%'}]}>
                    <Text style={styles.submit_text}>查詢</Text>
                </TouchableOpacity>
            </View>

            <Modal style={styles.overlay} animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
                <TouchableWithoutFeedback onPress={()=>setModalVisible(!modalVisible)}>
                    <View  style={{position:'absolute',width:'100%',height:'100%',top:0,left:0,backgroundColor:'rgba(0,0,0,.5)'}}/>
                </TouchableWithoutFeedback>
                <View style={[styles.menu,{height:'30%'}]}>
                    <View style={styles.title}>
                        <Text style={styles.title_text}>選擇座位偏好</Text>
                    </View>
                    <View style={styles.seg_line}></View>
                    <TouchableOpacity style={styles.choices} onPress={()=>{setModalVisible(!modalVisible);windowPre();}}>
                        <Text style={styles.menu_text}>靠窗優先</Text>
                    </TouchableOpacity>
                    <View style={styles.seg_line}></View>
                    <TouchableOpacity style={styles.choices} onPress={()=>{setModalVisible(!modalVisible);aislePre();}}>
                        <Text style={styles.menu_text}>靠走道優先</Text>
                    </TouchableOpacity>
                    <View style={styles.seg_line}></View>
                    <TouchableOpacity style={styles.choices} onPress={()=>{setModalVisible(!modalVisible);noPre();}}>
                        <Text style={styles.menu_text}>無偏好</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.cancel_btn} onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.cancel_text}>取消</Text>
                </TouchableOpacity>

            </Modal>

            <Modal style={styles.overlay} animationType="slide" transparent={true} visible={TicketsVisible} onRequestClose={() => setTicketsVisible(!TicketsVisible)}>
                <TouchableWithoutFeedback onPress={()=>setTicketsVisible(!TicketsVisible)}>
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
                    </View>
                    <View style={[styles.seg_line,{width: '80%',height: '0.2%'}]}></View>
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

                <View style={styles.diferent_pages}>
                    <Image source={require('./icons/Ticket_gray.png')} style={styles.icons}></Image>
                    <Text style={styles.icons_text}>我的車票</Text>
                </View>
                <View style={styles.diferent_pages}>
                    <Image source={require('./icons/book_orange.png')} style={styles.icons}></Image>
                    <Text style={[styles.icons_text,{color:'#D83714'}]}>訂票</Text>
                </View>
                <View style={styles.diferent_pages}>
                    <Image source={require('./icons/Buy_gray.png')} style={styles.icons}></Image>
                    <Text style={styles.icons_text}>付款/取票</Text>
                </View>
                <View style={styles.diferent_pages}>
                    <Image source={require('./icons/load_gray.png')} style={styles.icons}></Image>
                    <Text style={styles.icons_text}>載入訂位</Text>
                </View>
                <View style={styles.diferent_pages}>
                    <Image source={require('./icons/others_gray.png')} style={[styles.icons,{width:'40%'}]}></Image>
                    <Text style={styles.icons_text}>其他</Text>
                </View>
                <StatusBar style="auto" />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    Htext:{
        position: 'absolute',
        width: 'auto',
        height: 'auto',
        top:'55%',
        fontStyle:'normal',
        fontWeight:'400',
        fontSize:30,
        color: '#FFFFFF',
    },
    user_image:{
        resizeMode:'contain',
        width:'100%'
    },
    hbox:{
        backgroundColor: '#403838',
        width: '100%',
        height:'15%',
        alignItems: 'center',
        justifyContent: 'center',
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
        top:'3%',
        alignItems: 'center',
        justifyContent: 'center',
        width: '12%',
        aspectRatio:1,
        borderColor:'#5dd942',
        borderWidth: 2,
        borderRadius: 60,
    },
    work_text:{
        top:'3%',
        textAlignVertical:'center',
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
    to_pos:{
        width:'20%',
        justifyContent:'center'
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
    to_img:{
        resizeMode:'contain',
        justifyContent:'flex-end',
        alignSelf:'center'
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
const Booking_style = Booking_styleheet.create({
    container: {
        flex:1,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
    },
    hbox:{
        backgroundColor:'#403838',
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
        height:'3%',
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
        alignContent:'center',
    },
    cards:{
        alignSelf:'center',
        margin:20,
        backgroundColor:'#D9D9D9',
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
    }
});