var stompClient = null;
var editor = UE.getEditor('ueditor');
var diff = new diff_match_patch();
//保持光标位置不变得逻辑
var savedSelection, savedSelectionActiveElement, content;

//连接服务器的函数
function connect() {
    var socket = new SockJS('/coordination');
    stompClient = Stomp.over(socket);
    stompClient.connect('', '', function (frame) {
        console.log('Connected: ' + frame);
        //用户聊天订阅
        stompClient.subscribe('/userChat/chat' + coordinationId, function (chat) {
            showChat(JSON.parse(chat.body));
        });
        //用户协同编辑文档订阅
        stompClient.subscribe('/coordination/coordination' + coordinationId, function (word) {
            var wordJ = JSON.parse(word.body);
//            var c = editor.getContent();
            var old = editor.getContent();
            if (wordJ.id != id) {
                save();
                //c是保存了光标的内容(添加了span)
                var c = editor.getContent();
                //找到保存了光标信息的内容，与原始版本进行比较，获取到diff
                var diffSelections = diff.diff_main(c, old);
                console.log('after save selection diffs:');
                console.log(diffSelections);

                //保存插入了的span的信息，最多两个span
                //i循环变量,diffSel循环个体,span存储span信息的数组,step计算span位置
                var i, diffSel, span = [], step = 0;
                for (i = 0; i < diffSelections.length; i++) {
                    diffSel = diffSelections[i];
                    if (diffSel[0] != 0) {
                        span.push({
                            step: step,
                            content: diffSel[1]
                        });
                    }
                    step += diffSel[1].length;
                }
                console.log('before span:');
                console.log(span);

                var diffs = diff.diff_fromDelta(old, wordJ.delta);
                console.log('diffs:');
                console.log(diffs);

                //计算出两个span在进行了差分同步之后所在的位置
                var second = false;//是否计算到了第二个span
                step = 0;
                for (i = 0; i < diffs.length && span.length; i++) {
                    diffSel = diffs[i];//对每一个diff进行扫描
                    //如果是相等的部分，则直接向后搜索
                    if (diffSel[0] == 0) {
                        step += diffSel.length;
                    } else if (diffSel[0] == 1) {//如果是增加的部分，则相应的span也需要向后移动
                        second ? span[1].step += diffSel[1].length : span[0].step += diffSel[1].length;
                    } else if (diffSel[0] == -1) {//如果是减少的部分，则相应的span也需要向前移动
                        second ? span[1].step -= diffSel[1].length : span[0].step -= diffSel[1].length;
                    }
                    //如果之前与原文相等的地方已经超过了span记录的位置，则不需要继续记录
                    if (!second && step >= span[0].step) {
                        //如果没有第二个span，则直接结束循环
                        if (span.length == 2) {
                            break;
                        }
                        //转为第二个span来记录
                        second = true;
                    }
                    //如果相等的地方已经超过了第二个span记录的位置，则停止继续记录
                    if (second && step >= span[1].step) {
                        break;
                    }
                }
                console.log('after span:');
                console.log(span);

                var patches = diff.patch_make(old, diffs);
                console.log('patches:');
                console.log(patches);
                var result = diff.patch_apply(patches, old);//生成未增加光标位置信息的结果
                console.log('result:');
                console.log(result);

                var newResult = '', r = result[0];//newResult用来保存增加了span后的结果，r原文的结果
                //将第一个span插入相应位置
                if(span.length) {
                    newResult += r.substring(0, span[0].step);
                    newResult += span[0].content;
                    //如果有第二个span，那么将第二个也插入，否则只插入第一个
                    if (span.length == 2) {
                        newResult += r.substring(span[0].step, span[1].step);
                        newResult += span[1].content;
                        newResult += r.substring(span[1].step);
                    } else {
                        newResult += r.substring(span[0].step);
                    }
                } else {
                    newResult = r;
                }

                console.log('new result: ');
                console.log(newResult);

                //将带有光标信息的新结果设为正式内容
                editor.setContent(newResult);
                //恢复光标位置
                restore();
            }
//            changeNodeByIndex(wordJ.index, decodeURIComponent(wordJ.content), username == word.username);
        });
        //初始化文档
        stompClient.subscribe('/app/initDocument/' + coordinationId+'/' + fileId, function (initData) {
            console.log(initData);
            var body = JSON.parse(initData.body);
            content = body.document.content;
            var chat = body.chat;
            editor.setContent(content);
            chat.forEach(function(item) {
                showChat(item);
            });
        });
        $('#loader').removeClass('active');
    }, function () {
        connect();
    });
}

//发送聊天信息
function sendName() {
    var input = $('#chat_input');
    var inputValue = input.val();
    input.val("");
    stompClient.send("/app/userChat", {}, JSON.stringify({
        'name': encodeURIComponent(name),
        'chatContent': encodeURIComponent(inputValue),
        'coordinationId': coordinationId
    }));
}

//显示聊天信息
function showChat(message) {
    var response = document.getElementById('chat_content');
    response.value += decodeURIComponent(message.name) + ':' + decodeURIComponent(message.chatContent) + '\n';
}

function save() {
    if (savedSelection) {//如果已经存在了保存的选择，则将以前的删除
        rangy.removeMarkers(savedSelection);
    }
    //获得保存的选择节点信息
    savedSelection = rangy.saveSelection(editor.window);
    console.log("Save Selection :");
    console.log(savedSelection);
    //获取当前活动的元素
    savedSelectionActiveElement = document.activeElement;
}

function restore() {
//    savedSelection = rangy.saveSelectionOtherHalf(editor.window, savedSelection);
    console.log('restore:');
    console.log(savedSelection);
    //如果保存了光标的信息，则进行恢复
    if (savedSelection) {
        //恢复光标
        rangy.restoreSelection(savedSelection, true);
        //将存储的恢复信息删除
        savedSelection = null;
        //获取焦点
        window.setTimeout(function () {
            if (savedSelectionActiveElement && typeof savedSelectionActiveElement.focus != 'undefined') {
                savedSelectionActiveElement.focus();
            }
        }, 1);
    }
}

$(function () {
    //用于进行差分同步的工具

    /**
     * 对文档进行差分同步的关键函数，在函数中，
     * 对本地的代码进行差分分析，将分析的结果转化
     * 为非常简略的字符串，发送到服务器
     */
    function contentEvent() {
        var newContent = editor.getContent();
        var diffs = diff.diff_main(content, newContent);
        var delta = diff.diff_toDelta(diffs);
        content = newContent;
        var data = JSON.stringify({
            'delta': delta,
            'id': id
        });
//        console.log(data);
        stompClient.send("/app/coordination/" + coordinationId, {}, data);
    }

    //判断浏览器后，对不同的浏览器添加事件
//    if (UE.browser.ie) {
//        editor.addListener('keyup', contentEvent);
//    } else {
//        editor.addListener('contentChange', contentEvent);
//    }
    try {
        document.execCommand('MultipleSelection', null, true);
    } catch (ex) {
    }

    rangy.init();

    //在内容改变之前，保存下来光标所在的节点和光标所在的位置
//    editor.addListener('beforesetcontent', save);
    //内容改变了之后，将光标重新设置到节点和位置
//    editor.addListener('aftersetcontent', restore);

    connect();

    editor.addListener('keyup', contentEvent);

});