$(function () {

    $("#addFriend").click(function () {
        $('.addFriend.modal')
//            .modal('setting', {
//                closable:false,
//                transition: 'horizontal flip',
//                allowMultiple:true
//            })
            .modal({detachable:false})
            .modal('show')
        ;
    });

    $("#createDocument").click(function () {
        $('.createDocument.modal')
            .modal('show')
        ;
    });
    $("#createSlide").click(function () {
        $('.createSlide.modal')
            .modal('show')
        ;
    });
});

function opendocument(spaceId, fileId) {
    window.open("/coordination/" + spaceId + "/" + fileId);
}

function openslide(spaceId, fileId) {
    window.open("/slide/" + spaceId + "/" + fileId);
}

function removeFriend(friendId) {
    var confirmDelete = window.confirm("确定要删除此好友吗？")
    if(confirmDelete) {
        $.ajax({
            url: '/user/delete/' + friendId+'/'+spaceId,
            type: 'POST',
            success: function (data) {
                if(data.success) {
                    var uDom = $('#spaceFriend'+friendId);
                    uDom.fadeOut(400,function(){
                        uDom.remove();
                    });
                }
            }
        });
    }
}

function spaceJump(spaceId) {
    window.open("/space/" + spaceId+"/"+userId);
}

function createDoc() {
    var documentName = $('#documentName').val();
    $.ajax({
        url: '/createDocument/' + spaceId,
        type: 'POST',
        data: {
            name: documentName
        },
        success: function (data) {
            var html = '';
            html += '<div class="item" onclick="opendocument(' + spaceId + ',' + data.id + ')" style="min-height: 0;">';
            html += '    <div>';
            html += '        <img src="'+basePath+'image/file_icon_document.png" style="width: 125px; height:125px;">';
            html += '    </div>';
            html += '    <div class="content">';
            html += '        <div style="overflow: hidden;height:20px;">' + documentName + '</div>';
            html += '    </div>';
            html += '</div>';
            $('#fileContent').append(html);
            $('#documentName').val('');
        }
    });
}

function createSlide() {
    var slideName = $('#slideName').val();
    $.ajax({
        url: '/createSlide/' + spaceId,
        type: 'POST',
        data: {
            name: slideName
        },
        success: function (data) {
            var html = '';
            html += '<div class="item" onclick="openslide(' + spaceId + ',' + data.id + ')" style="min-height: 0;">';
            html += '    <div>';
            html += '        <img src="'+basePath+'image/file_icon_slide.png" style="width: 125px; height:125px;">';
            html += '    </div>';
            html += '    <div class="content">';
            html += '        <div style="overflow: hidden;height:20px;">' + slideName + '</div>';
            html += '    </div>';
            html += '</div>';
            $('#fileContent').append(html);
            $('#slideName').val('');
        }
    });
}

function searchFriends() {
    var name = $('#searchName').val();
    $.ajax({
        url: '/user/search/name',
        type: 'POST',
        data: {
            name: name
        },
        success: function (data) {
            $('#searchName').val('');
            var html = '';
            data.forEach(function (u) {
                html += '<div class="item" id="userItem' + u.id + '" style="min-height: 0;">';
                html += '    <div>';
                html += '        <img src="'+basePath+'image/people.jpg" style="width: 115px; height:125px;">';
                html += '    </div>';
                html += '    <div class="content">';
                html += '        <div style="overflow: hidden;height:20px;">' + u.name + '</div>';
                html += '        <div style="overflow: hidden;height:20px;"> 电话 :' + u.telephone + '</div>';
                html += '        <div class="ui button" onclick="addFreind(' + u.id + ')">添加</div>';
                html += '    </div>';
                html += '</div>';
            });
            $('#friendList').html(html);

            $('.friendList.modal')
                .modal({detachable:false})
                .modal('show');
        }
    });
}

function addFreind(id) {
    $.ajax({
        url: '/user/add/' + id + '/' + spaceId,
        type: 'POST',
        success: function (data) {
            console.log(data);
            if (data.success) {
                var itemButton =  $('#userItem' + id + ' .content .button');
                itemButton.addClass('disabled');
                itemButton.html(data.message);
            } else {
                alert(data.message);
            }
        }
    });
}