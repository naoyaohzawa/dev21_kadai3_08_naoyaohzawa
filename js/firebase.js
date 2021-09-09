
// Firebaseの処理を描き始めます
var firebaseConfig = {
    apiKey: "",
    authDomain: "dev21chat-85eaa.firebaseapp.com",
    databaseURL: "https://dev21chat-85eaa-default-rtdb.firebaseio.com/",
    projectId: "dev21chat-85eaa",
    storageBucket: "dev21chat-85eaa.appspot.com",
    messagingSenderId: "997523984683",
    appId: "1:997523984683:web:4a950253d9091f4afc356e"  //提出するときは空欄にする
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//firebaseのデーターベース（保存させる場所）
const rootRef = firebase.database();

// 送信するためのfunction
function sendPost() {  
    let str = $("#shipname").val();
    // shipnameは大体英単語2文字が多く、間にスペースがある。
    // スペースがあるとid名にスペースが入ってしまうので、スペースを削除する
    let strNew = str.replace(/\s+/g, "");
    rootRef.ref('/ships/' + strNew).set({
        shipID: strNew,
        shipname: $("#shipname").val(),
        seller: $("#seller").val(),
        buyer: $("#buyer").val(),
        text: $("#project").val()
    });
    $("#shipname").val("");
    $("#seller").val("");
    $("#buyer").val("");
    $("#project").val("");
    alert("shipを追加しました")
}

// usersの中にdataを追加


// 送信ボタンを押したらsendPost()実行
$("#send").on("click", function () {
    if($("#shipname").val() == ""){
        alert("Ship Nameが空欄です")
        return;
    }else if($("#buyer").val() == ""){
        alert("Buyerが空欄です")
        return;
    }else{
        sendPost();
    }
});

// 受信処理
function postToDisplay() {  
    rootRef.ref('/ships/').on("child_added", function (data) {
        let v = data.val(); 
        let k = data.key;

        let str = `
        <tr>
        <th class="ship-name" id="${v.shipID}">${v.shipname}</th>  
        <th class="project-name">${v.text}</th>
        <th><button class="btn-update"  id="${v.shipID}-update">update</button></th>
        <th><button class="btn-delete" value="${v.shipID}" id="${v.shipID}-delete">delete</button></th>
        </tr>
        `
        $("#output").prepend(str);
    });

    $("#project").on("keydown", function (e) {
        if(e.keyCode=="Enter"){
            sendPost();
        };
    });
};

// 受信結果を表示する
postToDisplay();


// 更新ボタンをおす



// データの削除
$("#ship-list").on("click", function (e) {  
    // sectionのship-list内がクリックされたら、そのクリックされた箇所のidを取得する
    let deleteCheck = e.target.id;
    // そのidにdeleteと言う文字が入っているかcheck
    if(~deleteCheck.indexOf("delete")){
        //id名から-deleteという文字を削除する
        let newID = deleteCheck.replace("-delete", "")

        var confirm = window.confirm("本当にListから削除しますか？")

        if(confirm == true){
            // delete btnのidから-deleteと言う文字をreplaceしてshipnameと同じidにする。
            // そうするとrealtime Database上のlistの名前と一致するので、削除が実行される
            let newID = e.target.id.replace("-delete", "")

            // databaseから削除する
            rootRef.ref('ships').child(newID).remove();
            location.reload();
        }else return;
    }else return;
});



// linkにクリック
$("#ship-list").on("click", function (e) {  
    console.log(e);    
});

// 時計を表示（気分でつけただけ)
$(function(){
    setInterval(function(){
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var w = now.getDay();
    var wd = ['日', '月', '火', '水', '木', '金', '土'];
    var h = now.getHours();
    var mi = now.getMinutes();
    var s = now.getSeconds();
    $('#date').text(y + '年' + m + '月' + d + '日' + h + '時' + mi + '分' + s + '秒' + '(' + wd[w] + ')');
    }, 1000);
});


