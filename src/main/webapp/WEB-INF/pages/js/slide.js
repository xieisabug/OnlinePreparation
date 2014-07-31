var stompClient = null;
var editor, content;
var diff = new diff_match_patch();
//保持光标位置不变得逻辑
var savedSelection, savedSelectionActiveElement, slideIndex = 0, slidePartId = 0, parts;

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
        //演示文稿页面的创建监听
        stompClient.subscribe('/coordination/slidePart' + coordinationId, function (body) {
            var data = JSON.parse(body.body);
            console.log(data);
            var html, container = $('#container');
            var index = container.children().size() - 1;
            html = '';
            html += '<div class="slide_part_review" id="slide_review_' + data.id + '" onclick="selectPart(' + index + ',' + data.id + ')">';
            html += '</div>';
//            console.log(html);
            container.append(html);
            parts.push({
                id : data.id,
                content:''
            });
        });
        //用户协同编辑文档订阅
        stompClient.subscribe('/coordination/slide' + coordinationId, function (data) {
            console.log(data);
            var body = JSON.parse(data.body);

            var slideReview = $('#slide_review_' + body.slidePartId);
            var slideReviewContent,index;
//            for(index = 0; index < parts.length; index++) {
//                if(parts[index].id==slidePartId) {
//                    slideReviewContent = parts[index].content;
//                    break;
//                }
//            }
            slideReviewContent = parts[body.slidePartIndex].content;
            console.log('slideReviewContent:');
            console.log(slideReviewContent);
            console.log(slideReviewContent.length);
            var diffSlideReview = diff.diff_fromDelta(slideReviewContent, body.delta.delta);
            var patchSlideReview = diff.patch_make(slideReviewContent, diffSlideReview);
            var resultSlideReview = diff.patch_apply(patchSlideReview, slideReviewContent);
            slideReview.html(resultSlideReview[0]);
            parts[body.slidePartIndex].content = resultSlideReview[0];

            if (body.slidePartId == slidePartId && body.delta.id != id) {
                var old = editor.getContent();
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

                var diffs = diff.diff_fromDelta(old, body.delta.delta);
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
        });
        //初始化文档
        stompClient.subscribe('/app/initSlide/' + coordinationId + '/' + fileId, function (initData) {
            console.log(initData);
            var body = JSON.parse(initData.body);
            var slide = body.slide;
            parts = slide.parts;
            console.log(slide);
            var container = $('#container'), i, p, html;
            for (i = 0; i < slide.parts.length; i++) {
                p = slide.parts[i];
                html = '';
                html += '<div class="slide_part_review" id="slide_review_' + p.id + '" onclick="selectPart(' + i + ',' + p.id + ')">';
                html += p.content;
                html += '</div>';
                container.append(html);
            }
            editor.setContent(slide.parts[0].content);
            if (content == null || content == undefined) {
                //初始化值
                content = slide.parts[0].content;
            }
            slidePartId = slide.parts[0].id;
            var chat = body.chat;
            chat.forEach(function (item) {
                showChat(item);
            });
        });
        $('#loader').removeClass('active');
    }, function (err) {
        console.log(err);
        connect();
    });
}

//脱离连接的函数
function disconnect() {
    stompClient.disconnect();
    setConnected(false);
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

function selectPart(index, id) {
    slideIndex = index;
    slidePartId = id;
//    var slideContent = $('#slide_review_'+slidePartId);
    console.log(parts[index]);
    editor.setContent(parts[index].content);
    content = parts[index].content;
}

function addPart() {
    $.ajax({
        url: '/createSlidePart/' + coordinationId + '/' + slideId,
        type: 'POST'
    });
}

function playSlide(){
    window.open("/basicSlideShow/" + fileId);
}

$(function () {
    editor = UE.getEditor('ueditor');
    //用于进行差分同步的工具

    /**
     * 对文档进行差分同步的关键函数，在函数中，
     * 对本地的代码进行差分分析，将分析的结果转化
     * 为非常简略的字符串，发送到服务器
     */
    function contentEvent() {
        var newContent = editor.getContent();
        console.log("old content:");
        console.log(content);
        console.log(content.length);

        console.log("new content:");
        console.log(newContent);
        console.log(newContent.length);

        var diffs = diff.diff_main(content, newContent);
        var delta = diff.diff_toDelta(diffs);
        content = newContent;
        var data = JSON.stringify({
            'delta': delta,
            'id': id
        });
        console.log(data);
        stompClient.send("/app/slide/" + coordinationId + "/" + slidePartId + '/' + slideIndex, {}, data);
    }

    try {
        document.execCommand('MultipleSelection', null, true);
    } catch (ex) {
        console.log(ex);
    }

    rangy.init();

    connect();

    editor.addListener('keyup', contentEvent);

});